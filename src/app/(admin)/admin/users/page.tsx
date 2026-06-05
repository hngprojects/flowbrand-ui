import { Suspense } from "react";
import { UsersTable } from "@/components/admin/users/users-table";
import { AdminShell } from "@/components/admin/layout/admin-shell";

export default function AdminUsersPage() {
  return (
    <AdminShell>
      <Suspense
        fallback={
          <div className="h-40 animate-pulse rounded-2xl bg-gray-100" />
        }
      >
        <UsersTable />
      </Suspense>
    </AdminShell>
  );
}
