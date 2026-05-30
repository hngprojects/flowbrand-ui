import { completeFunnelStage, updateFunnelTaskStatus } from "@/actions/funnels";
import { unwrapActionResult } from "@/lib/api-query";

export async function completeStage(
  funnelId: string,
  stageId: string,
  taskIds: string[] = [],
) {
  for (const taskId of taskIds) {
    const taskRes = await updateFunnelTaskStatus({
      funnelId,
      stageId,
      taskId,
      status: "complete",
    });
    unwrapActionResult(taskRes, "Could not mark task complete.");
  }

  const stageRes = await completeFunnelStage(funnelId, stageId);
  return unwrapActionResult(stageRes, "Could not complete this stage.");
}
