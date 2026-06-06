import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { envConfig } from "@/config/env.config";
import { adminApiUrl, readSetCookieHeaders } from "@/lib/admin-api";
import { readAdminAccessTokenCookie } from "@/lib/admin-auth-cookies";
import { buildBackendAuthCookieHeader } from "@/lib/auth-api";
import { appendAuthSetCookieHeaders } from "@/lib/auth-cookies";

/** Proxies an authenticated admin request to the backend API. */
export async function proxyAdminBackend(
  request: Request,
  backendPath: string,
  options?: { method?: string; body?: unknown },
) {
  const method = options?.method ?? request.method;
  const cookieStore = await cookies();
  const cookieHeader = buildBackendAuthCookieHeader(cookieStore.getAll());
  const accessToken = readAdminAccessTokenCookie(cookieStore);

  let body = options?.body;
  if (body === undefined && method !== "GET" && method !== "HEAD") {
    try {
      body = await request.json();
    } catch {
      body = undefined;
    }
  }

  const headers: Record<string, string> = {};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  if (cookieHeader) headers.Cookie = cookieHeader;

  const url = new URL(request.url);
  const params =
    method === "GET" || method === "HEAD"
      ? Object.fromEntries(url.searchParams.entries())
      : undefined;

  try {
    const response = await axios({
      method,
      url: adminApiUrl(envConfig.BASEURL, backendPath),
      headers,
      data: body,
      params,
      validateStatus: () => true,
      withCredentials: true,
      timeout: 15_000,
    });

    const nextRes = NextResponse.json(response.data, {
      status: response.status,
    });
    appendAuthSetCookieHeaders(nextRes, readSetCookieHeaders(response.headers));
    return nextRes;
  } catch {
    return NextResponse.json(
      { message: "Could not reach the server." },
      { status: 502 },
    );
  }
}
