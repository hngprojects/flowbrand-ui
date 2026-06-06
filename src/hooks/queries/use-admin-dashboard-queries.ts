"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAdminDashboard } from "@/lib/admin-dashboard-api";
import type { AdminDashboardData } from "@/types/admin";

export const adminDashboardKeys = {
  all: () => ["admin", "dashboard"] as const,
  overview: () => ["admin", "dashboard", "overview"] as const,
};

/** GET /api/admin/dashboard/* — overview metrics and chart data. */
export function useAdminDashboardQuery(enabled = true) {
  return useQuery({
    queryKey: adminDashboardKeys.overview(),
    queryFn: (): Promise<AdminDashboardData> => fetchAdminDashboard(),
    enabled,
    staleTime: 30_000,
  });
}
