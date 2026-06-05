"use client";

import Link from "next/link";
import { useState } from "react";
import LogoIcon from "@/components/icons/navbar/logo";
import BellIcon from "@/components/icons/navbar/bell";
import ProfileIcon from "@/components/icons/navbar/profile";
import AdminSettingsModal from "@/components/modals/AdminSettingsModal";
import { AdminSearch } from "@/components/navigation/admin-navbar/admin-search";

export default function AdminNavbar() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-gray-500 bg-white">
        <div className="dashboard-layout-class flex h-[72px] items-center justify-between md:h-[83px]">
          <div className="flex items-center gap-3 md:gap-5">
            <Link href="/admin" className="cursor-pointer">
              <LogoIcon />
            </Link>
            <AdminSearch />
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/notifications"
              aria-label="Notifications"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-500 hover:bg-gray-50 transition-colors"
            >
              <BellIcon />
            </Link>
            <button
              type="button"
              aria-label="Profile settings"
              onClick={() => setSettingsOpen(true)}
              className="flex h-10 items-center gap-2 rounded-full border border-gray-500 px-3 py-2 hover:bg-gray-50 transition-colors"
            >
              <ProfileIcon />
              <span className="text-sm font-medium text-neutral-900">
                Profile
              </span>
            </button>
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
