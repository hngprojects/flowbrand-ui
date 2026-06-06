import { Suspense } from "react";
import type { Metadata } from "next";
import { InviteTeamView } from "@/components/admin/teams/invite-team-view";

export const metadata: Metadata = {
  title: "Invite team · Admin",
};

export default function AdminInviteTeamPage() {
  return (
    <Suspense
      fallback={<div className="h-40 animate-pulse rounded-2xl bg-gray-100" />}
    >
      <InviteTeamView />
    </Suspense>
  );
}
