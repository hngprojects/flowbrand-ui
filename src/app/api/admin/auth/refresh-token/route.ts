import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { envConfig } from "@/config/env.config";
import { adminRefreshWithCookieForward } from "@/lib/admin-api";
import { buildBackendAuthCookieHeader } from "@/lib/auth-api";
import { appendAuthSetCookieHeaders } from "@/lib/auth-cookies";

/** Proxies admin token refresh — reads refreshToken cookie and rotates it. */
export async function POST() {
  const cookieStore = await cookies();
  const cookieHeader = buildBackendAuthCookieHeader(cookieStore.getAll());

  const result = await adminRefreshWithCookieForward(
    envConfig.BASEURL,
    cookieHeader || undefined,
  );

  if (!result.ok) {
    return NextResponse.json(
      { message: result.message },
      { status: result.status },
    );
  }

  const response = NextResponse.json({ access_token: result.access_token });
  appendAuthSetCookieHeaders(response, result.setCookieHeaders);
  return response;
}
