"use client";

import { useSyncExternalStore } from "react";
import {
  getDashboardMockSessionSnapshot,
  subscribeDashboardMockSession,
  type DashboardMockSession,
} from "@/lib/dashboard-mock-session";

/** Client sessionStorage snapshot; server snapshot is always null (SSR-safe). */
export function useDashboardMockSession(): DashboardMockSession | null {
  return useSyncExternalStore(
    subscribeDashboardMockSession,
    getDashboardMockSessionSnapshot,
    () => null,
  );
}
