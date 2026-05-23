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
import { isNewStrategyFlow } from "@/lib/new-strategy";
import { useOnboardingStore } from "@/store/useOnboardingStore";

export function useDashboardEntryPathQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.auth.entryPath(),
    queryFn: () => getPostAuthRedirect(),
    enabled: enabled && !isNewStrategyFlow(),
    staleTime: 60_000,
  });
}

export function useOnboardingSessionQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.onboarding.session(),
    queryFn: getOrCreateOnboardingSession,
    enabled,
    staleTime: Infinity,
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

  return useMutation({
    mutationFn: saveOnboardingStepMutation,
    onSuccess: (data: OnboardingSessionPayload) => {
      queryClient.setQueryData(queryKeys.onboarding.session(), data);
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
