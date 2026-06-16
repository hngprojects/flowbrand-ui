import { Suspense } from "react";
import { UsersTable } from "@/components/admin/users/users-table";

export default function AdminUsersPage() {
  return (
    <Suspense
      fallback={<div className="h-40 animate-pulse rounded-2xl bg-gray-100" />}
    >
      {/* Required: UsersTable calls useSearchParams() for navbar search filter */}
      <UsersTable />
    </Suspense>
  );
}
