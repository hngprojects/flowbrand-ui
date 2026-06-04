"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminTeamsKeys } from "@/hooks/queries/use-admin-teams-queries";
import type { InviteRole, InvitesData, TeamMembersData } from "@/types/admin";

/**
 * Mutations for the admin teams module. These currently resolve against the
 * in-memory mock and optimistically update the React Query cache, so the UI is
 * fully interactive. When the real endpoints land, replace each `mutationFn`
 * body with the network call — the cache wiring stays the same.
 */

function wait(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** DELETE /admin/teams/:id (mock) — remove a team member. */
export function useDeleteTeamMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (memberId: string) => {
      await wait();
      return memberId;
    },
    onSuccess: (memberId) => {
      queryClient.setQueryData<TeamMembersData>(
        adminTeamsKeys.members(),
        (previous) =>
          previous
            ? {
                ...previous,
                members: previous.members.filter((m) => m.id !== memberId),
              }
            : previous,
      );
      toast.success("Team member removed");
    },
    onError: () => {
      toast.error("Could not remove team member. Please try again.");
    },
  });
}

/** POST /admin/teams/invites (mock) — send an email invite. */
export function useSendInviteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { email: string; role: InviteRole }) => {
      await wait();
      return payload;
    },
    onSuccess: ({ email, role }) => {
      queryClient.setQueryData<InvitesData>(
        adminTeamsKeys.invites(),
        (previous) =>
          previous
            ? {
                ...previous,
                pending: [
                  {
                    id: `pi-${Date.now()}`,
                    email,
                    role,
                    sentAgo: "was sent just now",
                  },
                  ...previous.pending,
                ],
              }
            : previous,
      );
      toast.success(`Invite sent to ${email}`);
    },
    onError: () => {
      toast.error("Could not send the invite. Please try again.");
    },
  });
}

/** DELETE /admin/teams/invites/:id (mock) — revoke a pending invite. */
export function useRevokeInviteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inviteId: string) => {
      await wait();
      return inviteId;
    },
    onSuccess: (inviteId) => {
      queryClient.setQueryData<InvitesData>(
        adminTeamsKeys.invites(),
        (previous) =>
          previous
            ? {
                ...previous,
                pending: previous.pending.filter((p) => p.id !== inviteId),
              }
            : previous,
      );
      toast.success("Invite revoked");
    },
    onError: () => {
      toast.error("Could not revoke the invite. Please try again.");
    },
  });
}
