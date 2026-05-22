"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FUNNEL_ROUTE } from "@/routes";
import {
  isNewStrategyFlow,
  isNewStrategySearchParam,
  markNewStrategyFlow,
} from "@/lib/new-strategy";
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
  const searchParams = useSearchParams();

  const isNewStrategy = isNewStrategySearchParam(
    searchParams.get("newStrategy"),
  );
  const skipEntryCheck = isNewStrategy || isNewStrategyFlow();

  const entryQuery = useDashboardEntryPathQuery(!skipEntryCheck);

  const allowed =
    skipEntryCheck ||
    (entryQuery.isSuccess && entryQuery.data !== FUNNEL_ROUTE);

  useEffect(() => {
    if (skipEntryCheck && isNewStrategy) {
      markNewStrategyFlow();
    }
  }, [skipEntryCheck, isNewStrategy]);

  useEffect(() => {
    if (skipEntryCheck || entryQuery.isPending) return;
    if (entryQuery.data === FUNNEL_ROUTE) {
      router.replace(FUNNEL_ROUTE);
    }
  }, [skipEntryCheck, entryQuery.isPending, entryQuery.data, router]);

  if (!allowed) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Loader text="Loading..." />
      </div>
    );
  }

  return children;
}
