import type { Metadata } from "next";
import { InviteTeamView } from "@/components/admin/teams/invite-team-view";

export const metadata: Metadata = {
  title: "Invite team · Admin",
};

export default function AdminInviteTeamPage() {
  return <InviteTeamView />;
}
