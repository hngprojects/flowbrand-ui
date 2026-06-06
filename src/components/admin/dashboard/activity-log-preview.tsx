"use client";

import Link from "next/link";
import { ActivityLogTable } from "@/components/admin/logs/activity-log-table";
import { ADMIN_LOGS_ROUTE } from "@/routes";
import type { ActivityLogEntry } from "@/types/admin";

type ActivityLogPreviewProps = {
  entries: ActivityLogEntry[];
  isLoading?: boolean;
};

export function ActivityLogPreview({
  entries,
  isLoading,
}: ActivityLogPreviewProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 px-4 py-4 sm:px-5">
        <h2 className="text-base font-semibold text-black-500">Activity log</h2>
        <Link
          href={ADMIN_LOGS_ROUTE}
          className="text-sm font-medium text-primary hover:underline"
        >
          See all
        </Link>
      </div>
      <ActivityLogTable entries={entries} isLoading={isLoading} />
    </section>
  );
}
