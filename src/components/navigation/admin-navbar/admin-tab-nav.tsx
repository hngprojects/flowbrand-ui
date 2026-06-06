"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ADMIN_LOGS_ROUTE,
  ADMIN_ROUTE,
  ADMIN_TEAMS_ROUTE,
  ADMIN_USERS_ROUTE,
} from "@/routes";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Overview", href: ADMIN_ROUTE, exact: true },
  { label: "Users", href: ADMIN_USERS_ROUTE },
  { label: "Teams", href: ADMIN_TEAMS_ROUTE, matchNested: true },
  { label: "Logs", href: ADMIN_LOGS_ROUTE, exact: true },
] as const;

function isTabActive(pathname: string, tab: (typeof TABS)[number]): boolean {
  if ("matchNested" in tab && tab.matchNested) {
    return pathname === tab.href || pathname.startsWith(`${tab.href}/`);
  }
  if ("exact" in tab && tab.exact) {
    return pathname === tab.href;
  }
  return pathname === tab.href || pathname.startsWith(`${tab.href}/`);
}

export function AdminTabNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Admin sections"
      className="mx-auto w-full min-w-0 max-w-[1800px] overflow-hidden border-b border-gray-200 px-4 sm:px-6 lg:px-18"
    >
      <div className="mt-4 min-w-0 overflow-x-auto overscroll-x-contain rounded-xl bg-white p-1 [-webkit-overflow-scrolling:touch] scrollbar-none sm:mt-6">
        <div className="flex w-max min-w-full gap-2 sm:gap-6 md:gap-10">
          {TABS.map((tab) => {
            const active = isTabActive(pathname, tab);

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "shrink-0 rounded-md px-3 py-2 text-sm font-medium transition-colors sm:px-5 sm:py-2.5",
                  active
                    ? "bg-primary text-white"
                    : "text-neutral-600 hover:bg-gray-100",
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
