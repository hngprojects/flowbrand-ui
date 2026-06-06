import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { NextResponse } from "next/server";
import { isLocalHttpApp } from "@/lib/auth-cookies";

export const ADMIN_ACCESS_TOKEN_COOKIE = "adminAccessToken";

const ACCESS_TOKEN_MAX_AGE_SECONDS = 60 * 14;

function accessTokenCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" && !isLocalHttpApp(),
    sameSite: "lax" as const,
    path: "/",
    maxAge: ACCESS_TOKEN_MAX_AGE_SECONDS,
  };
}

export function setAdminAccessTokenCookie(
  response: NextResponse,
  accessToken: string,
): void {
  response.cookies.set(
    ADMIN_ACCESS_TOKEN_COOKIE,
    accessToken,
    accessTokenCookieOptions(),
  );
}

export function clearAdminAccessTokenCookie(response: NextResponse): void {
  response.cookies.delete(ADMIN_ACCESS_TOKEN_COOKIE);
}

export function readAdminAccessTokenCookie(
  cookieStore: Pick<ReadonlyRequestCookies, "get">,
): string | undefined {
  const value = cookieStore.get(ADMIN_ACCESS_TOKEN_COOKIE)?.value?.trim();
  return value || undefined;
}
