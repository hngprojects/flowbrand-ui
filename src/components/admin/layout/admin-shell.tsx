"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminNavbar from "@/components/navigation/admin-navbar/index";
import { AdminTabNav } from "@/components/navigation/admin-navbar/admin-tab-nav";
import Loader from "@/components/ui/loader";
import {
  getAdminSessionSnapshot,
  subscribeToAdminSession,
} from "@/lib/admin-session";
import { ADMIN_LOGIN_ROUTE } from "@/routes";

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
    if (!session) {
      router.replace(
        `${ADMIN_LOGIN_ROUTE}?callbackUrl=${encodeURIComponent(pathname)}`,
      );
    }
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
