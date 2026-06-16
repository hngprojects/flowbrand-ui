"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchAdminLogs } from "@/lib/admin-logs-api";
import type { ActivityLogData, LogDateRange } from "@/types/admin";

export const adminLogsKeys = {
  all: () => ["admin", "logs"] as const,
  list: (page: number, range: LogDateRange) =>
    ["admin", "logs", "list", page, range] as const,
};

/** GET /api/admin/logs — paginated, date-filtered activity log. */
export function useActivityLogQuery(
  page = 1,
  range: LogDateRange = "all",
  enabled = true,
) {
  return useQuery({
    queryKey: adminLogsKeys.list(page, range),
    queryFn: (): Promise<ActivityLogData> => fetchAdminLogs({ page, range }),
    enabled,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}
