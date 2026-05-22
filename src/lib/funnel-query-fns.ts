import {
  generateFunnel,
  getFunnelGenerationStatus,
  listFunnels,
  type GenerateFunnelInput,
} from "@/actions/funnels";
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
import {
  clearActiveFunnelGeneration,
  saveActiveFunnelGeneration,
} from "@/lib/funnel-generation-storage";

export async function fetchFunnelList(page = 1): Promise<FunnelDetailApi[]> {
  const res = await listFunnels(page);
  const data = unwrapActionResult(res, "Could not load your funnels.");
  return parseFunnelList(data);
}

export async function fetchGenerationStatus(
  funnelId: string,
): Promise<FunnelGenerationSnapshot> {
  const res = await getFunnelGenerationStatus(funnelId);
  const data = unwrapActionResult(
    res,
    "Could not check strategy generation status.",
  );
  const snapshot = parseGenerationStatus(data, funnelId);
  if (!snapshot) {
    throw new Error("Could not read generation status.");
  }
  return snapshot;
}

export async function fetchFunnelDisplay(
  funnelId: string,
  allowPartial = false,
): Promise<FunnelDetailApi> {
  if (!allowPartial) {
    const ready = await probeFunnelDisplayReady(funnelId);
    if (ready) return ready;
  }

  const res = await fetchEnrichedFunnelDetail(funnelId, { allowPartial });
  if (!res.ok) {
    throw new Error(res.error);
  }
  return res.detail;
}

export async function startFunnelGeneration(
  input: GenerateFunnelInput,
): Promise<string> {
  const res = await generateFunnel(input);
  const data = unwrapActionResult(res, "Could not start strategy generation.");

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

export function clearStoredFunnelGeneration(): void {
  clearActiveFunnelGeneration();
}
