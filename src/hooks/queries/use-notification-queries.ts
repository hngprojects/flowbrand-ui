"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getNotificationUnreadCount,
  listNotifications,
} from "@/actions/notifications";
import { queryKeys } from "@/lib/query-keys";
import type {
  NotificationListData,
  NotificationUnreadCountData,
} from "@/types/notification";

export type NotificationFilter = "all" | "unread" | "read";

/** GET /api/notifications — paginated feed for the modal. */
export function useNotificationsQuery(
  filter: NotificationFilter = "all",
  page = 1,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.notifications.list(filter, page),
    queryFn: async (): Promise<NotificationListData> => {
      const result = await listNotifications({ filter, page });
      if (!result.ok) {
        throw new Error(result.error);
      }
      return result.data as NotificationListData;
    },
    enabled,
    staleTime: 10_000,
  });
}

/** GET /api/notifications/unread-count — powers the bell badge. */
export function useNotificationUnreadCountQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.notifications.unreadCount(),
    queryFn: async (): Promise<NotificationUnreadCountData> => {
      const result = await getNotificationUnreadCount();
      if (!result.ok) {
        throw new Error(result.error);
      }
      return result.data as NotificationUnreadCountData;
    },
    enabled,
    staleTime: 15_000,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });
}
