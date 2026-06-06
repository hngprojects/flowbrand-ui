"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DeleteUserModal } from "@/components/admin/users/delete-user-modal";
import { ADMIN_STUB_USERS } from "@/lib/admin-users-stub";
import { StatusBadge } from "./status-badge";

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Component ────────────────────────────────────────────────────────────────

export function UsersTable() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<FilterTab>("all");
  const search = searchParams.get("search")?.trim() ?? "";
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [users, setUsers] = useState<AdminUser[]>(ADMIN_STUB_USERS);

  const filtered = users.filter((u) => {
    const matchesTab =
      tab === "all" ||
      (tab === "active" && u.status === "active") ||
      (tab === "inactive" && u.status === "inactive");
    const matchesSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const counts = useMemo(
    () => ({
      all: users.length,
      active: users.filter((u) => u.status === "active").length,
      inactive: users.filter((u) => u.status === "inactive").length,
    }),
    [users],
  );

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    // TODO: call DELETE /api/users/:id when backend ready
    setUsers((prev) =>
      prev.map((u) =>
        u.id === deleteTarget.id
          ? { ...u, status: "deleted" as UserStatus }
          : u,
      ),
    );
    setDeleteTarget(null);
  };

  const TABS: { key: FilterTab; label: string }[] = [
    { key: "all", label: `All (${counts.all})` },
    { key: "active", label: `Active (${counts.active})` },
    { key: "inactive", label: `Inactive (${counts.inactive})` },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Tab bar */}
      <div className="flex gap-1 rounded-[12px] border border-[#EAECF0] bg-white p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-[8px] px-5 py-2 text-sm font-medium transition-colors",
              tab === t.key
                ? "bg-primary-50 text-secondary-700"
                : "text-neutral-500 hover:text-neutral-700",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Table card */}
      <div className="overflow-hidden rounded-[16px] border border-[#EAECF0] bg-white">
        {/* Table */}
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
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-sm text-neutral-400"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr
                    key={user.id}
                    className="group transition-colors hover:bg-neutral-50"
                  >
                    {/* User cell */}
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
                    {/* Plan */}
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
                    {/* Country */}
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {user.country}
                    </td>
                    {/* Status */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <StatusBadge status={user.status} />
                      </div>
                    </td>
                    {/* Signup date */}
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {user.signupDate}
                    </td>
                    {/* <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(user)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td> */}
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
