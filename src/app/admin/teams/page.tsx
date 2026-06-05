import type { Metadata } from "next";
import { TeamsView } from "@/components/admin/teams/teams-view";

export const metadata: Metadata = {
  title: "Teams · Admin",
};

export default function AdminTeamsPage() {
  return <TeamsView />;
}
