import { format } from "date-fns";
import { adminGatewayFetch } from "@/lib/admin-api-client";
import { parseAdminJson } from "@/lib/admin-api-parse";
import type { AdminUserProfile } from "@/lib/admin-users-stub";
import type { AdminRole } from "@/types/admin";
import type {
  AdminUser,
  UserStatus,
} from "@/components/admin/users/users-table";

type ApiUserListItem = {
  id: string;
  full_name: string;
  email: string;
  plan: "free" | "pro";
  status: UserStatus | "suspended";
  created_at: string;
  last_active_at: string | null;
  funnel_count?: number;
};

type ApiUsersListPayload = {
  data: ApiUserListItem[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    has_next: boolean;
  };
};

type ApiUserProfile = {
  fullName: string;
  email: string;
  plan: "free" | "pro";
  country: unknown;
  createdAt: string;
  lastActiveAt: unknown;
  status: UserStatus | "suspended";
};

type ApiUserStrategy = {
  id: string;
  funnelName: string;
  stageCount: number;
  createdAt: string;
  status: "generating" | "active" | "failed";
};

type ApiUserDocument = {
  id: string;
  fileName: string;
  fileSizeBytes: string;
  uploadedAt: string;
  status: string;
};

type ApiUserDetail = {
  profile: ApiUserProfile;
  strategies: ApiUserStrategy[];
  documents: ApiUserDocument[];
  informationProvided: {
    businessType: unknown;
    targetCustomer: unknown;
    primaryGoal: unknown;
  };
};

export type AdminUsersListParams = {
  status?: "all" | "active" | "inactive";
  search?: string;
  page?: number;
  perPage?: number;
  sortBy?: "created_at" | "last_active_at" | "full_name";
  sortDir?: "asc" | "desc";
};

export type AdminUsersListResult = {
  users: AdminUser[];
  meta: ApiUsersListPayload["meta"];
};

function readCountry(value: unknown): string {
  if (!value) return "—";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null) {
    const record = value as Record<string, unknown>;
    if (typeof record.name === "string") return record.name;
    if (typeof record.label === "string") return record.label;
  }
  return "—";
}

function readDate(value: unknown): string | null {
  if (!value || typeof value !== "string") return null;
  return value;
}

function formatShortDate(iso: string): string {
  try {
    return format(new Date(iso), "MMM d");
  } catch {
    return iso;
  }
}

function formatLongDate(iso: string): string {
  try {
    return format(new Date(iso), "MMM d, yyyy");
  } catch {
    return iso;
  }
}

function formatBytes(bytes: string): string {
  const value = Number.parseInt(bytes, 10);
  if (!Number.isFinite(value)) return bytes;
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function mapPlan(plan: "free" | "pro"): AdminUser["plan"] {
  return plan === "pro" ? "Pro" : "Free";
}

function mapListUser(row: ApiUserListItem): AdminUser {
  return {
    id: row.id,
    name: row.full_name,
    email: row.email,
    plan: mapPlan(row.plan),
    country: "—",
    status: row.status === "suspended" ? "inactive" : row.status,
    signupDate: formatShortDate(row.created_at),
  };
}

function readInformationSummary(
  info: ApiUserDetail["informationProvided"],
): string {
  const parts = [info.businessType, info.targetCustomer, info.primaryGoal]
    .map((value) => {
      if (!value) return null;
      if (typeof value === "string") return value;
      if (typeof value === "object" && value !== null) {
        const record = value as Record<string, unknown>;
        if (typeof record.label === "string") return record.label;
        if (typeof record.name === "string") return record.name;
        if (typeof record.value === "string") return record.value;
      }
      return null;
    })
    .filter(Boolean);

  return parts.length > 0 ? parts.join(" · ") : "";
}

function mapStrategyStatus(
  status: ApiUserStrategy["status"],
  index: number,
): "complete" | "active" | "locked" {
  if (status === "failed") return "locked";
  if (status === "generating") return index === 0 ? "active" : "locked";
  if (index === 0) return "active";
  return "complete";
}

function mapUserDetail(data: ApiUserDetail): AdminUserProfile {
  const { profile } = data;
  const lastActiveIso = readDate(profile.lastActiveAt);

  return {
    id: profile.email,
    name: profile.fullName,
    email: profile.email,
    plan: mapPlan(profile.plan),
    country: readCountry(profile.country),
    status: profile.status === "suspended" ? "inactive" : profile.status,
    signupDate: formatShortDate(profile.createdAt),
    lastActive: lastActiveIso ? formatLongDate(lastActiveIso) : "—",
    signupFull: formatLongDate(profile.createdAt),
    documents: data.documents.map((doc) => ({
      name: doc.fileName,
      size: formatBytes(doc.fileSizeBytes),
    })),
    strategies: data.strategies.map((strategy) => ({
      id: strategy.id,
      title: strategy.funnelName,
      source: data.documents.length > 0 ? "documents" : "questions",
      createdAt: formatLongDate(strategy.createdAt),
      info: readInformationSummary(data.informationProvided) || undefined,
      stages: Array.from(
        { length: Math.max(strategy.stageCount, 1) },
        (_, index) => ({
          name: `Stage ${index + 1}`,
          tasks: `${strategy.stageCount} stage${strategy.stageCount === 1 ? "" : "s"}`,
          status: mapStrategyStatus(strategy.status, index),
        }),
      ),
    })),
  };
}

function buildUsersQuery(params: AdminUsersListParams): string {
  const search = new URLSearchParams();
  if (params.status && params.status !== "all") {
    search.set("status", params.status);
  }
  if (params.search?.trim()) {
    search.set("search", params.search.trim());
  }
  if (params.page) search.set("page", String(params.page));
  if (params.perPage) search.set("perPage", String(params.perPage));
  if (params.sortBy) search.set("sortBy", params.sortBy);
  if (params.sortDir) search.set("sortDir", params.sortDir);
  const qs = search.toString();
  return qs ? `users?${qs}` : "users";
}

/** GET /api/admin/users */
export async function fetchAdminUsers(
  params: AdminUsersListParams = {},
): Promise<AdminUsersListResult> {
  const res = await adminGatewayFetch(buildUsersQuery(params));
  const payload = await parseAdminJson<ApiUsersListPayload>(res);
  return {
    users: payload.data.map(mapListUser),
    meta: payload.meta,
  };
}

/** GET /api/admin/users/:userId */
export async function fetchAdminUserProfile(
  userId: string,
): Promise<AdminUserProfile> {
  const res = await adminGatewayFetch(`users/${encodeURIComponent(userId)}`);
  const data = await parseAdminJson<ApiUserDetail>(res);
  const profile = mapUserDetail(data);
  return { ...profile, id: userId };
}

/** DELETE /api/admin/users/:userId */
export async function deleteAdminUser(userId: string): Promise<void> {
  const res = await adminGatewayFetch(`users/${encodeURIComponent(userId)}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? `Delete failed (${res.status})`);
  }
}

/** POST /api/admin/users/create-admin — super_admin only. */
export async function createAdminAccount(input: {
  full_name: string;
  email: string;
  password: string;
  role: AdminRole;
}): Promise<void> {
  const res = await adminGatewayFetch("users/create-admin", {
    method: "POST",
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? `Could not create admin (${res.status})`);
  }
}

/** PATCH /api/admin/users/:userId/status */
export async function updateAdminUserStatus(
  userId: string,
  status: UserStatus | "suspended",
): Promise<void> {
  const res = await adminGatewayFetch(
    `users/${encodeURIComponent(userId)}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    },
  );
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? `Status update failed (${res.status})`);
  }
}
