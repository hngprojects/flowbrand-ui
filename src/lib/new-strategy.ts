import { ONBOARDING_UPLOAD_ROUTE, FUNNEL_ROUTE } from "@/routes";
import type { AuthMeProfile } from "@/lib/auth-api";

export const NEW_STRATEGY_QUERY = "newStrategy";
export const NEW_STRATEGY_SESSION_FLAG = "flowbrand_new_strategy_flow";

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
  if (sessionStorage.getItem(NEW_STRATEGY_SESSION_FLAG) === "1") return true;
  return (
    new URLSearchParams(window.location.search).get(NEW_STRATEGY_QUERY) === "1"
  );
}

export function markNewStrategyFlow(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(NEW_STRATEGY_SESSION_FLAG, "1");
}

export function clearNewStrategyFlow(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(NEW_STRATEGY_SESSION_FLAG);
}

export function newStrategyOnboardingPath(): string {
  return `${ONBOARDING_UPLOAD_ROUTE}?${NEW_STRATEGY_QUERY}=1`;
}

/** Where to send users who already finished onboarding (not starting over). */
export function strategyHomePath(): string {
  return FUNNEL_ROUTE;
}
