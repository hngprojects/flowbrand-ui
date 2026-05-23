import type { QueryClient } from "@tanstack/react-query";
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
import { queryKeys } from "@/lib/query-keys";
import { useOnboardingStore } from "@/store/useOnboardingStore";

/** Reset local onboarding/funnel state and return the upload URL for a new run. */
export function beginNewStrategyFlow(queryClient?: QueryClient): string {
  if (typeof window !== "undefined") {
    useOnboardingStore.getState().reset();
    clearDashboardMockSession();
    clearActiveFunnelGeneration();
    clearPendingGeneration();
    markStrategyAutoResolveSkipped();
    markNewStrategyFlow();

    if (queryClient) {
      queryClient.removeQueries({ queryKey: queryKeys.onboarding.all() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.funnels.all() });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.auth.entryPath(),
      });
    }
  }
  return newStrategyOnboardingPath();
}
