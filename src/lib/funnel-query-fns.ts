import {
  generateFunnel,
  getFunnelGenerationStatus,
  listFunnels,
  type GenerateFunnelInput,
} from "@/actions/funnels";
import { scheduleApiRequest } from "@/lib/api-request-scheduler";
import { unwrapActionResult } from "@/lib/api-query";
import {
  fetchEnrichedFunnelDetail,
  probeFunnelDisplayReady,
} from "@/lib/load-funnel-detail";
import {
  parseFunnelIdFromGenerate,
  parseFunnelList,
  parseGenerationStatus,
  type FunnelDetailApi,
  type FunnelGenerationSnapshot,
} from "@/lib/funnel-api-types";
import { classifyGenerateFunnelError } from "@/lib/funnel-generation-errors";
import { flowLog, flowLogError } from "@/lib/flow-debug-log";
import { funnelHasDisplayContent } from "@/lib/funnel-api-types";
import {
  clearActiveFunnelGeneration,
  reserveIdempotencyKey,
  saveActiveFunnelGeneration,
} from "@/lib/funnel-generation-storage";

export class GenerateFunnelError extends Error {
  needsOnboarding?: boolean;
  rateLimited?: boolean;

  constructor(
    message: string,
    options?: { needsOnboarding?: boolean; rateLimited?: boolean },
  ) {
    super(message);
    this.name = "GenerateFunnelError";
    this.needsOnboarding = options?.needsOnboarding;
    this.rateLimited = options?.rateLimited;
  }
}

export async function fetchFunnelList(page = 1): Promise<FunnelDetailApi[]> {
  return scheduleApiRequest(async () => {
    const res = await listFunnels(page);
    const data = unwrapActionResult(res, "Could not load your funnels.");
    return parseFunnelList(data);
  });
}

export async function fetchGenerationStatus(
  funnelId: string,
): Promise<FunnelGenerationSnapshot> {
  return scheduleApiRequest(async () => {
    const res = await getFunnelGenerationStatus(funnelId);
    const data = unwrapActionResult(
      res,
      "Could not check strategy generation status.",
    );
    const snapshot = parseGenerationStatus(data, funnelId);
    if (!snapshot) {
      throw new Error("Could not read generation status.");
    }
    flowLog("strategy", "fetchGenerationStatus → ok", {
      funnelId,
      status: snapshot.status,
    });
    return snapshot;
  });
}

export async function fetchFunnelDisplay(
  funnelId: string,
  allowPartial = false,
): Promise<FunnelDetailApi> {
  flowLog("strategy", "fetchFunnelDisplay → begin", { funnelId, allowPartial });
  if (!allowPartial) {
    const ready = await probeFunnelDisplayReady(funnelId);
    if (ready) return ready;
  }

  const res = await fetchEnrichedFunnelDetail(funnelId, { allowPartial });
  if (!res.ok) {
    flowLogError("strategy", "fetchFunnelDisplay", res.error, { funnelId });
    throw new Error(res.error);
  }
  flowLog("strategy", "fetchFunnelDisplay → ok", {
    funnelId,
    partial: res.partial,
    hasDisplayContent: funnelHasDisplayContent(res.detail),
    stageCount: res.detail.stages?.length ?? 0,
  });
  return res.detail;
}

async function resolveFunnelIdAfterGenerate(
  data: unknown,
  input: GenerateFunnelInput,
): Promise<string> {
  let funnelId = parseFunnelIdFromGenerate(data);

  if (!funnelId) {
    const funnels = await fetchFunnelList(1);
    funnelId = funnels[0]?.funnelId ?? null;
  }

  if (!funnelId) {
    throw new Error(
      "Strategy generation started on the server, but we could not read the funnel id. Please refresh the strategy page.",
    );
  }

  saveActiveFunnelGeneration({
    funnelId,
    idempotencyKey: input.idempotencyKey,
    source: input.source,
  });

  return funnelId;
}

/** POST /api/funnels/generate — 200/202/409; reuses reserved idempotency_key on retry. */
export async function startFunnelGeneration(
  input: GenerateFunnelInput,
): Promise<string> {
  flowLog("funnel", "startFunnelGeneration → begin", {
    source: input.source,
    uploadCount: input.uploadIds?.length ?? 0,
  });
  const payload: GenerateFunnelInput = {
    source: input.source,
    idempotencyKey: input.idempotencyKey || reserveIdempotencyKey(input.source),
    uploadIds: input.source === "document_upload" ? input.uploadIds : undefined,
  };

  const res = await scheduleApiRequest(() => generateFunnel(payload));

  if (res.ok) {
    const funnelId = await resolveFunnelIdAfterGenerate(res.data, payload);
    flowLog("funnel", "startFunnelGeneration → ok", {
      funnelId,
      httpStatus: res.status,
    });
    return funnelId;
  }

  const classified = classifyGenerateFunnelError(
    res.status,
    res.data,
    res.error,
    payload.source,
  );

  if (res.status === 409) {
    try {
      const funnels = await fetchFunnelList(1);
      const existingId = funnels[0]?.funnelId;
      if (existingId) {
        saveActiveFunnelGeneration({
          funnelId: existingId,
          idempotencyKey: payload.idempotencyKey,
          source: payload.source,
        });
        flowLog("funnel", "startFunnelGeneration → 409 reused existing", {
          funnelId: existingId,
        });
        return existingId;
      }
    } catch {
      // fall through
    }
  }

  flowLogError("funnel", "startFunnelGeneration", classified.message, {
    status: res.status,
    needsOnboarding: classified.needsOnboarding,
    rateLimited: classified.rateLimited,
  });
  throw new GenerateFunnelError(classified.message, {
    needsOnboarding: classified.needsOnboarding,
    rateLimited: classified.rateLimited,
  });
}

export function clearStoredFunnelGeneration(): void {
  clearActiveFunnelGeneration();
}
