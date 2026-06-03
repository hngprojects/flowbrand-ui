import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { envConfig } from "@/config/env.config";
import {
  buildBackendAuthCookieHeader,
  logoutWithCookieForward,
} from "@/lib/auth-api";
import { appendAuthSetCookieHeaders } from "@/lib/auth-cookies";

/** Proxies backend logout so the refresh-token httpOnly cookie is revoked/cleared. */
export async function POST() {
  const session = await auth();
  const cookieStore = await cookies();
  const cookieHeader = buildBackendAuthCookieHeader(cookieStore.getAll());

  const result = await logoutWithCookieForward(envConfig.BASEURL, {
    accessToken: session?.access_token,
    cookieHeader: cookieHeader || undefined,
  });

  const response = NextResponse.json({ ok: result.ok });
  appendAuthSetCookieHeaders(response, result.setCookieHeaders);
  return response;
}
