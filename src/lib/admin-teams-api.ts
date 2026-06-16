import { formatDistanceToNow } from "date-fns";
import { adminGatewayFetch } from "@/lib/admin-api-client";
import { parseAdminJson } from "@/lib/admin-api-parse";
import type {
  AdminTeam,
  AdminTeamsListResult,
  InviteLink,
  InviteRole,
  PendingInvite,
  TeamMember,
  TeamMembersData,
  TeamRole,
} from "@/types/admin";

type ApiTeam = {
  id: string;
  name: string;
  description?: string | null;
  status: string;
  created_at: string;
  member_count: number;
};

type ApiTeamsPayload = {
  data?: ApiTeam[];
  meta?: AdminTeamsListResult["meta"];
};

type ApiInvitation = {
  id: string;
  email: string;
  role: string;
  expires_at: string;
  created_at: string;
};

type ApiTeamMember = {
  id: string;
  full_name?: string;
  fullName?: string;
  email: string;
  role: string;
  last_active_at?: string | null;
  lastActiveAt?: string | null;
  is_owner?: boolean;
  removable?: boolean;
};

type ApiInviteLink = {
  url: string;
  role: string;
  expires_at?: string;
  expires_in_days?: number;
};

function mapTeam(row: ApiTeam): AdminTeam {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? null,
    status: row.status,
    createdAt: row.created_at,
    memberCount: row.member_count,
  };
}

function memberInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return (first + last).toUpperCase();
}

function formatMemberActivity(value: string | null | undefined): string {
  if (!value) return "Never active";
  try {
    const distance = formatDistanceToNow(new Date(value), { addSuffix: true });
    if (distance === "less than a minute ago") return "Active now";
    return `Active ${distance}`;
  } catch {
    return "Active recently";
  }
}

function mapTeamRole(value: string, isOwner?: boolean): TeamRole {
  if (isOwner) return "owner";
  const normalized = value.trim().toLowerCase().replace(/-/g, "_");
  const roles: TeamRole[] = [
    "owner",
    "super_admin",
    "admin",
    "regular",
    "designer",
    "dev",
  ];
  if (roles.includes(normalized as TeamRole)) return normalized as TeamRole;
  if (normalized === "superadmin") return "super_admin";
  return "regular";
}

function mapInviteRole(value: string): InviteRole {
  const role = mapTeamRole(value);
  if (role === "regular") return "admin";
  return role as InviteRole;
}

function mapTeamMember(row: ApiTeamMember): TeamMember {
  const fullName = row.full_name ?? row.fullName ?? row.email;
  const role = mapTeamRole(row.role, row.is_owner);
  return {
    id: row.id,
    fullName,
    email: row.email,
    initials: memberInitials(fullName),
    role,
    activity: formatMemberActivity(row.last_active_at ?? row.lastActiveAt),
    removable: row.removable ?? role !== "owner",
  };
}

function mapInvitation(row: ApiInvitation): PendingInvite {
  let sentAgo = row.created_at;
  try {
    const distance = formatDistanceToNow(new Date(row.created_at), {
      addSuffix: true,
    });
    sentAgo = `was sent ${distance}`;
  } catch {
    sentAgo = "was sent recently";
  }

  return {
    id: row.id,
    email: row.email,
    role: mapInviteRole(row.role),
    sentAgo,
    expiresAt: row.expires_at,
  };
}

function mapInviteLink(row: ApiInviteLink): InviteLink {
  const expiresLabel =
    typeof row.expires_in_days === "number"
      ? `Expires in ${row.expires_in_days} days`
      : row.expires_at
        ? `Expires ${formatDistanceToNow(new Date(row.expires_at), { addSuffix: true })}`
        : "Expires in 7 days";

  return {
    url: row.url,
    role: mapInviteRole(row.role),
    expiresLabel,
  };
}

function parseTeamsPayload(body: unknown): AdminTeamsListResult {
  if (Array.isArray(body)) {
    return {
      teams: body.map(mapTeam),
      meta: { total: body.length, page: 1, limit: body.length, total_pages: 1 },
    };
  }

  const record = body as ApiTeamsPayload;
  const rows = record.data ?? [];
  return {
    teams: rows.map(mapTeam),
    meta: record.meta ?? {
      total: rows.length,
      page: 1,
      limit: rows.length,
      total_pages: 1,
    },
  };
}

/** GET /api/admin/teams */
export async function fetchAdminTeams(params?: {
  page?: number;
  limit?: number;
}): Promise<AdminTeamsListResult> {
  const search = new URLSearchParams();
  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit));
  const qs = search.toString();

  const res = await adminGatewayFetch(qs ? `teams?${qs}` : "teams");
  const body = (await res.json()) as {
    message?: string;
    data?: ApiTeam[] | ApiTeamsPayload;
    meta?: AdminTeamsListResult["meta"];
  };

  if (!res.ok) {
    throw new Error(body.message ?? `Request failed (${res.status})`);
  }

  if (Array.isArray(body.data)) {
    return {
      teams: body.data.map(mapTeam),
      meta: body.meta ?? {
        total: body.data.length,
        page: params?.page ?? 1,
        limit: params?.limit ?? body.data.length,
        total_pages: 1,
      },
    };
  }

  return parseTeamsPayload(body.data ?? body);
}

