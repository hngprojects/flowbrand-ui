import { readAdminSession } from "@/lib/admin-session";

export type AcceptTeamInviteInput = {
  token: string;
  full_name?: string;
  password?: string;
  confirm_password?: string;
};

export type AcceptTeamInviteResult = {
  teamName?: string;
  teamId?: string;
  message?: string;
};

function readAcceptInviteData(body: unknown): AcceptTeamInviteResult {
  if (!body || typeof body !== "object") return {};
  const root = body as Record<string, unknown>;
  const data =
    root.data && typeof root.data === "object"
      ? (root.data as Record<string, unknown>)
      : root;

  return {
    teamName:
      typeof data.teamName === "string"
        ? data.teamName
        : typeof data.team_name === "string"
          ? data.team_name
          : undefined,
    teamId:
      typeof data.teamId === "string"
        ? data.teamId
        : typeof data.team_id === "string"
          ? data.team_id
          : undefined,
    message: typeof root.message === "string" ? root.message : undefined,
  };
}

/** POST /api/admin/teams/invitations/accept (via public BFF). */
export async function acceptTeamInvitation(
  input: AcceptTeamInviteInput,
): Promise<AcceptTeamInviteResult> {
  const session = readAdminSession();
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (session?.accessToken) {
    headers.Authorization = `Bearer ${session.accessToken}`;
  }

  const res = await fetch("/api/admin/accept-invite", {
    method: "POST",
    credentials: "include",
    headers,
    body: JSON.stringify(input),
  });

  const body = (await res.json().catch(() => ({}))) as {
    message?: string;
    data?: unknown;
  };

  if (!res.ok) {
    throw new Error(
      body.message ?? `Could not accept invitation (${res.status}).`,
    );
  }

  return readAcceptInviteData(body);
}
