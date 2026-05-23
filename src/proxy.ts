import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { resolveDashboardEntryPathWithToken } from "@/lib/dashboard-entry";
import {
  authRoutes,
  STRATEGY_ROUTE,
  ONBOARDING_ROUTE,
  ONBOARDING_UPLOAD_ROUTE,
  protectedRoutes,
} from "@/routes";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

function isProtectedPath(pathname: string): boolean {
  return protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export const proxy = auth(async (request) => {
  const { nextUrl } = request;
  const isLoggedIn = !!request.auth?.user?.id && request.auth.invalid !== true;
  const pathname = nextUrl.pathname;

  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isProtectedPath(pathname) && !isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && isLoggedIn) {
    const accessToken = request.auth?.access_token;
    let redirectPath = ONBOARDING_UPLOAD_ROUTE;

    if (typeof accessToken === "string") {
      redirectPath = await resolveDashboardEntryPathWithToken(accessToken);
    }

    return NextResponse.redirect(new URL(redirectPath, nextUrl.origin));
  }

  const isOnboardingPath =
    pathname === ONBOARDING_ROUTE ||
    pathname.startsWith(`${ONBOARDING_ROUTE}/`);

  if (isLoggedIn && isOnboardingPath) {
    const isNewStrategy = nextUrl.searchParams.get("newStrategy") === "1";
    const accessToken = request.auth?.access_token;

    if (!isNewStrategy && typeof accessToken === "string") {
      const entryPath = await resolveDashboardEntryPathWithToken(accessToken);
      if (entryPath === STRATEGY_ROUTE) {
        return NextResponse.redirect(new URL(STRATEGY_ROUTE, nextUrl.origin));
      }
    }
  }

  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-id", requestId);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  response.headers.set("x-request-id", requestId);

  return response;
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|ttf|eot)$).*)",
  ],
};
