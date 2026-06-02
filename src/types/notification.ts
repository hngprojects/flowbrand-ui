/**
 * Notification shape returned by the SEIL backend.
 * See: GET /api/notifications (items[]).
 */

export type NotificationIconType =
  | "bell"
  | "calendar"
  | "check"
  | "flag"
  | "chart"
  | "lightbulb"
  | "message"
  | "cart"
  | "gear"
  | "user";

export type NotificationIconColor =
  | "purple"
  | "green"
  | "orange"
  | "blue"
  | "yellow"
  | "red"
  | "pink"
  | "gray";

/** Optional structured metadata the backend may attach (funnel/stage/task IDs, etc.). */
export type NotificationMetadata = {
  funnelId?: string;
  stageId?: string;
  taskId?: string;
  [key: string]: unknown;
};

/** Backend notification — field names match the API exactly. */
export type Notification = {
  id: string;
  type: string;
  title: string;
  body: string;
  is_read: boolean;
  read_at: string | null;
  metadata: NotificationMetadata | null;
  created_at: string;
};

/** Response shape for GET /api/notifications (the contents of `data`). */
export type NotificationListData = {
  items: Notification[];
  total_count: number;
  unread_count: number;
  page: number;
  per_page: number;
  has_next: boolean;
};

/** Response shape for GET /api/notifications/unread-count (the contents of `data`). */
export type NotificationUnreadCountData = {
  count: number;
};

/** Response shape for PATCH /api/notifications/read-all and /mark-all-unread (the contents of `data`). */
export type NotificationBulkUpdateData = {
  updated_count: number;
};
