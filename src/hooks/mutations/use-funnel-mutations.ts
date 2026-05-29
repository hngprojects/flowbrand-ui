"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { GenerateFunnelInput } from "@/actions/funnels";
import {
  GenerateFunnelError,
  startFunnelGeneration,
} from "@/lib/funnel-query-fns";
import { queryKeys } from "@/lib/query-keys";

export function useStartFunnelGenerationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: GenerateFunnelInput) => startFunnelGeneration(input),
    retry: false,
    onSuccess: (funnelId) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.funnels.all() });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.funnels.generationStatus(funnelId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.funnels.display(funnelId),
      });
    },
    onError: (error) => {
      if (process.env.NODE_ENV === "development") {
        console.error("[funnel] startFunnelGeneration failed", error);
      }
      // Rate-limited errors carry their own user-friendly message.
      if (error instanceof GenerateFunnelError && error.rateLimited) {
        toast.error(error.message);
        return;
      }
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not start strategy generation. Please try again.",
      );
    },
  });
}
