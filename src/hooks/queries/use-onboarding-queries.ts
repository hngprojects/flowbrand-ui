"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPostAuthRedirect } from "@/actions/auth";
import { queryKeys } from "@/lib/query-keys";
import {
  completeOnboardingMutation,
  fetchOnboardingSessionResolved,
  saveOnboardingStepMutation,
  type OnboardingSessionPayload,
} from "@/lib/onboarding-query-fns";
import { isNewStrategyFlow } from "@/lib/new-strategy";

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
    queryFn: fetchOnboardingSessionResolved,
    enabled,
    staleTime: Infinity,
    retry: 1,
  });
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
