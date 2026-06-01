"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/actions/user";

export const profileQueryKey = ["user", "profile"] as const;

export function useProfileQuery() {
  return useQuery({
    queryKey: profileQueryKey,
    queryFn: async () => {
      const res = await getUserProfile();
      if (!res.ok) throw new Error(res.error);
      return res.data;
    },
    staleTime: 60_000,
  });
}
