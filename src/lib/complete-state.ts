// import { flowLog } from "@/lib/flow-debug-log";

// export async function completeStage(funnelId: string, stageId: string) {
//   /**
//    * TODO: Replace with real backend endpoint
//    * POST /api/funnels/{funnelId}/stages/{stageId}/complete
//    * Waiting on backend to confirm contract.
//    */

//   if (process.env.NODE_ENV === "development") {
//     console.warn(
//       "[completeStage] STUB — no API call made. Waiting for backend endpoint.",
//       { funnelId, stageId },
//     );
//   }
//   flowLog("strategy", "completeStage → pending backend integration", {
//     funnelId,
//     stageId,
//   });

//   return {
//     success: true,
//   };
// }

"use server";

import { completeStage as completeStageAction } from "@/actions/funnels";
import { flowLog } from "@/lib/flow-debug-log";

export async function completeStage(
  funnelId: string,
  stageId: string,
): Promise<{ success: boolean; error?: string }> {
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

    return {
      success: false,
      error: result.error,
    };
  }

  flowLog("strategy", "completeStage → success", {
    funnelId,
    stageId,
  });

  return { success: true };
}
