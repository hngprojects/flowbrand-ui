export const ONBOARDING_ROUTE = "/onboarding";
export const FUNNEL_ROUTE = "/funnel";
export const DASHBOARD_ROUTE = "/dashboard";

/** Default when API does not specify a redirect (new users → onboarding). */
export const DEFAULT_LOGIN_REDIRECT = ONBOARDING_ROUTE;

export const authRoutes = [
  "/login",
  "/register",
  "/register/verify",
  "/forgot-password",
  "/reset-password",
] as const;

export const protectedRoutes = [
  DASHBOARD_ROUTE,
  ONBOARDING_ROUTE,
  FUNNEL_ROUTE,
] as const;

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
    return ONBOARDING_ROUTE;
  }

  if (path.startsWith("/")) {
    return path;
  }

  return null;
}
