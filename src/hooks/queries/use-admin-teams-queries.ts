"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchInvites, fetchTeamMembers } from "@/lib/admin-mock-data";
import type { InvitesData, TeamMembersData } from "@/types/admin";

/**
 * Query keys for the admin teams/invites data. Kept local to the admin module
 * so the shared `@/lib/query-keys` file isn't a merge-conflict hotspot across
 * the four parallel admin workstreams.
 */
export const adminTeamsKeys = {
  all: () => ["admin", "teams"] as const,
  members: () => ["admin", "teams", "members"] as const,
  invites: () => ["admin", "teams", "invites"] as const,
};

/** GET /admin/teams (mock) — Admin team member list. */
export function useTeamMembersQuery(enabled = true) {
  return useQuery({
    queryKey: adminTeamsKeys.members(),
    queryFn: (): Promise<TeamMembersData> => fetchTeamMembers(),
    enabled,
    staleTime: 30_000,
  });
}

/** GET /admin/teams/invites (mock) — invite link + pending invites. */
export function useInvitesQuery(enabled = true) {
  return useQuery({
    queryKey: adminTeamsKeys.invites(),
    queryFn: (): Promise<InvitesData> => fetchInvites(),
    enabled,
    staleTime: 30_000,
  });
}
