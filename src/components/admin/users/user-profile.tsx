"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { PdfImg } from "@/components/icons/pdf-img";
import { DeleteUserModal } from "@/components/admin/users/delete-user-modal";
import { StatusBadge } from "./status-badge";
import { useAdminUserProfileQuery } from "@/hooks/queries/use-admin-user-profile-queries";
import { useDeleteAdminUserMutation } from "@/hooks/mutations/use-admin-users-mutations";
import { useRouter } from "next/navigation";

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function UserProfile({ userId }: { userId: string }) {
  const router = useRouter();
  const { data: user, isLoading, isError } = useAdminUserProfileQuery(userId);
  const deleteMutation = useDeleteAdminUserMutation();
  const [expanded, setExpanded] = useState<string[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(userId, {
      onSuccess: () => {
        setDeleteOpen(false);
        router.push("/admin/users");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center">
        <p className="text-sm text-neutral-500">Loading user profile...</p>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center">
        <p className="text-sm text-neutral-500">
          User not found or could not be loaded.
        </p>
        <Link
          href="/admin/users"
          className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
        >
          Back to users
        </Link>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Back */}
      <Link
        href="/admin/users"
        className="flex w-fit items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </Link>

      {/* Header card */}
      <div className="flex items-center justify-between rounded-[16px] border border-primary-80 bg-white px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-500 text-xl font-semibold text-white">
            {initials(user.name)}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-neutral-900">
              {user.name}
            </h1>
            <p className="text-sm text-neutral-400">{user.email}</p>
          </div>
        </div>
        <StatusBadge status={user.status} />
      </div>

      {/* Body */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        {/* Left sidebar */}
        <div className="flex flex-col gap-5 md:w-[303px] md:shrink-0">
          {/* User details */}
          <div className="rounded-[16px] border border-primary-80 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-neutral-900">
              User details
            </h2>
            <div className="flex flex-col gap-3">
              {[
                {
                  label: "Plan",
                  value: user.plan,
                  color:
                    user.plan === "Free" ? "text-yellow-700" : "text-green-700",
                },
                { label: "Country", value: user.country },
                { label: "Sign up date", value: user.signupFull },
                { label: "Last active", value: user.lastActive },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-neutral-400">{label}</span>
                  <span
                    className={cn(
                      "text-sm font-medium text-neutral-900",
                      color,
                    )}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="rounded-[16px] border border-primary-80 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-neutral-900">
              Documents uploaded
            </h2>
            <div className="flex flex-col gap-3">
              {user.documents.map((doc, i) => (
                <div key={i} className="flex items-center gap-3">
                  <PdfImg className="h-9 w-9 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900 leading-tight">
                      {doc.name}
                    </p>
                    <p className="text-xs text-neutral-400">{doc.size}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — strategies */}
        <div className="flex-1 w-full rounded-[16px] border border-primary-80 bg-white p-5 md:p-6">
          <h2 className="mb-5 text-base font-semibold text-neutral-900">
            Strategies
          </h2>
          <div className="flex flex-col gap-4">
            {user.strategies.map((strategy) => {
              const isOpen = expanded.includes(strategy.id);
              return (
                <div
                  key={strategy.id}
                  className="rounded-[12px] border border-primary-80 overflow-hidden"
                >
                  {/* Strategy header */}
                  <button
                    type="button"
                    onClick={() =>
                      setExpanded((prev) =>
                        prev.includes(strategy.id)
                          ? prev.filter((id) => id !== strategy.id)
                          : [...prev, strategy.id],
                      )
                    }
                    className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex flex-col gap-1.5">
                      <p className="text-sm font-semibold text-neutral-900">
                        {strategy.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        {strategy.source === "documents" ? (
                          <span className="flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-500">
                            📄 Built from {user.documents.length} documents
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 rounded-full bg-accent-50 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
                            ❓ Built from questions
                          </span>
                        )}
                        <span className="text-xs text-neutral-400">
                          Created {strategy.createdAt}
                        </span>
                      </div>
                    </div>
                    <ChevronDown
                      className={cn(
                        "mt-0.5 h-5 w-5 shrink-0 text-neutral-400 transition-transform duration-200",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>

                  {/* Expanded content */}
                  {isOpen && (
                    <div className="border-t border-primary-80 px-5 py-4 flex flex-col gap-3">
                      {strategy.stages.map((stage) => (
                        <div
                          key={stage.name}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center justify-between w-full">
                            {/* LEFT SIDE */}
                            <div className="flex items-center gap-2.5">
                              <div className="h-2 w-2 shrink-0 rounded-full bg-primary-500" />

                              <div>
                                <p className="text-sm font-medium text-neutral-900">
                                  {stage.name}
                                </p>
                                <p className="text-xs text-neutral-400">
                                  {stage.tasks}
                                </p>
                              </div>
                            </div>

                            {/* RIGHT SIDE STATUS DOT */}
                            <div
                              className={cn(
                                "h-2 w-2 shrink-0 rounded-full",
                                stage.status === "complete" && "bg-green-500",
                                stage.status === "active" && "bg-yellow-500",
                                stage.status === "locked" && "bg-neutral-300",
                              )}
                            />
                          </div>
                        </div>
                      ))}

                      {strategy.info && (
                        <div className="mt-2 rounded-[8px] bg-background-muted p-3">
                          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
                            Information Provided
                          </p>
                          <p className="text-sm text-neutral-600">
                            {strategy.info}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <DeleteUserModal
        isOpen={deleteOpen}
        userName={user.name}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
