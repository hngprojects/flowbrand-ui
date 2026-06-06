"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAdminProfile } from "@/lib/admin-profile-api";

export const adminProfileKeys = {
  all: () => ["admin", "profile"] as const,
  me: () => ["admin", "profile", "me"] as const,
};

/** GET /api/admin/profile */
export function useAdminProfileQuery(enabled = true) {
  return useQuery({
    queryKey: adminProfileKeys.me(),
    queryFn: fetchAdminProfile,
    enabled,
    staleTime: 60_000,
  });
}
