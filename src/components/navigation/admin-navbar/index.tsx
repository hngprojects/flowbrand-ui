"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import LogoIcon from "@/components/icons/navbar/logo";
import BellIcon from "@/components/icons/navbar/bell";
import ProfileIcon from "@/components/icons/navbar/profile";
import { AdminSearch } from "@/components/navigation/admin-navbar/admin-search";
import { ADMIN_NOTIFICATIONS_ROUTE, ADMIN_ROUTE } from "@/routes";

const AdminSettingsModal = dynamic(
  () => import("@/components/modals/AdminSettingsModal"),
  { ssr: false },
);

export default function AdminNavbar() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-gray-500 bg-white">
        <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-18">
          <div className="flex h-[72px] items-center justify-between gap-3 md:h-[83px]">
            <Link href={ADMIN_ROUTE} className="shrink-0 cursor-pointer">
              <LogoIcon />
            </Link>

            <div className="hidden min-w-0 flex-1 md:block md:max-w-[360px] lg:max-w-[420px]">
              <AdminSearch className="ml-0 max-w-none" />
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <Link
                href={ADMIN_NOTIFICATIONS_ROUTE}
                aria-label="Notifications"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-500 hover:bg-gray-50 transition-colors"
              >
                <BellIcon />
              </Link>
              <button
                type="button"
                aria-label="Profile settings"
                onClick={() => setSettingsOpen(true)}
                className="flex h-10 items-center gap-2 rounded-full border border-gray-500 px-2 py-2 hover:bg-gray-50 transition-colors sm:px-3"
              >
                <ProfileIcon />
                <span className="hidden text-sm font-medium text-neutral-900 sm:inline">
                  Profile
                </span>
              </button>
            </div>
          </div>

          <div className="pb-3 md:hidden">
            <AdminSearch className="max-w-none" />
          </div>
        </div>
      </nav>

      <AdminSettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
}
