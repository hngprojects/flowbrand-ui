import { clearDashboardMockSession } from "@/lib/dashboard-mock-session";
import {
  clearActiveFunnelGeneration,
  clearPendingGeneration,
  markStrategyAutoResolveSkipped,
} from "@/lib/funnel-generation-storage";
import {
  markNewStrategyFlow,
  newStrategyOnboardingPath,
} from "@/lib/new-strategy";
import { useOnboardingStore } from "@/store/useOnboardingStore";

/** Reset local onboarding/funnel state and return the upload URL for a new run. */
export function beginNewStrategyFlow(): string {
  if (typeof window !== "undefined") {
    useOnboardingStore.getState().reset();
    clearDashboardMockSession();
    clearActiveFunnelGeneration();
    clearPendingGeneration();
    markStrategyAutoResolveSkipped();
    markNewStrategyFlow();
  }
  return newStrategyOnboardingPath();
}
