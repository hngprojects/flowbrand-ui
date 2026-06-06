import { Suspense } from "react";
import { UsersTable } from "@/components/admin/users/users-table";
import { AdminShell } from "@/components/admin/layout/admin-shell";

export default function AdminUsersPage() {
  return (
    <AdminShell>
      {/* Required: UsersTable calls useSearchParams() for navbar search filter */}
      <UsersTable />
    </AdminShell>
  );
}
