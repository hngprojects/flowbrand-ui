import type { Metadata } from "next";
import { LogsView } from "@/components/admin/logs/logs-view";
import { AdminShell } from "@/components/admin/layout/admin-shell";

export const metadata: Metadata = {
  title: "Logs · Admin",
};

export default function AdminLogsPage() {
  return (
    <AdminShell>
      <LogsView />
    </AdminShell>
  );
}
