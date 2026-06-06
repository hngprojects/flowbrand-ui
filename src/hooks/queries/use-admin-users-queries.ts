"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchAdminUsers,
  type AdminUsersListParams,
} from "@/lib/admin-users-api";

export const adminUsersKeys = {
  all: () => ["admin", "users"] as const,
  list: (params: AdminUsersListParams) =>
    ["admin", "users", "list", params] as const,
  detail: (userId: string) => ["admin", "users", "detail", userId] as const,
};

/** GET /api/admin/users */
export function useAdminUsersQuery(params: AdminUsersListParams) {
  return useQuery({
    queryKey: adminUsersKeys.list(params),
    queryFn: () => fetchAdminUsers(params),
    staleTime: 30_000,
  });
}
