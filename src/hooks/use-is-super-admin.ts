"use client";

import { useMemo } from "react";
import { useSyncExternalStore } from "react";
import { useAdminProfileQuery } from "@/hooks/queries/use-admin-profile-queries";
import { isSuperAdminRole, normalizeAdminRole } from "@/lib/admin-role";
import {
  getAdminSessionSnapshot,
  subscribeToAdminSession,
} from "@/lib/admin-session";

/**
 * True only for super_admin. Uses JWT role from session first, then profile API.
 * Returns false while role is unknown or for regular admins.
 */
export function useIsSuperAdmin(): boolean {
  const session = useSyncExternalStore(
    subscribeToAdminSession,
    getAdminSessionSnapshot,
    () => null,
  );
  const { data: profile } = useAdminProfileQuery(Boolean(session));

  return useMemo(() => {
    const sessionRole = normalizeAdminRole(session?.role);
    if (sessionRole) return isSuperAdminRole(sessionRole);

    const profileRole = normalizeAdminRole(profile?.role);
    if (profileRole) return isSuperAdminRole(profileRole);

    return false;
  }, [session?.role, profile?.role]);
}
