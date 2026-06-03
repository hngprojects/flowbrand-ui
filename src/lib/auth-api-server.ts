import axios from "axios";
import { cookies } from "next/headers";
import {
  authApiUrl,
  buildBackendAuthCookieHeader,
  readSetCookieHeaders,
} from "@/lib/auth-api";
import { isLocalHttpApp } from "@/lib/auth-cookies";
import { inDevEnvironment } from "@/lib/utils";

const REFRESH_TOKEN_TIMEOUT_MS = 15_000;

type CookieStore = Awaited<ReturnType<typeof cookies>>;

function localHttpCookieOptions(
  options: Parameters<CookieStore["set"]>[2],
): Parameters<CookieStore["set"]>[2] {
  if (!isLocalHttpApp()) return options;
  return { ...options, secure: false, sameSite: "lax" };
}

/** Apply backend Set-Cookie headers to the current response (refresh-token rotation). */
function applyRotatedRefreshCookies(
  cookieStore: CookieStore,
  setCookieHeaders: string[],
): void {
  for (const header of setCookieHeaders) {
    const segments = header.split(";").map((part) => part.trim());
    const nameValue = segments[0];
    if (!nameValue) continue;

    const eqIndex = nameValue.indexOf("=");
    if (eqIndex <= 0) continue;

    const name = nameValue.slice(0, eqIndex).trim();
    const value = nameValue.slice(eqIndex + 1).trim();

    const options: Parameters<CookieStore["set"]>[2] = {};

    for (const attr of segments.slice(1)) {
      const attrEq = attr.indexOf("=");
      const key = (attrEq === -1 ? attr : attr.slice(0, attrEq))
        .trim()
        .toLowerCase();
      const val = attrEq === -1 ? "" : attr.slice(attrEq + 1).trim();

      switch (key) {
        case "httponly":
          options.httpOnly = true;
          break;
        case "secure":
          options.secure = true;
          break;
        case "path":
          options.path = val;
          break;
        case "max-age": {
          const maxAge = Number.parseInt(val, 10);
          if (Number.isFinite(maxAge)) options.maxAge = maxAge;
          break;
        }
        case "samesite": {
          const normalized = val.toLowerCase();
          if (
            normalized === "lax" ||
            normalized === "strict" ||
            normalized === "none"
          ) {
            options.sameSite = normalized;
          }
          break;
        }
        case "expires": {
          const expires = new Date(val);
          if (!Number.isNaN(expires.getTime())) options.expires = expires;
          break;
        }
        default:
          break;
      }
    }

    cookieStore.set(name, value, localHttpCookieOptions(options));
  }
}

/** Server-only: refresh access token using HttpOnly cookies from the request. */
export async function refreshAccessToken(baseUrl: string): Promise<{
  access_token: string;
} | null> {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    const authCookies = buildBackendAuthCookieHeader(allCookies);
    const cookieHeader =
      authCookies ||
      allCookies.map((entry) => `${entry.name}=${entry.value}`).join("; ");

    const response = await axios.post(
      authApiUrl(baseUrl, "/refresh-token"),
      {},
      {
        withCredentials: true,
        timeout: REFRESH_TOKEN_TIMEOUT_MS,
        headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
      },
    );

    const setCookieHeaders = readSetCookieHeaders(response.headers);
    if (setCookieHeaders.length > 0) {
      applyRotatedRefreshCookies(cookieStore, setCookieHeaders);
    }

    const body =
      response.data &&
      typeof response.data === "object" &&
      "data" in response.data
        ? (response.data.data as Record<string, unknown>)
        : null;

    const accessToken =
      typeof body?.accessToken === "string"
        ? body.accessToken
        : typeof body?.access_token === "string"
          ? body.access_token
          : null;

    if (!accessToken) {
      if (inDevEnvironment) {
        console.warn("[auth] refreshAccessToken: missing access token in body");
      }
      return null;
    }

    return {
      access_token: accessToken,
    };
  } catch (error) {
    if (inDevEnvironment) {
      console.warn("[auth] refreshAccessToken failed", error);
    }
    return null;
  }
}
