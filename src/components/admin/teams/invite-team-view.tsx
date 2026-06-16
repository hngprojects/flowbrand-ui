"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { InviteByEmail } from "@/components/admin/teams/invite-by-email";
import { InviteByLink } from "@/components/admin/teams/invite-by-link";
import { PendingInvites } from "@/components/admin/teams/pending-invites";
import {
  useAdminPortalTeamQuery,
  useTeamInvitationsQuery,
  useTeamInviteLinkQuery,
} from "@/hooks/queries/use-admin-teams-queries";
import { ADMIN_TEAMS_ROUTE } from "@/routes";

export function InviteTeamView() {
  const { data: team, isLoading: teamLoading } = useAdminPortalTeamQuery();
  const teamId = team?.id ?? "";

  const {
    data: invites,
    isLoading: invitesLoading,
    isError: invitesError,
  } = useTeamInvitationsQuery(teamId, Boolean(teamId));

  const {
    data: inviteLink,
    isLoading: linkLoading,
    isError: linkError,
  } = useTeamInviteLinkQuery(teamId, Boolean(teamId));

  const isLoading = teamLoading || invitesLoading || linkLoading;

  if (!teamLoading && !teamId) {
    return (
      <section className="w-full max-w-[720px]">
        <BackLink />
        <p className="rounded-2xl border border-[#EAECF0] bg-white p-6 text-sm text-neutral-500">
          No admin team is set up yet. Contact a super admin to configure the
          portal team.
        </p>
      </section>
    );
  }

  return (
    <section className="w-full max-w-[720px]">
      <BackLink />

      <div className="mb-6">
        <h1 className="text-xl font-semibold text-black-500">Invite team</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Invite teammates and manage their access.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {teamId ? <InviteByEmail teamId={teamId} /> : null}

        {isLoading ? (
          <div className="h-36 animate-pulse rounded-2xl border border-[#EAECF0] bg-gray-100" />
        ) : linkError ? (
          <p className="rounded-2xl border border-[#EAECF0] bg-white p-6 text-sm text-neutral-500">
            Could not load the invite link. Please refresh and try again.
          </p>
        ) : inviteLink && teamId ? (
          <InviteByLink
            key={`${inviteLink.url}-${inviteLink.role}`}
            teamId={teamId}
            link={inviteLink}
          />
        ) : null}

        {isLoading ? (
          <div className="h-32 animate-pulse rounded-2xl border border-[#EAECF0] bg-gray-100" />
        ) : invitesError ? (
          <p className="rounded-2xl border border-[#EAECF0] bg-white p-6 text-sm text-neutral-500">
            Could not load invitations. Please refresh and try again.
          </p>
        ) : teamId ? (
          <PendingInvites teamId={teamId} invites={invites ?? []} />
        ) : null}
      </div>
    </section>
  );
}

function BackLink() {
  return (
    <Link
      href={ADMIN_TEAMS_ROUTE}
      className="mb-4 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-black-500"
    >
      <ChevronLeft className="size-4" />
      Back to teams
    </Link>
  );
}
