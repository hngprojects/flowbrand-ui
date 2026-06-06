"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchAdminPortalTeam,
  fetchAdminTeamInviteLink,
  fetchAdminTeamInvitations,
  fetchAdminTeamMembers,
} from "@/lib/admin-teams-api";

export const adminTeamsKeys = {
  all: () => ["admin", "teams"] as const,
  portal: () => ["admin", "teams", "portal"] as const,
  members: (teamId: string) => ["admin", "teams", "members", teamId] as const,
  invitations: (teamId: string) =>
    ["admin", "teams", "invitations", teamId] as const,
  inviteLink: (teamId: string) =>
    ["admin", "teams", "invite-link", teamId] as const,
};

/** Singleton admin portal team. */
export function useAdminPortalTeamQuery(enabled = true) {
  return useQuery({
    queryKey: adminTeamsKeys.portal(),
    queryFn: fetchAdminPortalTeam,
    enabled,
    staleTime: 60_000,
  });
}

/** GET /api/admin/teams/:teamId/members */
export function useAdminTeamMembersQuery(teamId: string, enabled = true) {
  return useQuery({
    queryKey: adminTeamsKeys.members(teamId),
    queryFn: () => fetchAdminTeamMembers(teamId),
    enabled: enabled && Boolean(teamId),
    staleTime: 30_000,
  });
}

/** GET /api/admin/teams/:teamId/invitations */
export function useTeamInvitationsQuery(teamId: string, enabled = true) {
  return useQuery({
    queryKey: adminTeamsKeys.invitations(teamId),
    queryFn: () => fetchAdminTeamInvitations(teamId),
    enabled: enabled && Boolean(teamId),
    staleTime: 30_000,
  });
}

/** GET /api/admin/teams/:teamId/invite-link */
export function useTeamInviteLinkQuery(teamId: string, enabled = true) {
  return useQuery({
    queryKey: adminTeamsKeys.inviteLink(teamId),
    queryFn: () => fetchAdminTeamInviteLink(teamId),
    enabled: enabled && Boolean(teamId),
    staleTime: 30_000,
    retry: false,
  });
}