/** POST /api/admin/teams */
export async function createAdminTeam(input: {
  name: string;
  description?: string;
}): Promise<AdminTeam> {
  const res = await adminGatewayFetch("teams", {
    method: "POST",
    body: JSON.stringify(input),
  });
  const team = await parseAdminJson<ApiTeam>(res);
  return mapTeam(team);
}

/** DELETE /api/admin/teams/:teamId */
export async function deleteAdminTeam(teamId: string): Promise<void> {
  const res = await adminGatewayFetch(`teams/${encodeURIComponent(teamId)}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? `Delete failed (${res.status})`);
  }
}

/** GET /api/admin/teams/:teamId/invitations */
export async function fetchAdminTeamInvitations(
  teamId: string,
): Promise<PendingInvite[]> {
  const res = await adminGatewayFetch(
    `teams/${encodeURIComponent(teamId)}/invitations`,
  );
  const data = await parseAdminJson<ApiInvitation[]>(res);
  return (data ?? []).map(mapInvitation);
}

/** POST /api/admin/teams/:teamId/invite */
export async function inviteAdminTeamMembers(
  teamId: string,
  input: {
    emails: string[];
    role: InviteRole;
    message?: string;
  },
): Promise<{ sent: number; failed: number }> {
  const res = await adminGatewayFetch(
    `teams/${encodeURIComponent(teamId)}/invite`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
  const data = await parseAdminJson<{
    sent: number;
    failed: number;
    errors?: Array<{ email: string; reason: string }>;
  }>(res);

  if (data.failed > 0 && data.sent === 0) {
    const reason = data.errors?.[0]?.reason ?? "Could not send invitations.";
    throw new Error(reason);
  }

  return { sent: data.sent, failed: data.failed };
}

/** DELETE /api/admin/teams/:teamId/invitations/:inviteId */
export async function revokeAdminTeamInvitation(
  teamId: string,
  inviteId: string,
): Promise<void> {
  const res = await adminGatewayFetch(
    `teams/${encodeURIComponent(teamId)}/invitations/${encodeURIComponent(inviteId)}`,
    { method: "DELETE" },
  );
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? `Revoke failed (${res.status})`);
  }
}

/**
 * GET /api/admin/teams/:teamId/members
 *
 * Not documented in Swagger yet (Jun 2026). When the backend ships it, this
 * parser accepts `{ data: { team_name, members: [] } }` or a bare member array.
 * Until then a 404 falls back to the typed mock list so the Teams UI stays usable.
 */
export async function fetchAdminTeamMembers(
  teamId: string,
): Promise<TeamMembersData> {
  const res = await adminGatewayFetch(
    `teams/${encodeURIComponent(teamId)}/members`,
  );

  if (res.status === 404) {
    const { fetchTeamMembers } = await import("@/lib/admin-mock-data");
    return fetchTeamMembers();
  }

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? `Members request failed (${res.status})`);
  }

  const body = await res.json();
  const payload = (body as { data?: unknown }).data ?? body;
  const record = payload as {
    team_name?: string;
    teamName?: string;
    members?: ApiTeamMember[];
    data?: ApiTeamMember[];
  };

  const rows =
    record.members ?? record.data ?? (Array.isArray(payload) ? payload : []);

  return {
    teamName: record.team_name ?? record.teamName ?? "Admin team",
    members: (rows as ApiTeamMember[]).map(mapTeamMember),
  };
}

/** DELETE /api/admin/teams/:teamId/members/:memberId — deletes member account. */
export async function deleteAdminTeamMember(
  teamId: string,
  memberId: string,
): Promise<void> {
  const res = await adminGatewayFetch(
    `teams/${encodeURIComponent(teamId)}/members/${encodeURIComponent(memberId)}`,
    { method: "DELETE" },
  );
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? `Delete failed (${res.status})`);
  }
}

/** PATCH /api/admin/teams/:teamId/members/:memberId/revoke — revokes elevated access. */
export async function revokeAdminTeamMemberAccess(
  teamId: string,
  memberId: string,
): Promise<void> {
  const res = await adminGatewayFetch(
    `teams/${encodeURIComponent(teamId)}/members/${encodeURIComponent(memberId)}/revoke`,
    { method: "PATCH" },
  );
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? `Revoke failed (${res.status})`);
  }
}

/** GET /api/admin/teams/:teamId/invite-link */
export async function fetchAdminTeamInviteLink(
  teamId: string,
): Promise<InviteLink> {
  const res = await adminGatewayFetch(
    `teams/${encodeURIComponent(teamId)}/invite-link`,
  );
  const data = await parseAdminJson<ApiInviteLink>(res);
  return mapInviteLink(data);
}

/** POST /api/admin/teams/:teamId/invite-link — regenerate link for a role. */
export async function regenerateAdminTeamInviteLink(
  teamId: string,
  role: InviteRole,
): Promise<InviteLink> {
  const res = await adminGatewayFetch(
    `teams/${encodeURIComponent(teamId)}/invite-link`,
    {
      method: "POST",
      body: JSON.stringify({ role }),
    },
  );
  const data = await parseAdminJson<ApiInviteLink>(res);
  return mapInviteLink(data);
}

/** Resolve the singleton portal team (first active team). */
export async function fetchAdminPortalTeam(): Promise<AdminTeam | null> {
  const result = await fetchAdminTeams({ page: 1, limit: 1 });
  return result.teams[0] ?? null;
}
