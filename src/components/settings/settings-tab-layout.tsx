"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type SettingsTabLayoutProps = {
  children: ReactNode;
  footer?: ReactNode;
};

/** Scrollable tab body + optional footer pinned to the bottom of the settings modal. */
export function SettingsTabLayout({
  children,
  footer,
}: SettingsTabLayoutProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto">
        {children}
      </div>
      {footer}
    </div>
  );
}

type SettingsTabFooterProps = {
  children: ReactNode;
  className?: string;
};

/** Full-bleed footer bar at the bottom of the settings modal (edge to edge). */
export function SettingsTabFooter({
  children,
  className,
}: SettingsTabFooterProps) {
  return (
    <div
      className={cn(
        "shrink-0 -mx-8 flex flex-col gap-3 bg-white px-8 py-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
