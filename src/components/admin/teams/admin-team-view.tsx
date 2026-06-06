"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TeamMemberRow } from "@/components/admin/teams/team-member-row";
import { DeleteMemberModal } from "@/components/admin/teams/delete-member-modal";
import {
  useAdminPortalTeamQuery,
  useAdminTeamMembersQuery,
} from "@/hooks/queries/use-admin-teams-queries";
import { useDeleteTeamMemberMutation } from "@/hooks/mutations/use-admin-team-mutations";
import { useIsSuperAdmin } from "@/hooks/use-is-super-admin";
import { ADMIN_TEAMS_INVITE_ROUTE } from "@/routes";
import type { TeamMember } from "@/types/admin";

const CreateAdminModal = dynamic(
  () =>
    import("@/components/admin/users/create-admin-modal").then(
      (mod) => mod.CreateAdminModal,
    ),
  { ssr: false },
);

export function AdminTeamView() {
  const isSuperAdmin = useIsSuperAdmin();
  const { data: team, isLoading: teamLoading } = useAdminPortalTeamQuery();
  const teamId = team?.id ?? "";

  const {
    data: membersData,
    isLoading: membersLoading,
    isError,
    refetch,
  } = useAdminTeamMembersQuery(teamId, Boolean(teamId));

  const deleteMutation = useDeleteTeamMemberMutation(teamId);
  const [createAdminOpen, setCreateAdminOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null);

  const isLoading = teamLoading || membersLoading;

  function confirmDelete() {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  }

  return (
    <section className="w-full">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <h1 className="text-lg font-semibold text-black-500">Admin team</h1>
        <div className="flex flex-wrap items-center gap-2">
          {isSuperAdmin ? (
            <Button
              type="button"
              variant="outline"
              className="rounded-lg"
              onClick={() => setCreateAdminOpen(true)}
            >
              Create admin
            </Button>
          ) : null}
          <Button type="button" className="rounded-lg" asChild>
            <Link href={ADMIN_TEAMS_INVITE_ROUTE}>
              <UserPlus className="size-4" />
              Invite team
            </Link>
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#EAECF0] bg-white">
        {isLoading ? (
          <div className="space-y-0">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-[72px] animate-pulse border-b border-[#EAECF0] bg-gray-50 last:border-b-0"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm text-neutral-500">
              Could not load team members. Please try again.
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-4 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white"
            >
              Retry
            </button>
          </div>
        ) : (membersData?.members.length ?? 0) === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm text-neutral-500">No team members yet.</p>
            <Button type="button" className="mt-4 rounded-lg" asChild>
              <Link href={ADMIN_TEAMS_INVITE_ROUTE}>Invite team</Link>
            </Button>
          </div>
        ) : (
          <div role="table" aria-label="Admin team members">
            {membersData?.members.map((member) => (
              <TeamMemberRow
                key={member.id}
                member={member}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        )}
      </div>

      {isSuperAdmin ? (
        <CreateAdminModal
          open={createAdminOpen}
          onOpenChange={setCreateAdminOpen}
        />
      ) : null}

      <DeleteMemberModal
        memberName={deleteTarget?.fullName ?? ""}
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onConfirm={confirmDelete}
        isDeleting={deleteMutation.isPending}
      />
    </section>
  );
}
