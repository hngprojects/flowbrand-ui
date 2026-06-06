"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchAdminNotifications,
  type AdminNotificationsListParams,
} from "@/lib/admin-notifications-api";

export const adminNotificationsKeys = {
  all: () => ["admin", "notifications"] as const,
  list: (params: AdminNotificationsListParams) =>
    ["admin", "notifications", "list", params] as const,
};

/** GET /api/admin/notifications */
export function useAdminNotificationsQuery(
  params: AdminNotificationsListParams,
) {
  return useQuery({
    queryKey: adminNotificationsKeys.list(params),
    queryFn: () => fetchAdminNotifications(params),
    staleTime: 15_000,
  });
}
