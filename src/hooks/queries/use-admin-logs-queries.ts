"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchActivityLog } from "@/lib/admin-mock-data";
import type { ActivityLogData } from "@/types/admin";

export const adminLogsKeys = {
  all: () => ["admin", "logs"] as const,
  list: (page: number) => ["admin", "logs", "list", page] as const,
};

/** GET /admin/logs (mock) — paginated activity log. */
export function useActivityLogQuery(page = 1, enabled = true) {
  return useQuery({
    queryKey: adminLogsKeys.list(page),
    queryFn: (): Promise<ActivityLogData> => fetchActivityLog(page),
    enabled,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}
