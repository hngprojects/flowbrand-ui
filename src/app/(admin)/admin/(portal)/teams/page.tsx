import type { Metadata } from "next";
import { AdminTeamView } from "@/components/admin/teams/admin-team-view";

export const metadata: Metadata = {
  title: "Teams · Admin",
};

export default function AdminTeamsPage() {
  return <AdminTeamView />;
}
