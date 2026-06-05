"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { InviteByEmail } from "@/components/admin/teams/invite-by-email";
import { InviteByLink } from "@/components/admin/teams/invite-by-link";
import { PendingInvites } from "@/components/admin/teams/pending-invites";
import { useInvitesQuery } from "@/hooks/queries/use-admin-teams-queries";

/**
 * /admin/teams/invite — Invite teammates by email or shareable link and manage
 * pending invitations. Page content only; the admin shell is owned by @fez.
 */
export function InviteTeamView() {
  const { data, isLoading, isError } = useInvitesQuery();

  return (
    <section className="mx-auto w-full max-w-[720px] px-4 py-6 sm:px-6">
      <Link
        href="/admin/teams"
        className="mb-4 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-black-500"
      >
        <ChevronLeft className="size-4" />
        Back
      </Link>

      <div className="mb-5">
        <h1 className="text-xl font-semibold text-black-500">Invite team</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Invite teammates and manage their access.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <InviteByEmail />

        {isLoading ? (
          <div className="h-32 animate-pulse rounded-xl border border-gray-300 bg-gray-100" />
        ) : isError || !data ? (
          <p className="rounded-xl border border-gray-300 p-5 text-sm text-neutral-500">
            Could not load invite details. Please refresh and try again.
          </p>
        ) : (
          <>
            <InviteByLink link={data.link} />
            <PendingInvites invites={data.pending} />
          </>
        )}
      </div>
    </section>
  );
}
