import { formatDistanceToNow } from "date-fns";
import { adminGatewayFetch } from "@/lib/admin-api-client";
import { parseAdminJson } from "@/lib/admin-api-parse";

export type AdminNotificationType =
  | "milestone"
  | "risk"
  | "mention"
  | "feedback";

export type AdminNotificationItem = {
  id: string;
  type: AdminNotificationType;
  title: string;
  message: string;
  senderName: string;
  senderAvatarUrl: string | null;
  isRead: boolean;
  isStarred: boolean;
  readAt: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  timeLabel: string;
};

export type AdminNotificationsListParams = {
  type?: "all" | AdminNotificationType;
  read?: "all" | "unread" | "read";
  starred?: boolean;
  page?: number;
  perPage?: number;
};

export type AdminNotificationsListResult = {
  notifications: AdminNotificationItem[];
  meta: {
    total: number;
    unread_count: number;
    page: number;
    per_page: number;
    has_next: boolean;
  };
};

type ApiNotification = {
  id: string;
  type: AdminNotificationType;
  title: string;
  message: string;
  sender_name: string;
  sender_avatar_url: string | null;
  is_read: boolean;
  is_starred: boolean;
  read_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

type ApiNotificationsPayload = {
  data: ApiNotification[];
  meta: AdminNotificationsListResult["meta"];
};

function mapNotification(row: ApiNotification): AdminNotificationItem {
  let timeLabel = row.created_at;
  try {
    timeLabel = formatDistanceToNow(new Date(row.created_at), {
      addSuffix: true,
    });
  } catch {
    // keep raw timestamp
  }

  return {
    id: row.id,
    type: row.type,
    title: row.title,
    message: row.message,
    senderName: row.sender_name,
    senderAvatarUrl: row.sender_avatar_url,
    isRead: row.is_read,
    isStarred: row.is_starred,
    readAt: row.read_at,
    metadata: row.metadata ?? {},
    createdAt: row.created_at,
    timeLabel,
  };
}

function buildNotificationsQuery(params: AdminNotificationsListParams): string {
  const search = new URLSearchParams();
  if (params.type && params.type !== "all") {
    search.set("type", params.type);
  }
  if (params.read && params.read !== "all") {
    search.set("read", params.read);
  }
  if (params.starred) {
    search.set("starred", "true");
  }
  if (params.page) search.set("page", String(params.page));
  if (params.perPage) search.set("per_page", String(params.perPage));
  const qs = search.toString();
  return qs ? `notifications?${qs}` : "notifications";
}

/** GET /api/admin/notifications */
export async function fetchAdminNotifications(
  params: AdminNotificationsListParams = {},
): Promise<AdminNotificationsListResult> {
  const res = await adminGatewayFetch(buildNotificationsQuery(params));
  const payload = await parseAdminJson<ApiNotificationsPayload>(res);
  return {
    notifications: payload.data.map(mapNotification),
    meta: payload.meta,
  };
}

/** PATCH /api/admin/notifications/:id/read */
export async function markAdminNotificationRead(
  id: string,
): Promise<AdminNotificationItem> {
  const res = await adminGatewayFetch(`notifications/${id}/read`, {
    method: "PATCH",
  });
  const data = await parseAdminJson<ApiNotification>(res);
  return mapNotification(data);
}

/** PATCH /api/admin/notifications/read-all */
export async function markAllAdminNotificationsRead(
  type?: AdminNotificationType,
): Promise<number> {
  const path = type
    ? `notifications/read-all?type=${type}`
    : "notifications/read-all";
  const res = await adminGatewayFetch(path, { method: "PATCH" });
  const data = await parseAdminJson<{ updated_count: number }>(res);
  return data.updated_count;
}

/** PATCH /api/admin/notifications/mark-unread */
export async function markAdminNotificationsUnread(input: {
  ids?: string[];
  all?: true;
}): Promise<number> {
  const res = await adminGatewayFetch("notifications/mark-unread", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  const data = await parseAdminJson<{ updated_count: number }>(res);
  return data.updated_count;
}

/** PATCH /api/admin/notifications/:id/star */
export async function toggleAdminNotificationStar(
  id: string,
): Promise<AdminNotificationItem> {
  const res = await adminGatewayFetch(`notifications/${id}/star`, {
    method: "PATCH",
  });
  const data = await parseAdminJson<ApiNotification>(res);
  return mapNotification(data);
}

/** DELETE /api/admin/notifications/:id */
export async function deleteAdminNotification(id: string): Promise<void> {
  const res = await adminGatewayFetch(`notifications/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? `Delete failed (${res.status})`);
  }
}

/** DELETE /api/admin/notifications/bulk */
export async function bulkDeleteAdminNotifications(input: {
  ids?: string[];
  all?: true;
}): Promise<number> {
  const res = await adminGatewayFetch("notifications/bulk", {
    method: "DELETE",
    body: JSON.stringify(input),
  });
  const data = await parseAdminJson<{ deleted_count: number }>(res);
  return data.deleted_count;
}
