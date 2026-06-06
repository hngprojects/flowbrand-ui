"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAdminUserProfile } from "@/lib/admin-users-api";
import { adminUsersKeys } from "@/hooks/queries/use-admin-users-queries";

/** GET /api/admin/users/:userId */
export function useAdminUserProfileQuery(userId: string) {
  return useQuery({
    queryKey: adminUsersKeys.detail(userId),
    queryFn: () => fetchAdminUserProfile(userId),
    enabled: Boolean(userId),
    staleTime: 30_000,
  });
}
