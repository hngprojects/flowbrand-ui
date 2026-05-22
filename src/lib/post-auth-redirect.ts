import {
  FUNNEL_ROUTE,
  mapApiRedirectToAppPath,
  ONBOARDING_UPLOAD_ROUTE,
} from "@/routes";
import type { AuthMeProfile } from "@/lib/auth-api";
import { isOnboardingComplete } from "@/lib/new-strategy";

export { isOnboardingComplete };

/** Decide where to send the user after login/register based on profile flags. */
export function resolvePostAuthPath(
  me: AuthMeProfile | null,
  apiRedirectUrl?: string,
): string {
  const fromApi = mapApiRedirectToAppPath(apiRedirectUrl);
  if (fromApi) {
    return fromApi;
  }

  if (isOnboardingComplete(me)) {
    return FUNNEL_ROUTE;
  }

  return ONBOARDING_UPLOAD_ROUTE;
}
