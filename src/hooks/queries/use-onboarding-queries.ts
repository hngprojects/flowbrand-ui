"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getPostAuthRedirect } from "@/actions/auth";
import { queryKeys } from "@/lib/query-keys";
import {
  completeOnboardingMutation,
  getOrCreateOnboardingSession,
  OnboardingAlreadyCompleteError,
  parseOnboardingSessionId,
  saveOnboardingStepMutation,
  type OnboardingSessionPayload,
} from "@/lib/onboarding-query-fns";
import { useNewStrategyFlow } from "@/hooks/use-new-strategy-flow";
import { useOnboardingStore } from "@/store/useOnboardingStore";

export function useDashboardEntryPathQuery(enabled = true) {
  const isNewStrategy = useNewStrategyFlow();

  return useQuery({
    queryKey: queryKeys.auth.entryPath(),
    queryFn: () => getPostAuthRedirect(),
    enabled: enabled && !isNewStrategy,
    staleTime: 60_000,
  });
}

export function useOnboardingSessionQuery(enabled = true) {
  const isNewStrategy = useNewStrategyFlow();
  const sessionQueryKey = queryKeys.onboarding.session(
    isNewStrategy ? "new-strategy" : "default",
  );

  return useQuery({
    queryKey: sessionQueryKey,
    queryFn: getOrCreateOnboardingSession,
    enabled,
    staleTime: 0,
    refetchOnMount: true,
    retry: (failureCount, error) => {
      if (error instanceof OnboardingAlreadyCompleteError) return false;
      return failureCount < 1;
    },
  });
}

/** Ensures an onboarding session exists on the upload step (POST /onboarding/start). */
export function useEnsureOnboardingSession() {
  const query = useOnboardingSessionQuery(true);

  useEffect(() => {
    if (!query.isSuccess || !query.data) return;
    const id = parseOnboardingSessionId(query.data.raw);
    if (id) {
      useOnboardingStore.getState().setSessionId(id);
    }
  }, [query.isSuccess, query.data]);

  return query;
}

export function useSaveOnboardingStepMutation() {
  const queryClient = useQueryClient();
  const isNewStrategy = useNewStrategyFlow();
  const sessionQueryKey = queryKeys.onboarding.session(
    isNewStrategy ? "new-strategy" : "default",
  );

  return useMutation({
    mutationFn: saveOnboardingStepMutation,
    onSuccess: (data: OnboardingSessionPayload) => {
      queryClient.setQueryData(sessionQueryKey, data);
    },
    onError: (error) => {
      if (process.env.NODE_ENV === "development") {
        console.error("[onboarding] saveOnboardingStep failed", error);
      }
      toast.error(
        error instanceof Error ? error.message : "Could not save your answer.",
      );
    },
  });
}

export function useCompleteOnboardingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => completeOnboardingMutation(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.onboarding.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.entryPath() });
      queryClient.invalidateQueries({ queryKey: queryKeys.funnels.all() });
    },
    onError: (error) => {
      // "Already complete" isn't a failure from the user's perspective — the
      // wizard treats it as a pass-through and we don't want to alarm them.
      if (error instanceof OnboardingAlreadyCompleteError) return;

      if (process.env.NODE_ENV === "development") {
        console.error("[onboarding] completeOnboarding failed", error);
      }
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not complete onboarding. Please try again.",
      );
    },
  });
}
