"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import LogoIcon from "@/components/icons/navbar/logo";
import BellIcon from "@/components/icons/navbar/bell";
import ProfileIcon from "@/components/icons/navbar/profile";
import { LogoutButton } from "@/components/auth/logout-button";
import { useEffect, useRef, useState, type ReactNode } from "react";
import FunnelSidebar from "@/components/dashboard/funnel/funnel-sidebar";
import type { MockUploadedDoc } from "@/lib/dashboard-mock-data";
import {
  DUMMY_STRATEGY_PHASES,
  DEFAULT_UPLOADED_DOCS,
} from "@/lib/dashboard-mock-data";
import { FUNNEL_ROUTE } from "@/routes";

interface OnboardingNavbarProps {
  steps?: ReactNode;
  loading?: boolean;
  documents?: MockUploadedDoc[];
  strategyPhases?: readonly { title: string; tasks: string }[];
}

const OnboardingNavbar = ({
  steps = null,
  loading = false,
  documents = DEFAULT_UPLOADED_DOCS,
  strategyPhases = DUMMY_STRATEGY_PHASES,
}: OnboardingNavbarProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isFunnelRoute = pathname === FUNNEL_ROUTE;

  useEffect(() => {
    if (!profileOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [profileOpen]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-md">
        <div className="layout-components-class flex h-[83px] items-center justify-between">
          <div className="flex items-center gap-3">
            {isFunnelRoute && (
              <button
                className="z-50 flex h-11 w-11 items-center justify-center rounded-[41px] border-[0.5px] border-gray-500 p-[10px] lg:hidden"
                onClick={() => setDrawerOpen(!drawerOpen)}
                aria-label={drawerOpen ? "Close menu" : "Open menu"}
              >
                {drawerOpen ? (
                  <X size={24} className="text-foreground" />
                ) : (
                  <Menu size={24} className="text-foreground" />
                )}
              </button>
            )}

            <Link href="/" className="cursor-pointer">
              <LogoIcon />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Notifications"
              className="border-gray-500 flex h-11 w-11 items-center justify-center rounded-[41px] border-[0.5px] p-[10px]"
            >
              <BellIcon />
            </button>
            <div ref={profileRef} className="relative">
              <button
                type="button"
                aria-label="Profile menu"
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen((open) => !open)}
                className="border-gray-500 flex h-11 items-center gap-[10px] rounded-[41px] border-[0.5px] px-3 py-[10px] lg:w-[103px]"
              >
                <ProfileIcon />
                <span className="text-foreground hidden text-sm font-medium lg:inline">
                  Profile
                </span>
              </button>
              {profileOpen && (
                <div className="border-border absolute top-[calc(100%+8px)] right-0 z-50 min-w-[160px] overflow-hidden rounded-xl border bg-white py-1 shadow-lg">
                  <LogoutButton variant="menu" className="flex" />
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {isFunnelRoute && (
        <>
          <div
            onClick={() => setDrawerOpen(false)}
            className={`fixed inset-0 z-40 transition-opacity duration-300 lg:hidden ${
              drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            style={{ backgroundColor: "rgba(3, 13, 31, 0.8)" }}
          />

          <div
            className={`fixed top-0 left-0 z-50 h-full w-[90vw] transform overflow-auto bg-white transition-transform duration-300 ease-in-out lg:hidden ${
              drawerOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <button
              className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close sidebar"
            >
              <X size={18} className="text-foreground" />
            </button>

            <FunnelSidebar
              steps={steps}
              loading={loading}
              documents={documents}
              strategyPhases={strategyPhases}
              className="!block !h-full !w-full border-none"
            />
          </div>
        </>
      )}
    </>
  );
};

export default OnboardingNavbar;
