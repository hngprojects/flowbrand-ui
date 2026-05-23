import type { AppRouter } from "@/lib/router-types";
import { getPostAuthRedirect } from "@/actions/auth";
import { listFunnels } from "@/actions/funnels";
import { parseFunnelList } from "@/lib/funnel-api-types";
import { saveActiveFunnelGeneration } from "@/lib/funnel-generation-storage";
import {
  isOnboardingSessionComplete,
  type ParsedOnboardingSession,
} from "@/lib/onboarding-api";
import { isNewStrategyFlow } from "@/lib/new-strategy";
import { STRATEGY_ROUTE } from "@/routes";

/** Send users with a finished session or existing funnel to the strategy page. */
export async function redirectToStrategyHomeIfReady(
  router: AppRouter,
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
  router: AppRouter,
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
  const funnelId = funnels[0]?.funnelId;
  if (!funnelId) {
    return false;
  }

  saveActiveFunnelGeneration({
    funnelId,
    idempotencyKey: crypto.randomUUID(),
    source,
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
