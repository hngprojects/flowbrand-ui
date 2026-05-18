import {
  FUNNEL_ROUTE,
  mapApiRedirectToAppPath,
  ONBOARDING_ROUTE,
} from "@/routes";
import type { AuthMeProfile } from "@/lib/auth-api";

/** Decide where to send the user after login/register based on profile flags. */
export function resolvePostAuthPath(
  me: AuthMeProfile | null,
  apiRedirectUrl?: string,
): string {
  const fromApi = mapApiRedirectToAppPath(apiRedirectUrl);
  if (fromApi) {
    return fromApi;
  }

  if (me?.has_strategy || me?.onboarding_completed) {
    return FUNNEL_ROUTE;
  }

  return ONBOARDING_ROUTE;
}
