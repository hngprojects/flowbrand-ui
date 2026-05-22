"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { GenerateFunnelInput } from "@/actions/funnels";
import { startFunnelGeneration } from "@/lib/funnel-query-fns";
import { queryKeys } from "@/lib/query-keys";

export function useStartFunnelGenerationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: GenerateFunnelInput) => startFunnelGeneration(input),
    onSuccess: (funnelId) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.funnels.all() });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.funnels.generationStatus(funnelId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.funnels.display(funnelId),
      });
    },
  });
}
