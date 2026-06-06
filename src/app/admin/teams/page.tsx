import type { Metadata } from "next";
import { TeamsView } from "@/components/admin/teams/teams-view";
import { AdminShell } from "@/components/admin/layout/admin-shell";

export const metadata: Metadata = {
  title: "Teams · Admin",
};

export default function AdminTeamsPage() {
  return (
    <AdminShell>
      <TeamsView />
    </AdminShell>
  );
}
