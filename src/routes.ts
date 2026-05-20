export const DASHBOARD_ROUTE = "/dashboard";
/** Used when onboarding/funnel land on this branch (routes added in follow-up PRs). */
export const ONBOARDING_ROUTE = "/onboarding";
export const FUNNEL_ROUTE = "/funnel";

/** Default after auth on feat/auth-flow until onboarding ships on this branch. */
export const DEFAULT_LOGIN_REDIRECT = DASHBOARD_ROUTE;

export const authRoutes = [
  "/login",
  "/register",
  "/register/verify",
  "/forgot-password",
  "/reset-password",
] as const;

export const protectedRoutes = [DASHBOARD_ROUTE] as const;

/** Map backend redirectUrl paths to in-app routes. */
export function mapApiRedirectToAppPath(redirectUrl?: string): string | null {
  if (!redirectUrl?.trim()) {
    return null;
  }

  const path = redirectUrl.trim();

  if (path === "/funnel" || path.startsWith("/funnel/")) {
    return FUNNEL_ROUTE;
  }
  if (path === "/onboarding" || path.startsWith("/onboarding/")) {
    return ONBOARDING_ROUTE;
  }
  if (path === "/dashboard" || path.startsWith("/dashboard/")) {
    return DASHBOARD_ROUTE;
  }

  if (path.startsWith("/")) {
    return path;
  }

  return null;
}
