"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TeamMemberRow } from "@/components/admin/teams/team-member-row";
import { DeleteTeamModal } from "@/components/admin/teams/delete-team-modal";
import { useTeamMembersQuery } from "@/hooks/queries/use-admin-teams-queries";
import { useDeleteTeamMemberMutation } from "@/hooks/mutations/use-admin-team-mutations";
import type { TeamMember } from "@/types/admin";

/**
 * /admin/teams — Admin team list with role badges, presence, and per-member
 * removal. Renders inside the admin layout shell (sidebar + header + tabs)
 * owned by @fez; this view only owns the page content below the tabs.
 */
export function TeamsView() {
  const { data, isLoading, isError } = useTeamMembersQuery();
  const deleteMutation = useDeleteTeamMemberMutation();

  const [target, setTarget] = useState<TeamMember | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  function requestDelete(member: TeamMember) {
    setTarget(member);
    setModalOpen(true);
  }

  function confirmDelete() {
    if (!target) return;
    deleteMutation.mutate(target.id, {
      onSettled: () => {
        setModalOpen(false);
        setTarget(null);
      },
    });
  }

  return (
    <section className="mx-auto w-full max-w-[1100px] px-4 py-6 sm:px-6">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-black-500">
          {data?.teamName ?? "Admin team"}
        </h1>
        <Button asChild className="rounded-lg">
          <Link href="/admin/teams/invite">
            <Plus className="size-4" />
            Invite team
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border border-gray-300 bg-card">
        {isLoading ? (
          <ul className="divide-y divide-gray-300">
            {Array.from({ length: 8 }).map((_, index) => (
              <li
                key={index}
                className="flex items-center gap-3 px-4 py-3.5"
                aria-hidden="true"
              >
                <span className="size-9 animate-pulse rounded-full bg-gray-300" />
                <span className="h-4 w-40 animate-pulse rounded bg-gray-300" />
              </li>
            ))}
          </ul>
        ) : isError ? (
          <p className="px-4 py-10 text-center text-sm text-neutral-500">
            Could not load the team. Please refresh and try again.
          </p>
        ) : (
          <div role="table">
            {data?.members.map((member) => (
              <TeamMemberRow
                key={member.id}
                member={member}
                onDelete={requestDelete}
              />
            ))}
          </div>
        )}
      </div>

      <DeleteTeamModal
        member={target}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onConfirm={confirmDelete}
        isDeleting={deleteMutation.isPending}
      />
    </section>
  );
}
