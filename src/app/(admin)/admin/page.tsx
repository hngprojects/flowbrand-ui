import { AdminDashboardView } from "@/components/admin/dashboard/admin-dashboard-view";
import { AdminShell } from "@/components/admin/layout/admin-shell";

export const metadata = {
  title: "Admin Overview",
};

export default function AdminDashboardPage() {
  return (
    <AdminShell>
      <AdminDashboardView />
    </AdminShell>
  );
}
