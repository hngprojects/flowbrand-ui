"use server";

import { completeStage as completeStageAction } from "@/actions/funnels";
import { flowLog } from "@/lib/flow-debug-log";

export type CompletedStageData = {
  completedStage: {
    stageId: string;
    position: number;
    name: string;
    status: string;
    completedAt: string;
  };
  unlockedStage: {
    stageId: string;
    position: number;
    name: string;
    status: string;
    unlockedAt: string;
  } | null;
};

export async function completeStage(
  funnelId: string,
  stageId: string,
): Promise<{ success: boolean; error?: string; data?: CompletedStageData }> {
  flowLog("strategy", "completeStage → calling backend", {
    funnelId,
    stageId,
  });

  const result = await completeStageAction(funnelId, stageId);

  if (!result.ok) {
    flowLog("strategy", "completeStage → failed", {
      error: result.error,
      status: result.status,
    });
    return { success: false, error: result.error };
  }

  // Read completedStage and unlockedStage from the response
  const raw = result.data as Record<string, unknown> | null;
  const inner =
    (raw?.data as Record<string, unknown>) ??
    (raw as Record<string, unknown>) ??
    {};

  const completedStage = inner?.completedStage as
    | CompletedStageData["completedStage"]
    | undefined;
  const unlockedStage =
    (inner?.unlockedStage as CompletedStageData["unlockedStage"]) ?? null;

  flowLog("strategy", "completeStage → success", {
    funnelId,
    stageId,
    completedStage: completedStage?.stageId,
    unlockedStage: unlockedStage?.stageId ?? "none (last stage)",
  });

  return {
    success: true,
    data: completedStage ? { completedStage, unlockedStage } : undefined,
  };
}
