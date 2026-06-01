/**
 * Notifications now come from the backend via
 * `useNotificationsQuery` (GET /api/notifications).
 *
 * The previous mock array is no longer needed. Kept as an empty export so
 * any lingering import surfaces a clear empty list rather than a missing
 * module error.
 */

import type { Notification } from "@/types/notification";

export const mockNotifications: Notification[] = [];
