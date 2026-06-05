"use client";

import { useState } from "react";
import { ActivityLogTable } from "@/components/admin/logs/activity-log-table";
import { LogDateFilter } from "@/components/admin/logs/log-date-filter";
import { LogPagination } from "@/components/admin/logs/log-pagination";
import { useActivityLogQuery } from "@/hooks/queries/use-admin-logs-queries";
import type { LogDateRange } from "@/types/admin";

/**
 * /admin/logs — Activity log with a date-range filter and pagination.
 * Page content only; the admin shell (sidebar/header/tabs) is owned by @fez.
 */
export function LogsView() {
  const [page, setPage] = useState(1);
  const [range, setRange] = useState<LogDateRange>("all");
  const { data, isLoading, isFetching, isError } = useActivityLogQuery(page);

  return (
    <section className="w-full">
      <div className="rounded-xl border border-gray-300 bg-card">
        <div className="flex items-center gap-3 px-4 py-4">
          <h1 className="text-base font-semibold text-black-500">
            Activity log
          </h1>
          <LogDateFilter
            value={range}
            onChange={(value) => {
              setRange(value);
              setPage(1);
            }}
          />
        </div>

        {isError ? (
          <p className="px-4 py-10 text-center text-sm text-neutral-500">
            Could not load the activity log. Please refresh and try again.
          </p>
        ) : (
          <ActivityLogTable
            entries={data?.entries ?? []}
            isLoading={isLoading || (isFetching && !data)}
          />
        )}

        <LogPagination
          page={data?.page ?? page}
          totalPages={data?.totalPages ?? 1}
          onPageChange={setPage}
        />
      </div>
    </section>
  );
}
