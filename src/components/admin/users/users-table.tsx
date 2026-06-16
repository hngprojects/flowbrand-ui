"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DeleteUserModal } from "@/components/admin/users/delete-user-modal";
import { StatusBadge } from "./status-badge";
import { useAdminUsersQuery } from "@/hooks/queries/use-admin-users-queries";
import { useDeleteAdminUserMutation } from "@/hooks/mutations/use-admin-users-mutations";

export type UserStatus = "active" | "inactive" | "deleted";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  plan: "Free" | "Pro";
  country: string;
  status: UserStatus;
  signupDate: string;
}

type FilterTab = "all" | "active" | "inactive";

function initials(name: string) {
  return (
    name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0] || "")
      .join("")
      .toUpperCase() || "?"
  );
}

export function UsersTable() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<FilterTab>("all");
  const search = searchParams.get("search")?.trim() ?? "";
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const deleteMutation = useDeleteAdminUserMutation();

  const { data, isLoading, isError, refetch } = useAdminUsersQuery({
    status: tab,
    search: search || undefined,
    page: 1,
    perPage: 50,
    sortBy: "created_at",
    sortDir: "desc",
  });

  const users = data?.users ?? [];
  const total = data?.meta.total ?? 0;

  const TABS: { key: FilterTab; label: string }[] = useMemo(
    () => [
      { key: "all", label: tab === "all" ? `All (${total})` : "All" },
      {
        key: "active",
        label: tab === "active" ? `Active (${total})` : "Active",
      },
      {
        key: "inactive",
        label: tab === "inactive" ? `Inactive (${total})` : "Inactive",
      },
    ],
    [tab, total],
  );

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  if (isError) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
        <p className="text-sm text-neutral-500">
          Could not load users. Please try again.
        </p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-4 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full gap-1 overflow-x-auto rounded-[12px] border border-[#EAECF0] bg-white p-1 scrollbar-none sm:w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "shrink-0 rounded-[8px] px-4 py-2 text-sm font-medium transition-colors sm:px-5",
              tab === t.key
                ? "bg-primary-50 text-secondary-700"
                : "text-neutral-500 hover:text-neutral-700",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-[16px] border border-[#EAECF0] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-[#EAECF0]">
                {["USER", "PLAN", "COUNTRY", "STATUS", "SIGNUP DATE"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wide text-[#667085]"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAECF0]">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-sm text-neutral-400"
                  >
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-sm text-neutral-400"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="group transition-colors hover:bg-neutral-50"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="flex items-center gap-3"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EBF0FA] text-sm font-semibold text-[#152D58]">
                          {initials(user.name)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[`#030D1F`] group-hover:text-primary-600 transition-colors">
                            {user.name}
                          </p>
                          <p className="text-xs text-[#565D69]">{user.email}</p>
                        </div>
                      </Link>
                    </td>
                    <td
                      className={cn(
                        "px-6 py-4 text-sm font-medium",
                        user.plan === "Free"
                          ? "text-yellow-700"
                          : "text-green-700",
                      )}
                    >
                      {user.plan}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {user.country}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <StatusBadge status={user.status} />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {user.signupDate}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteUserModal
        isOpen={Boolean(deleteTarget)}
        userName={deleteTarget?.name ?? ""}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
