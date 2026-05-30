"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTaskStatus } from "@/actions/funnels";
import { queryKeys } from "@/lib/query-keys";
import { toast } from "sonner";

export function useUpdateTaskStatusMutation(funnelId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    retry: false,
    mutationFn: ({
      stageId,
      taskId,
      status,
    }: {
      stageId: string;
      taskId: string;
      status: "complete" | "pending";
    }) => updateTaskStatus(funnelId, stageId, taskId, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.funnels.display(funnelId),
      });
    },
    onError: () => {
      toast.error("Could not update task. Please try again.");
    },
  });
}