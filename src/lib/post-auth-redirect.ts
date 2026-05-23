import type { AuthMeProfile } from "@/lib/auth-api";
import { resolveDashboardEntryPath } from "@/lib/dashboard-entry";

/** Decide where to send the user after login/register (OAuth, etc.). */
export function resolvePostAuthPath(
  me: AuthMeProfile | null,
  apiRedirectUrl?: string,
): string {
  return resolveDashboardEntryPath({ me, apiRedirectUrl });
}
