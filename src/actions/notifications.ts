"use server";

import axios from "axios";
import { auth } from "@/auth";
import { envConfig } from "@/config/env.config";
import { formatHttpApiError } from "@/lib/api-errors";
import { flowLog, flowLogApiResult } from "@/lib/flow-debug-log";

function notificationsUrl(path: string): string {
  const base = envConfig.BASEURL.replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}/api/notifications${suffix}`;
}

async function getAccessToken(): Promise<string | null> {
  const session = await auth();
  const token = session?.access_token;
  return session?.user?.id &&
    session.invalid !== true &&
    typeof token === "string"
    ? token
    : null;
}

export type NotificationsActionResult<T = unknown> =
  | { ok: true; status: number; data: T }
  | { ok: false; error: string; status?: number };

function unauthorized<T>(): NotificationsActionResult<T> {
  return {
    ok: false,
    error: "Session expired. Please sign in again.",
    status: 401,
  };
}

function networkError<T>(): NotificationsActionResult<T> {
  return { ok: false, error: "Could not reach the server." };
}

export type ListNotificationsInput = {
  filter?: "all" | "unread" | "read";
  page?: number;
  per_page?: number;
};

/** GET /api/notifications */
export async function listNotifications(
  input: ListNotificationsInput = {},
): Promise<NotificationsActionResult> {
  const filter = input.filter ?? "all";
  const page = input.page ?? 1;
  const per_page = input.per_page ?? 20;

  const meta = { filter, page, per_page };
  flowLog("notifications", "GET /api/notifications → request", meta);

  const token = await getAccessToken();
  if (!token) {
    const result = unauthorized();
    flowLogApiResult("notifications", "GET /api/notifications", result, meta);
    return result;
  }

  try {
    const res = await axios.get(notificationsUrl(""), {
      headers: { Authorization: `Bearer ${token}` },
      params: { filter, page, per_page },
      timeout: 30000,
    });
    const result = {
      ok: true as const,
      status: res.status,
      data: res.data?.data ?? res.data,
    };
    flowLogApiResult("notifications", "GET /api/notifications", result, meta);
    return result;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      const result = {
        ok: false as const,
        error: formatHttpApiError(
          status,
          data,
          "Could not load your notifications.",
        ),
        status,
      };
      flowLogApiResult("notifications", "GET /api/notifications", result, meta);
      return result;
    }
    const result = networkError();
    flowLogApiResult("notifications", "GET /api/notifications", result, meta);
    return result;
  }
}

/** GET /api/notifications/unread-count */
export async function getNotificationUnreadCount(): Promise<NotificationsActionResult> {
  flowLog("notifications", "GET /api/notifications/unread-count → request");
  const token = await getAccessToken();
  if (!token) {
    const result = unauthorized();
    flowLogApiResult(
      "notifications",
      "GET /api/notifications/unread-count",
      result,
    );
    return result;
  }

  try {
    const res = await axios.get(notificationsUrl("/unread-count"), {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 15000,
    });
    const result = {
      ok: true as const,
      status: res.status,
      data: res.data?.data ?? res.data,
    };
    flowLogApiResult(
      "notifications",
      "GET /api/notifications/unread-count",
      result,
    );
    return result;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      const result = {
        ok: false as const,
        error: formatHttpApiError(status, data, "Could not load unread count."),
        status,
      };
      flowLogApiResult(
        "notifications",
        "GET /api/notifications/unread-count",
        result,
      );
      return result;
    }
    const result = networkError();
    flowLogApiResult(
      "notifications",
      "GET /api/notifications/unread-count",
      result,
    );
    return result;
  }
}

/** PATCH /api/notifications/{id}/read */
export async function markNotificationRead(
  id: string,
): Promise<NotificationsActionResult> {
  const meta = { id };
  flowLog(
    "notifications",
    "PATCH /api/notifications/{id}/read → request",
    meta,
  );

  const token = await getAccessToken();
  if (!token) {
    const result = unauthorized();
    flowLogApiResult(
      "notifications",
      "PATCH /api/notifications/{id}/read",
      result,
      meta,
    );
    return result;
  }

  try {
    const res = await axios.patch(
      notificationsUrl(`/${encodeURIComponent(id)}/read`),
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      },
    );
    const result = {
      ok: true as const,
      status: res.status,
      data: res.data?.data ?? res.data,
    };
    flowLogApiResult(
      "notifications",
      "PATCH /api/notifications/{id}/read",
      result,
      meta,
    );
    return result;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      const result = {
        ok: false as const,
        error: formatHttpApiError(
          status,
          data,
          "Could not mark this notification as read.",
        ),
        status,
      };
      flowLogApiResult(
        "notifications",
        "PATCH /api/notifications/{id}/read",
        result,
        meta,
      );
      return result;
    }
    const result = networkError();
    flowLogApiResult(
      "notifications",
      "PATCH /api/notifications/{id}/read",
      result,
      meta,
    );
    return result;
  }
}

/** DELETE /api/notifications/{id} */
export async function deleteNotification(
  id: string,
): Promise<NotificationsActionResult> {
  const meta = { id };
  flowLog("notifications", "DELETE /api/notifications/{id} → request", meta);

  const token = await getAccessToken();
  if (!token) {
    const result = unauthorized();
    flowLogApiResult(
      "notifications",
      "DELETE /api/notifications/{id}",
      result,
      meta,
    );
    return result;
  }

  try {
    const res = await axios.delete(
      notificationsUrl(`/${encodeURIComponent(id)}`),
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 15000,
      },
    );
    const result = {
      ok: true as const,
      status: res.status,
      data: res.data?.data ?? res.data,
    };
    flowLogApiResult(
      "notifications",
      "DELETE /api/notifications/{id}",
      result,
      meta,
    );
    return result;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      const result = {
        ok: false as const,
        error: formatHttpApiError(
          status,
          data,
          "Could not delete this notification.",
        ),
        status,
      };
      flowLogApiResult(
        "notifications",
        "DELETE /api/notifications/{id}",
        result,
        meta,
      );
      return result;
    }
    const result = networkError();
    flowLogApiResult(
      "notifications",
      "DELETE /api/notifications/{id}",
      result,
      meta,
    );
    return result;
  }
}

/** PATCH /api/notifications/read-all */
export async function markAllNotificationsRead(): Promise<NotificationsActionResult> {
  flowLog("notifications", "PATCH /api/notifications/read-all → request");
  const token = await getAccessToken();
  if (!token) {
    const result = unauthorized();
    flowLogApiResult(
      "notifications",
      "PATCH /api/notifications/read-all",
      result,
    );
    return result;
  }

  try {
    const res = await axios.patch(
      notificationsUrl("/read-all"),
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      },
    );
    const result = {
      ok: true as const,
      status: res.status,
      data: res.data?.data ?? res.data,
    };
    flowLogApiResult(
      "notifications",
      "PATCH /api/notifications/read-all",
      result,
    );
    return result;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      const result = {
        ok: false as const,
        error: formatHttpApiError(
          status,
          data,
          "Could not mark all notifications as read.",
        ),
        status,
      };
      flowLogApiResult(
        "notifications",
        "PATCH /api/notifications/read-all",
        result,
      );
      return result;
    }
    const result = networkError();
    flowLogApiResult(
      "notifications",
      "PATCH /api/notifications/read-all",
      result,
    );
    return result;
  }
}

/** PATCH /api/notifications/mark-all-unread (used as the "Undo" for mark-all-read). */
export async function markAllNotificationsUnread(): Promise<NotificationsActionResult> {
  flowLog(
    "notifications",
    "PATCH /api/notifications/mark-all-unread → request",
  );
  const token = await getAccessToken();
  if (!token) {
    const result = unauthorized();
    flowLogApiResult(
      "notifications",
      "PATCH /api/notifications/mark-all-unread",
      result,
    );
    return result;
  }

  try {
    const res = await axios.patch(
      notificationsUrl("/mark-all-unread"),
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      },
    );
    const result = {
      ok: true as const,
      status: res.status,
      data: res.data?.data ?? res.data,
    };
    flowLogApiResult(
      "notifications",
      "PATCH /api/notifications/mark-all-unread",
      result,
    );
    return result;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      const result = {
        ok: false as const,
        error: formatHttpApiError(
          status,
          data,
          "Could not mark all notifications as unread.",
        ),
        status,
      };
      flowLogApiResult(
        "notifications",
        "PATCH /api/notifications/mark-all-unread",
        result,
      );
      return result;
    }
    const result = networkError();
    flowLogApiResult(
      "notifications",
      "PATCH /api/notifications/mark-all-unread",
      result,
    );
    return result;
  }
}
