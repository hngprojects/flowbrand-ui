import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { fetchAuthMe } from "@/lib/auth-api";
import { resolvePostAuthPath } from "@/lib/post-auth-redirect";
import { envConfig } from "@/config/env.config";
import { authRoutes, ONBOARDING_UPLOAD_ROUTE, protectedRoutes } from "@/routes";

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
      const me = await fetchAuthMe(envConfig.BASEURL, accessToken);
      redirectPath = resolvePostAuthPath(me);
    }

    return NextResponse.redirect(new URL(redirectPath, nextUrl.origin));
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
