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
  { label: "User", href: ADMIN_USERS_ROUTE },
  { label: "Teams", href: ADMIN_TEAMS_ROUTE },
  { label: "Logs", href: ADMIN_LOGS_ROUTE },
] as const;

export function AdminTabNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Admin sections"
      className="border-b border-gray-200 dashboard-layout-class "
    >
      <div className=" flex gap-14 overflow-x-auto  scrollbar-none bg-white w-fit rounded-xl p-1 mt-6">
        {TABS.map((tab) => {
          const isActive =
            "exact" in tab && tab.exact
              ? pathname === tab.href
              : pathname === tab.href || pathname.startsWith(`${tab.href}/`);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "shrink-0 rounded-md px-5 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-white"
                  : "text-neutral-600 hover:bg-gray-100",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
