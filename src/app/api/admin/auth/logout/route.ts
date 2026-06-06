import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { envConfig } from "@/config/env.config";
import { adminLogoutWithCookieForward } from "@/lib/admin-api";
import {
  clearAdminAccessTokenCookie,
  readAdminAccessTokenCookie,
} from "@/lib/admin-auth-cookies";
import { buildBackendAuthCookieHeader } from "@/lib/auth-api";
import { appendAuthSetCookieHeaders } from "@/lib/auth-cookies";

/** Proxies admin logout so the refreshToken HttpOnly cookie is revoked/cleared. */
export async function POST() {
  const cookieStore = await cookies();
  const cookieHeader = buildBackendAuthCookieHeader(cookieStore.getAll());
  const accessToken = readAdminAccessTokenCookie(cookieStore);

  const result = await adminLogoutWithCookieForward(envConfig.BASEURL, {
    accessToken,
    cookieHeader: cookieHeader || undefined,
  });

  const response = NextResponse.json({ ok: result.ok });
  clearAdminAccessTokenCookie(response);
  appendAuthSetCookieHeaders(response, result.setCookieHeaders);
  return response;
}
