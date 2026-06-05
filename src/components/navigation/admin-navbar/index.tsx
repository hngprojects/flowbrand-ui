"use client";

import Link from "next/link";
import { useState } from "react";
import LogoIcon from "@/components/icons/navbar/logo";
import BellIcon from "@/components/icons/navbar/bell";
import ProfileIcon from "@/components/icons/navbar/profile";
import AdminSettingsModal from "@/components/modals/AdminSettingsModal";

export default function AdminNavbar() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-gray-500 bg-white px-4">
        <div className=" dashboard-layout-class flex h-[72px] items-center justify-between md:h-[83px]">
          <div className="flex items-center gap-3 md:gap-5">
            <Link href="/admin" className="cursor-pointer">
              <LogoIcon />
            </Link>
            <div className="flex items-center gap-2 rounded-xl border bg-gray-100 border-[#A2A2A2] px-4 py-2 w-[280px] ml-6">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0 text-[#A2A2A2]"
              >
                <circle
                  cx="7"
                  cy="7"
                  r="5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M11 11L14 14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                className="w-full text-sm outline-none placeholder:text-[#A2A2A2]"
              />
            </div>
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
