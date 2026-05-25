export const DASHBOARD_ROUTE = "/dashboard";
export const ONBOARDING_ROUTE = "/dashboard/onboarding";
export const ONBOARDING_UPLOAD_ROUTE = "/dashboard/onboarding/upload";
export const ONBOARDING_QUESTIONS_ROUTE = "/dashboard/onboarding/questions";
export const STRATEGY_ROUTE = "/dashboard/strategy";

/** Default when API does not specify a redirect (new users → upload). */
export const DEFAULT_LOGIN_REDIRECT = ONBOARDING_UPLOAD_ROUTE;

export const GOOGLE_OAUTH_CALLBACK_ROUTE = "/onboarding";
// export const GOOGLE_OAUTH_CALLBACK_ROUTE = "/api/oauth/google/callback";

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

  if (
    path === "/funnel" ||
    path.startsWith("/funnel/") ||
    path === "/strategy" ||
    path.startsWith("/strategy/") ||
    path === "funnel_generation" ||
    path === "strategy_dashboard"
  ) {
    return STRATEGY_ROUTE;
  }
  if (path === "/onboarding" || path.startsWith("/onboarding/")) {
    return ONBOARDING_UPLOAD_ROUTE;
  }
  if (path === DASHBOARD_ROUTE) {
    return null;
  }
  if (path.startsWith(`${DASHBOARD_ROUTE}/`)) {
    return path;
  }

  if (path.startsWith("/")) {
    return path;
  }

  return null;
}
