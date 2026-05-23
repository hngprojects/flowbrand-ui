"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import LogoIcon from "@/components/icons/navbar/logo";
import BellIcon from "@/components/icons/navbar/bell";
import ProfileIcon from "@/components/icons/navbar/profile";
import { useEffect, useRef, useState } from "react";
import StrategySidebar from "@/components/dashboard/strategy/strategy-sidebar";
import FunnelModal from "@/components/modals/FunnelModal";
import MyProfileTab from "@/components/settings/tabs/MyProfileTab";
import PasswordSecurityTab from "@/components/settings/tabs/PasswordSecurityTab";
import NotificationPreferencesTab from "@/components/settings/tabs/NotificationsPrefrencesTab";
import DeleteAccountTab from "@/components/settings/tabs/DeleteAccountTab";
import type { MockUploadedDoc } from "@/lib/dashboard-mock-data";
import {
  DUMMY_STRATEGY_PHASES,
  DEFAULT_UPLOADED_DOCS,
} from "@/lib/dashboard-mock-data";
import { STRATEGY_ROUTE } from "@/routes";
import { cn } from "@/lib/utils";

interface OnboardingNavbarProps {
  loading?: boolean;
  documents?: MockUploadedDoc[];
  strategyPhases?: readonly { title: string; tasks: string }[];
}

const OnboardingNavbar = ({
  loading = false,
  documents = DEFAULT_UPLOADED_DOCS,
  strategyPhases = DUMMY_STRATEGY_PHASES,
}: OnboardingNavbarProps) => {
  const [drawerPath, setDrawerPath] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const pathname = usePathname();
  const drawerOpen = drawerPath === pathname;

  const isStrategyRoute = pathname === STRATEGY_ROUTE;
  const isDashboardFlow =
    pathname.startsWith("/dashboard/onboarding") || isStrategyRoute;

  const showMenuButton = isDashboardFlow;

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-[#EAECF0] bg-white/90 backdrop-blur-md px-4">
        <div className="dashboard-layout-class flex h-[72px] items-center justify-between md:h-[83px]">
          <div className="flex items-center gap-2 md:gap-3">
            {showMenuButton && (
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#EAECF0] lg:hidden"
                onClick={() => {
                  if (isStrategyRoute) {
                    setDrawerPath(drawerOpen ? null : pathname);
                  }
                }}
                aria-label={drawerOpen ? "Close menu" : "Open menu"}
              >
                {drawerOpen ? (
                  <X size={22} className="text-[#101828]" />
                ) : (
                  <Menu size={22} className="text-[#101828]" />
                )}
              </button>
            )}

            <Link href="/" className="cursor-pointer">
              <LogoIcon />
            </Link>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              type="button"
              aria-label="Notifications"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#EAECF0] md:h-11 md:w-11"
            >
              <BellIcon />
            </button>

            <button
              type="button"
              aria-label="Profile settings"
              onClick={() => setSettingsOpen(true)}
              className="flex h-10 items-center gap-2 rounded-full border border-[#EAECF0] px-2.5 py-2 md:h-11 md:gap-[10px] md:px-3 md:py-[10px] lg:w-[103px]"
            >
              <ProfileIcon />
              <span className="hidden text-sm font-medium text-[#101828] lg:inline">
                Profile
              </span>
            </button>
          </div>
        </div>
      </nav>

      <FunnelModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        defaultTab="profile"
        title="Settings"
        tabs={[
          {
            id: "profile",
            label: "My Profile",
            content: <MyProfileTab onClose={() => setSettingsOpen(false)} />,
          },
          {
            id: "password",
            label: "Password & Security",
            content: <PasswordSecurityTab />,
          },
          {
            id: "notifications",
            label: "Notification Preferences",
            content: <NotificationPreferencesTab />,
          },
          {
            id: "delete",
            label: "Delete Account",
            content: (
              <DeleteAccountTab onClose={() => setSettingsOpen(false)} />
            ),
          },
        ]}
      />

      {isStrategyRoute && (
        <>
          <div
            onClick={() => setDrawerPath(null)}
            className={cn(
              "fixed inset-0 z-40 transition-opacity duration-300 lg:hidden",
              drawerOpen ? "opacity-100" : "pointer-events-none opacity-0",
            )}
            style={{ backgroundColor: "rgba(3, 13, 31, 0.8)" }}
          />

          <div
            className={cn(
              "fixed top-0 left-0 z-50 h-full w-[min(90vw,360px)] overflow-auto bg-white transition-transform duration-300 ease-in-out lg:hidden",
              drawerOpen ? "translate-x-0" : "-translate-x-full",
            )}
          >
            <div className="flex items-center justify-between border-b border-[#EAECF0] px-4 py-4">
              <Link href="/" className="cursor-pointer">
                <LogoIcon />
              </Link>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EAECF0]"
                onClick={() => setDrawerPath(null)}
                aria-label="Close sidebar"
              >
                <X size={18} className="text-[#101828]" />
              </button>
            </div>

            <div className="overflow-y-auto p-4">
              <StrategySidebar
                loading={loading}
                documents={documents}
                strategyPhases={strategyPhases}
                className="!static !top-auto !flex !h-auto !max-w-none !w-full !overflow-visible !border-0 px-0 py-0"
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default OnboardingNavbar;
