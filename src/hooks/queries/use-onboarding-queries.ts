"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
    retry: (failureCount: any, error: unknown) => {
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
  });
}
