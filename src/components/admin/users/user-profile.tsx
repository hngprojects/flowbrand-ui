"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { PdfImg } from "@/components/icons/pdf-img";
import { DeleteUserModal } from "@/components/admin/users/delete-user-modal";
import type { AdminUser } from "@/components/admin/users/users-table";
import { StatusBadge } from "./status-badge";

// ─── Stub data — replace with GET /api/users/:id ─────────────────────────────
const STUB_USER: AdminUser & {
  lastActive: string;
  signupFull: string;
  documents: { name: string; size: string }[];
  strategies: {
    id: string;
    title: string;
    source: "documents" | "questions";
    createdAt: string;
    info?: string;
    stages: {
      name: string;
      tasks: string;
      status: "complete" | "active" | "locked";
    }[];
  }[];
} = {
  id: "1",
  name: "Folake Adeyemi",
  email: "folake@folakeandco.com",
  plan: "Free",
  country: "Nigeria",
  status: "active",
  signupDate: "Mar 4",
  lastActive: "12 mins ago",
  signupFull: "Mar 4, 2026",
  documents: [
    { name: "Business requirement.pdf", size: "3.5 MB" },
    { name: "Business requirement.pdf", size: "1.5 MB" },
    { name: "Business requirement.pdf", size: "2.5 MB" },
  ],
  strategies: [
    {
      id: "s1",
      title: "I want to build a strategy for my small batch bakery",
      source: "documents",
      createdAt: "Mar 4, 2026",
      stages: [
        {
          name: "Get Noticed",
          tasks: "5/5 task this week",
          status: "complete",
        },
        {
          name: "Spark Interest",
          tasks: "7/10 task this week",
          status: "active",
        },
        {
          name: "Make first sale",
          tasks: "0/7 task this week",
          status: "locked",
        },
        {
          name: "Bring them back",
          tasks: "0/3 task this week",
          status: "locked",
        },
      ],
    },
    {
      id: "s2",
      title: "Social media platform isn't working for me",
      source: "questions",
      createdAt: "Mar 18, 2026",
      info: "I sell small chops and pastries for events and walk in customers who are typically Young women in Lagos who want affordable snacks. I get most of my customers from TikTok.",
      stages: [
        {
          name: "Get Noticed",
          tasks: "5/5 task this week",
          status: "complete",
        },
        {
          name: "Spark Interest",
          tasks: "7/10 task this week",
          status: "active",
        },
        {
          name: "Make first sale",
          tasks: "0/7 task this week",
          status: "locked",
        },
        {
          name: "Bring them back",
          tasks: "0/3 task this week",
          status: "locked",
        },
      ],
    },
    {
      id: "s3",
      title: "Grow my social media presence with reels",
      source: "documents",
      createdAt: "Mar 4, 2026",
      stages: [
        {
          name: "Get Noticed",
          tasks: "5/5 task this week",
          status: "complete",
        },
        {
          name: "Spark Interest",
          tasks: "7/10 task this week",
          status: "locked",
        },
        {
          name: "Make first sale",
          tasks: "0/7 task this week",
          status: "locked",
        },
        {
          name: "Bring them back",
          tasks: "0/3 task this week",
          status: "locked",
        },
      ],
    },
  ],
};

function stageDot(status: "complete" | "active" | "locked") {
  if (status === "complete") return "bg-[#22C55E]";
  if (status === "active") return "bg-[#F59E0B] ring-2 ring-[#F59E0B]/30";
  return "bg-[#D0D5DD]";
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function UserProfile({ userId }: { userId: string }) {
  const user = STUB_USER; // TODO: fetch GET /api/users/:userId
  if (userId !== user.id) {
    return (
      <div>
        User {userId} not found (stub data only shows user {user.id})
      </div>
    );
  }
  const [expanded, setExpanded] = useState<string[]>(["s1"]);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDeleteConfirm = () => {
    // TODO: DELETE /api/users/:userId
    setDeleteOpen(false);
  };

  return (
    <div className="mx-auto max-w-[1260px] flex flex-col gap-6">
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
