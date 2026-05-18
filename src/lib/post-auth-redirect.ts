import {
  DASHBOARD_ROUTE,
  mapApiRedirectToAppPath,
  ONBOARDING_ROUTE,
  FUNNEL_ROUTE,
} from "@/routes";
import type { AuthMeProfile } from "@/lib/auth-api";

function resolvePathForBranch(path: string): string {
  if (path === ONBOARDING_ROUTE || path === FUNNEL_ROUTE) {
    return DASHBOARD_ROUTE;
  }
  return path;
}

/** Decide where to send the user after login/register based on profile flags. */
export function resolvePostAuthPath(
  me: AuthMeProfile | null,
  apiRedirectUrl?: string,
): string {
  const fromApi = mapApiRedirectToAppPath(apiRedirectUrl);
  if (fromApi) {
    return resolvePathForBranch(fromApi);
  }

  if (me?.has_strategy || me?.onboarding_completed) {
    return DASHBOARD_ROUTE;
  }

  return DASHBOARD_ROUTE;
}
