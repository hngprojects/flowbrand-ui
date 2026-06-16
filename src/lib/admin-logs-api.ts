import { subDays, format } from "date-fns";
import { adminGatewayFetch } from "@/lib/admin-api-client";
import { parseAdminJson } from "@/lib/admin-api-parse";
import type {
  ActivityLogData,
  ActivityLogEntry,
  LogDateRange,
} from "@/types/admin";

/** Raw row shape returned by GET /api/admin/logs (FR-3). */
type ApiLogRow = {
  id: string;
  user_id: string | null;
  user_name: string;
  user_email: string | null;
  action_type: string;
  description: string;
  ip_address: string | null;
  created_at: string;
  status: string;
  /** Not part of the current contract, but mapped if the backend adds them. */
  location?: string | null;
  device?: string | null;
};

type ApiLogsPayload = {
  data: ApiLogRow[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    has_next: boolean;
    capped?: boolean;
  };
};

/** Maps backend action_type values to the friendly labels used in the table. */
const ACTION_LABELS: Record<string, string> = {
  login: "Signed in",
  logout: "Signed out",
  signup: "Signed up",
  funnel_generated: "Generated funnel",
  task_completed: "Completed task",
  profile_updated: "Edited profile",
  document_uploaded: "Uploaded document",
  password_changed: "Changed password",
  account_deleted: "Deleted account",
};

function toActionLabel(row: ApiLogRow): string {
  return ACTION_LABELS[row.action_type] ?? row.description ?? row.action_type;
}

function toInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return (first + last).toUpperCase();
}

function mapLogRow(row: ApiLogRow): ActivityLogEntry {
  return {
    id: row.id,
    user: {
      fullName: row.user_name,
      email: row.user_email ?? "",
      initials: toInitials(row.user_name),
    },
    timestamp: row.created_at,
    action: toActionLabel(row),
    ipAddress: row.ip_address ?? "—",
    location: row.location ?? undefined,
    device: row.device ?? undefined,
  };
}

/** Translates the UI date-range preset into date_from/date_to query params. */
function rangeToParams(range: LogDateRange): Record<string, string> {
  if (range === "last_7_days" || range === "last_30_days") {
    const days = range === "last_7_days" ? 7 : 30;
    const today = new Date();
    return {
      date_from: format(subDays(today, days), "yyyy-MM-dd"),
      date_to: format(today, "yyyy-MM-dd"),
    };
  }
  // "all" and "custom" (no picker yet) send no date bounds.
  return {};
}

export interface FetchAdminLogsParams {
  page?: number;
  perPage?: number;
  range?: LogDateRange;
}

/** GET /api/admin/logs — paginated, filterable audit trail. */
export async function fetchAdminLogs({
  page = 1,
  perPage = 9,
  range = "all",
}: FetchAdminLogsParams = {}): Promise<ActivityLogData> {
  const search = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
    ...rangeToParams(range),
  });

  const res = await adminGatewayFetch(`logs?${search.toString()}`);
  const payload = await parseAdminJson<ApiLogsPayload>(res);

  const rows = payload.data ?? [];
  const meta = payload.meta ?? {
    total: rows.length,
    page,
    per_page: perPage,
    has_next: false,
  };

  const effectivePerPage = meta.per_page || perPage;

  return {
    entries: rows.map(mapLogRow),
    page: meta.page ?? page,
    perPage: effectivePerPage,
    totalCount: meta.total ?? rows.length,
    totalPages: Math.max(
      1,
      Math.ceil((meta.total ?? rows.length) / effectivePerPage),
    ),
  };
}
