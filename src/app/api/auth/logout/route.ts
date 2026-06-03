import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { envConfig } from "@/config/env.config";
import { logoutWithCookieForward } from "@/lib/auth-api";

function applySetCookieHeaders(response: NextResponse, headers: string[]) {
  for (const header of headers) {
    response.headers.append("Set-Cookie", header);
  }
}

/** Proxies backend logout so the refresh-token httpOnly cookie is revoked/cleared. */
export async function POST() {
  const session = await auth();
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((entry) => `${entry.name}=${entry.value}`)
    .join("; ");

  const result = await logoutWithCookieForward(envConfig.BASEURL, {
    accessToken: session?.access_token,
    cookieHeader: cookieHeader || undefined,
  });

  const response = NextResponse.json({ ok: result.ok });
  applySetCookieHeaders(response, result.setCookieHeaders);
  return response;
}
