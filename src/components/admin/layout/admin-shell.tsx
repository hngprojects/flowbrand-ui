"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminNavbar from "@/components/navigation/admin-navbar/index";
import { AdminTabNav } from "@/components/navigation/admin-navbar/admin-tab-nav";
import Loader from "@/components/ui/loader";
import { readAdminSession } from "@/lib/admin-session";
import { ADMIN_LOGIN_ROUTE } from "@/routes";

type AdminShellProps = {
  children: ReactNode;
};

function subscribeToAdminSession() {
  return () => {};
}

function getAdminSessionSnapshot() {
  return readAdminSession();
}

function getAdminSessionServerSnapshot() {
  return null;
}

export function AdminShell({ children }: AdminShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const session = useSyncExternalStore(
    subscribeToAdminSession,
    getAdminSessionSnapshot,
    getAdminSessionServerSnapshot,
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
    <div className="flex min-h-screen flex-col bg-[#F7F7F7]">
      <AdminNavbar />
      <AdminTabNav />
      <main className="dashboard-layout-class w-full flex-1 py-6">
        {children}
      </main>
    </div>
  );
}
