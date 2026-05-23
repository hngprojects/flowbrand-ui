"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { STRATEGY_ROUTE } from "@/routes";
import { useNewStrategyFlow } from "@/hooks/use-new-strategy-flow";
import { useDashboardEntryPathQuery } from "@/hooks/queries/use-onboarding-queries";
import Loader from "@/components/ui/loader";

/**
 * Redirects users who already completed onboarding to the strategy page,
 * unless they explicitly started a new strategy flow (?newStrategy=1).
 */
export function OnboardingAccessGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isNewStrategy = useNewStrategyFlow();
  const entryQuery = useDashboardEntryPathQuery(!isNewStrategy);

  const allowed =
    isNewStrategy ||
    (entryQuery.isSuccess && entryQuery.data !== STRATEGY_ROUTE);

  useEffect(() => {
    if (isNewStrategy || entryQuery.isPending) return;
    if (entryQuery.data === STRATEGY_ROUTE) {
      router.replace(STRATEGY_ROUTE);
    }
  }, [isNewStrategy, entryQuery.isPending, entryQuery.data, router]);

  if (!allowed) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Loader text="Loading..." />
      </div>
    );
  }

  return children;
}
