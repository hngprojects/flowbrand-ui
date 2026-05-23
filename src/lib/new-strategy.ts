import { ONBOARDING_UPLOAD_ROUTE, STRATEGY_ROUTE } from "@/routes";
import type { AuthMeProfile } from "@/lib/auth-api";

export const NEW_STRATEGY_QUERY = "newStrategy";
export const NEW_STRATEGY_SESSION_FLAG = "flowbrand_new_strategy_flow";

function readSessionFlag(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeSessionFlag(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // Private mode / quota — ignore
  }
}

function removeSessionFlag(key: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function isOnboardingComplete(me: AuthMeProfile | null): boolean {
  return Boolean(me?.has_strategy || me?.onboarding_completed);
}

export function isNewStrategySearchParam(
  value: string | string[] | null | undefined,
): boolean {
  if (Array.isArray(value)) return value.includes("1");
  return value === "1";
}

export function isNewStrategyFlow(): boolean {
  if (typeof window === "undefined") return false;
  if (readSessionFlag(NEW_STRATEGY_SESSION_FLAG) === "1") return true;
  try {
    return (
      new URLSearchParams(window.location.search).get(NEW_STRATEGY_QUERY) ===
      "1"
    );
  } catch {
    return false;
  }
}

export function markNewStrategyFlow(): void {
  writeSessionFlag(NEW_STRATEGY_SESSION_FLAG, "1");
}

export function clearNewStrategyFlow(): void {
  removeSessionFlag(NEW_STRATEGY_SESSION_FLAG);
}

export function newStrategyOnboardingPath(): string {
  return `${ONBOARDING_UPLOAD_ROUTE}?${NEW_STRATEGY_QUERY}=1`;
}

/** Where to send users who already finished onboarding (not starting over). */
export function strategyHomePath(): string {
  return STRATEGY_ROUTE;
}
