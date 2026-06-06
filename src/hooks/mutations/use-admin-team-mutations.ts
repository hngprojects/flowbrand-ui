"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  deleteAdminTeamMember,
  inviteAdminTeamMembers,
  regenerateAdminTeamInviteLink,
  revokeAdminTeamInvitation,
  revokeAdminTeamMemberAccess,
} from "@/lib/admin-teams-api";
import { adminTeamsKeys } from "@/hooks/queries/use-admin-teams-queries";
import type { InviteRole } from "@/types/admin";

export function useSendInviteMutation(teamId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      email: string;
      role: InviteRole;
      message?: string;
    }) =>
      inviteAdminTeamMembers(teamId, {
        emails: [payload.email],
        role: payload.role,
        message: payload.message,
      }),
    onSuccess: (result, variables) => {
      void queryClient.invalidateQueries({
        queryKey: adminTeamsKeys.invitations(teamId),
      });
      if (result.failed > 0) {
        toast.warning(
          `Invite sent to ${variables.email}, but ${result.failed} invite(s) failed.`,
        );
      } else {
        toast.success(`Invite sent to ${variables.email}`);
      }
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Could not send the invite.",
      );
    },
  });
}

export function useRevokeInviteMutation(teamId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inviteId: string) =>
      revokeAdminTeamInvitation(teamId, inviteId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: adminTeamsKeys.invitations(teamId),
      });
      toast.success("Access revoked");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Could not revoke access.",
      );
    },
  });
}

export function useDeleteTeamMemberMutation(teamId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) => deleteAdminTeamMember(teamId, memberId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: adminTeamsKeys.members(teamId),
      });
      void queryClient.invalidateQueries({ queryKey: adminTeamsKeys.portal() });
      toast.success("Team member deleted");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Could not delete member.",
      );
    },
  });
}

export function useRevokeMemberAccessMutation(teamId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) =>
      revokeAdminTeamMemberAccess(teamId, memberId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: adminTeamsKeys.members(teamId),
      });
      toast.success("Portal access revoked");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Could not revoke access.",
      );
    },
  });
}

export function useRegenerateInviteLinkMutation(teamId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (role: InviteRole) =>
      regenerateAdminTeamInviteLink(teamId, role),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: adminTeamsKeys.inviteLink(teamId),
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not update invite link.",
      );
    },
  });
}
