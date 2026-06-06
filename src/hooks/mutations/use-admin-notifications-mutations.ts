"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  bulkDeleteAdminNotifications,
  deleteAdminNotification,
  markAdminNotificationRead,
  markAdminNotificationsUnread,
  markAllAdminNotificationsRead,
  toggleAdminNotificationStar,
  type AdminNotificationType,
} from "@/lib/admin-notifications-api";
import { adminNotificationsKeys } from "@/hooks/queries/use-admin-notifications-queries";

export function useAdminNotificationsMutations() {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: adminNotificationsKeys.all() });

  const markRead = useMutation({
    mutationFn: (id: string) => markAdminNotificationRead(id),
    onSuccess: invalidate,
  });

  const markAllRead = useMutation({
    mutationFn: (type?: AdminNotificationType) =>
      markAllAdminNotificationsRead(type),
    onSuccess: invalidate,
  });

  const markUnread = useMutation({
    mutationFn: (input: { ids?: string[]; all?: true }) =>
      markAdminNotificationsUnread(input),
    onSuccess: invalidate,
  });

  const toggleStar = useMutation({
    mutationFn: (id: string) => toggleAdminNotificationStar(id),
    onSuccess: invalidate,
  });

  const deleteOne = useMutation({
    mutationFn: (id: string) => deleteAdminNotification(id),
    onSuccess: invalidate,
  });

  const bulkDelete = useMutation({
    mutationFn: (input: { ids?: string[]; all?: true }) =>
      bulkDeleteAdminNotifications(input),
    onSuccess: invalidate,
  });

  return {
    markRead,
    markAllRead,
    markUnread,
    toggleStar,
    deleteOne,
    bulkDelete,
  };
}
