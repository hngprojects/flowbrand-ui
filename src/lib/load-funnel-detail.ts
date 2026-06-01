import {
  getFunnelDetail,
  getFunnelStage,
  getFunnelStages,
} from "@/actions/funnels";
import type { FunnelDetailApi } from "@/lib/funnel-api-types";
import {
  funnelDetailIsReady,
  funnelHasDisplayContent,
  funnelHasMinimalContent,
  parseFunnelDetail,
  parseFunnelStage,
  parseFunnelStagesList,
} from "@/lib/funnel-api-types";
import { STRATEGY_GENERATION_FAILED_MESSAGE } from "@/lib/funnel-generation-errors";
import { flowLog } from "@/lib/flow-debug-log";

export type FetchFunnelOptions = {
  /** When true, return stages even if tasks are not loaded yet (used after long polls). */
  allowPartial?: boolean;
};

// async function mergeStageTasks(
//   funnelId: string,
//   detail: FunnelDetailApi,
// ): Promise<FunnelDetailApi> {
//   let stages = [...(detail.stages ?? [])];
//   if (stages.length === 0) return detail;

//   const needsTasks = stages.some((s) => (s.tasks?.length ?? 0) === 0);
//   if (!needsTasks) return detail;

//   const ordered = [getFocusStage({ ...detail, stages }), ...stages].filter(
//     (s): s is NonNullable<typeof s> => Boolean(s?.stageId),
//   );

//   const seen = new Set<string>();
//   for (const target of ordered) {
//     const stageId = target.stageId;
//     if (!stageId || seen.has(stageId)) continue;
//     seen.add(stageId);

//     const existing = stages.find((s) => s.stageId === stageId);
//     if ((existing?.tasks?.length ?? 0) > 0) continue;

//     const stageRes = await getFunnelStage(funnelId, stageId);
//     if (!stageRes.ok) continue;

//     const full = parseFunnelStage(stageRes.data);
//     if (!full) continue;

//     stages = stages.map((stage) =>
//       stage.stageId === full.stageId ? { ...stage, ...full } : stage,
//     );

//     if (stages.some((s) => (s.tasks?.length ?? 0) > 0)) {
//       break;
//     }
//   }

//   return { ...detail, stages };
// }

async function mergeStageTasks(
  funnelId: string,
  detail: FunnelDetailApi,
): Promise<FunnelDetailApi> {
  let stages = [...(detail.stages ?? [])];

  if (stages.length === 0) {
    return detail;
  }

  /**
   * IMPORTANT:
   * Backend enforces stage locking.
   *
   * We MUST NOT request locked stages or the API returns 403.
   *
   * Only hydrate:
   * - active stages
   * - completed stages
   */
  const availableStages = stages.filter((stage) => {
    const status = stage.status?.toLowerCase();

    return (
      status === "active" || status === "complete" || status === "completed"
    );
  });

  if (availableStages.length === 0) {
    return detail;
  }

  for (const target of availableStages) {
    const stageId = target.stageId;

    if (!stageId) continue;

    const existing = stages.find((s) => s.stageId === stageId);

    /**
     * Skip already hydrated stages
     */
    if ((existing?.tasks?.length ?? 0) > 0) {
      continue;
    }

    try {
      const stageRes = await getFunnelStage(funnelId, stageId);

      /**
       * Ignore forbidden locked stages gracefully
       */
      if (!stageRes.ok) {
        if (
          stageRes.status === 403 ||
          stageRes.error?.toLowerCase().includes("locked")
        ) {
          flowLog("strategy", "mergeStageTasks → skipped locked stage", {
            funnelId,
            stageId,
          });

          continue;
        }

        continue;
      }

      const full = parseFunnelStage(stageRes.data);

      if (!full) {
        continue;
      }

      stages = stages.map((stage) =>
        stage.stageId === full.stageId
          ? {
              ...stage,
              ...full,
            }
          : stage,
      );
    } catch (error) {
      flowLog("strategy", "mergeStageTasks → stage fetch failed", {
        funnelId,
        stageId,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return {
    ...detail,
    stages,
  };
}

async function loadFunnelCore(
  funnelId: string,
): Promise<
  { ok: true; detail: FunnelDetailApi } | { ok: false; error: string }
> {
  const res = await getFunnelDetail(funnelId);
  if (!res.ok) {
    return { ok: false, error: res.error };
  }

  let detail = parseFunnelDetail(res.data);
  if (!detail) {
    return { ok: false, error: "Could not read your strategy." };
  }

  if ((detail.stages?.length ?? 0) === 0) {
    const stagesRes = await getFunnelStages(funnelId);
    if (stagesRes.ok) {
      const stages = parseFunnelStagesList(stagesRes.data);
      if (stages.length > 0) {
        detail = { ...detail, stages };
      }
    }
  }

  return { ok: true, detail };
}

/** Load funnel detail and fall back to /stages + /stages/:id when the summary is empty. */
export async function fetchEnrichedFunnelDetail(
  funnelId: string,
  options: FetchFunnelOptions = {},
): Promise<
  | { ok: true; detail: FunnelDetailApi; partial?: boolean }
  | { ok: false; error: string }
> {
  const core = await loadFunnelCore(funnelId);
  if (!core.ok) {
    flowLog("strategy", "fetchEnrichedFunnelDetail → core load failed", {
      funnelId,
      error: core.error,
    });
    return core;
  }

  let detail = core.detail;
  const stageCount = detail.stages?.length ?? 0;

  if (funnelHasDisplayContent(detail)) {
    detail = await mergeStageTasks(funnelId, detail);
    if (funnelDetailIsReady(detail)) {
      flowLog("strategy", "fetchEnrichedFunnelDetail → ready", {
        funnelId,
        stageCount,
      });
      return { ok: true, detail };
    }
  }

  if (options.allowPartial && funnelHasMinimalContent(detail)) {
    detail = await mergeStageTasks(funnelId, detail);
    const partial = !funnelHasDisplayContent(detail);
    flowLog("strategy", "fetchEnrichedFunnelDetail → partial", {
      funnelId,
      stageCount,
      partial,
      hasDisplayContent: funnelHasDisplayContent(detail),
    });
    return { ok: true, detail, partial };
  }

  flowLog("strategy", "fetchEnrichedFunnelDetail → not ready", {
    funnelId,
    stageCount,
    allowPartial: options.allowPartial,
    hasMinimal: funnelHasMinimalContent(detail),
    hasDisplay: funnelHasDisplayContent(detail),
  });
  return {
    ok: false,
    error: STRATEGY_GENERATION_FAILED_MESSAGE,
  };
}

/** Fast check used while polling — skips per-stage task fetches unless content is ready. */
export async function probeFunnelDisplayReady(
  funnelId: string,
): Promise<FunnelDetailApi | null> {
  const core = await loadFunnelCore(funnelId);
  if (!core.ok) return null;

  if (!funnelHasDisplayContent(core.detail)) {
    flowLog("strategy", "probeFunnelDisplayReady → empty content", {
      funnelId,
      stageCount: core.detail.stages?.length ?? 0,
    });
    return null;
  }

  const enriched = await mergeStageTasks(funnelId, core.detail);
  const ready = funnelDetailIsReady(enriched);
  flowLog("strategy", "probeFunnelDisplayReady → result", { funnelId, ready });
  return ready ? enriched : null;
}
