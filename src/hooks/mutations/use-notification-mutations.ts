"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteNotification,
  markAllNotificationsRead,
  markAllNotificationsUnread,
  markNotificationRead,
} from "@/actions/notifications";
import { queryKeys } from "@/lib/query-keys";

function unwrap<T>(
  result: { ok: true; data: T } | { ok: false; error: string },
): T {
  if (!result.ok) {
    throw new Error(result.error);
  }
  return result.data;
}

/** PATCH /api/notifications/{id}/read */
export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => unwrap(await markNotificationRead(id)),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all(),
      });
    },
  });
}

/** DELETE /api/notifications/{id} */
export function useDeleteNotificationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => unwrap(await deleteNotification(id)),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all(),
      });
    },
  });
}

/** PATCH /api/notifications/read-all */
export function useMarkAllNotificationsReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => unwrap(await markAllNotificationsRead()),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all(),
      });
    },
  });
}

/** PATCH /api/notifications/mark-all-unread — used as Undo for mark-all-read. */
export function useMarkAllNotificationsUnreadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => unwrap(await markAllNotificationsUnread()),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all(),
      });
    },
  });
}
