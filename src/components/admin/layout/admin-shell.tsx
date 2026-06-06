"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminNavbar from "@/components/navigation/admin-navbar/index";
import { AdminTabNav } from "@/components/navigation/admin-navbar/admin-tab-nav";
import Loader from "@/components/ui/loader";
import { normalizeAdminRole } from "@/lib/admin-role";
import {
  getAdminSessionSnapshot,
  subscribeToAdminSession,
  writeAdminSession,
} from "@/lib/admin-session";
import { ADMIN_LOGIN_ROUTE } from "@/routes";
import type { AdminRole } from "@/types/admin";

async function bootstrapAdminSessionFromCookie(): Promise<boolean> {
  const readProfile = async () => {
    const res = await fetch("/api/admin/gateway/profile", {
      credentials: "include",
    });
    if (!res.ok) return null;

    const body = (await res.json().catch(() => null)) as {
      data?: { email?: string; role?: string };
      email?: string;
      role?: string;
    } | null;
    const data = body?.data ?? body;
    if (!data?.email && !data?.role) return null;

    return {
      email: data.email,
      role: normalizeAdminRole(data.role) ?? undefined,
    };
  };

  let profile = await readProfile();
  if (!profile) {
    const refresh = await fetch("/api/admin/auth/refresh-token", {
      method: "POST",
      credentials: "include",
    });
    if (refresh.ok) {
      const refreshBody = (await refresh.json().catch(() => ({}))) as {
        role?: AdminRole;
      };
      profile = await readProfile();
      if (!profile && refreshBody.role) {
        writeAdminSession({ role: refreshBody.role });
        return true;
      }
    }
  }

  if (!profile) return false;

  writeAdminSession(profile);
  return true;
}

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const session = useSyncExternalStore(
    subscribeToAdminSession,
    getAdminSessionSnapshot,
    () => null,
  );

  useEffect(() => {
    if (session) return;

    let cancelled = false;

    void (async () => {
      const restored = await bootstrapAdminSessionFromCookie();
      if (cancelled) return;

      if (!restored) {
        router.replace(
          `${ADMIN_LOGIN_ROUTE}?callbackUrl=${encodeURIComponent(pathname)}`,
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session, pathname, router]);

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]">
        <Loader text="Loading admin portal..." />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen min-w-0 flex-col overflow-x-hidden bg-[#F7F7F7]">
      <AdminNavbar />
      <AdminTabNav />
      <main className="mx-auto w-full max-w-[1800px] flex-1 px-4 py-6 sm:px-6 lg:px-18">
        {children}
      </main>
    </div>
  );
}
