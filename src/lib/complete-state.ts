import { flowLog } from "@/lib/flow-debug-log";

export async function completeStage(
  funnelId: string,
  stageId: string,
) {
  /**
   * TEMPORARY PLACEHOLDER
   *
   * Replace with real backend endpoint
   * once backend confirms API contract.
   */

  flowLog("strategy", "completeStage → pending backend integration", {
    funnelId,
    stageId,
  });

  return {
    success: true,
  };
}