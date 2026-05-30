import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { getPostAuthRedirect } from "@/actions/auth";
import { listFunnels } from "@/actions/funnels";
import { parseFunnelList, type FunnelDetailApi } from "@/lib/funnel-api-types";
import { saveActiveFunnelGeneration } from "@/lib/funnel-generation-storage";
import {
  isOnboardingSessionComplete,
  type ParsedOnboardingSession,
} from "@/lib/onboarding-api";
import { isNewStrategyFlow } from "@/lib/new-strategy";
import { STRATEGY_ROUTE } from "@/routes";

function pickRecoverableFunnel(
  funnels: FunnelDetailApi[],
): FunnelDetailApi | null {
  return (
    funnels.find((funnel) => funnel.status?.toLowerCase() === "active") ??
    funnels.find((funnel) => funnel.status?.toLowerCase() !== "failed") ??
    null
  );
}

/** Send users with a finished session or existing funnel to the strategy page. */
export async function redirectToStrategyHomeIfReady(
  router: AppRouterInstance,
): Promise<boolean> {
  if (isNewStrategyFlow()) {
    return false;
  }

  const path = await getPostAuthRedirect();
  if (path === STRATEGY_ROUTE) {
    router.replace(STRATEGY_ROUTE);
    return true;
  }

  return false;
}

export async function redirectToExistingFunnelIfAny(
  router: AppRouterInstance,
  source: "wizard" | "document_upload" = "wizard",
): Promise<boolean> {
  if (isNewStrategyFlow()) {
    return false;
  }

  const list = await listFunnels(1);
  if (!list.ok) {
    return false;
  }

  const funnels = parseFunnelList(list.data);
  const funnelId = pickRecoverableFunnel(funnels)?.funnelId;
  if (!funnelId) {
    return false;
  }

  saveActiveFunnelGeneration({
    funnelId,
    idempotencyKey: crypto.randomUUID(),
    source,
    startedAt: Date.now(),
  });
  router.replace(STRATEGY_ROUTE);
  return true;
}

export function shouldAdvanceAfterStepConflict(
  session: ParsedOnboardingSession,
): boolean {
  if (isNewStrategyFlow()) {
    return true;
  }
  return !isOnboardingSessionComplete(session);
}
