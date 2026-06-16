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
const REFRESH_RATE_LIMIT_DEFAULT_BACKOFF_MS = 30_000;
const REFRESH_RATE_LIMIT_MAX_BACKOFF_MS = 5 * 60_000;

type CookieStore = Awaited<ReturnType<typeof cookies>>;

export type RefreshResult =
  | { ok: true; access_token: string }
  | {
      ok: false;
      reason: "no_token" | "rate_limited" | "unauthorized" | "error";
    };

/**
 * Process-wide back-off after the backend rate-limits (429) the refresh-token
 * endpoint. Every protected request runs `auth()` (proxy/middleware, server
 * actions, session polling), so once an access token expires they would all
 * race to refresh and amplify a 429 storm. This timestamp suppresses further
 * attempts until the rate-limit window clears.
 */
let refreshRateLimitedUntil = 0;

/** Parse a `Retry-After` header (delta-seconds or HTTP date) into milliseconds. */
function parseRetryAfterMs(retryAfter: unknown): number {
  if (typeof retryAfter === "string" && retryAfter.trim()) {
    const value = retryAfter.trim();
    const asSeconds = Number(value);
    if (Number.isFinite(asSeconds) && asSeconds >= 0) {
      return Math.min(asSeconds * 1000, REFRESH_RATE_LIMIT_MAX_BACKOFF_MS);
    }
    const deltaMs = new Date(value).getTime() - Date.now();
    if (Number.isFinite(deltaMs) && deltaMs > 0) {
      return Math.min(deltaMs, REFRESH_RATE_LIMIT_MAX_BACKOFF_MS);
    }
  }
  return REFRESH_RATE_LIMIT_DEFAULT_BACKOFF_MS;
}

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
export async function refreshAccessToken(
  baseUrl: string,
): Promise<RefreshResult> {
  // Respect an active back-off window from a previous 429 instead of hammering
  // the rate-limited endpoint on every concurrent request.
  const now = Date.now();
  if (now < refreshRateLimitedUntil) {
    if (inDevEnvironment) {
      console.warn(
        `[auth] refreshAccessToken: skipping — backing off ${Math.ceil(
          (refreshRateLimitedUntil - now) / 1000,
        )}s after a 429`,
      );
    }
    return { ok: false, reason: "rate_limited" };
  }

  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    const hasRefreshToken = allCookies.some(
      (entry) => entry.name === "refreshToken" && entry.value.trim().length > 0,
    );
    if (!hasRefreshToken) {
      return { ok: false, reason: "no_token" };
    }

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

    // Success — clear any previous back-off.
    refreshRateLimitedUntil = 0;

    const setCookieHeaders = readSetCookieHeaders(response.headers);
    if (setCookieHeaders.length > 0) {
      try {
        applyRotatedRefreshCookies(cookieStore, setCookieHeaders);
      } catch (cookieError) {
        // Cookies are read-only outside Server Actions / Route Handlers
        // (e.g. during an RSC render or in the proxy/middleware). Don't throw
        // away a valid refreshed access token just because we couldn't persist
        // the rotated refresh cookie here.
        if (inDevEnvironment) {
          console.warn(
            "[auth] refreshAccessToken: could not persist rotated refresh cookie in this context",
            cookieError,
          );
        }
      }
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
      return { ok: false, reason: "error" };
    }

    return { ok: true, access_token: accessToken };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;

      if (status === 429) {
        const backoffMs = parseRetryAfterMs(
          error.response.headers?.["retry-after"],
        );
        refreshRateLimitedUntil = Date.now() + backoffMs;
        if (inDevEnvironment) {
          console.warn(
            `[auth] refreshAccessToken: rate limited (429) — backing off ${Math.ceil(
              backoffMs / 1000,
            )}s`,
          );
        }
        return { ok: false, reason: "rate_limited" };
      }

      // The refresh token itself was rejected — the user must sign in again.
      if (status === 401 || status === 403) {
        return { ok: false, reason: "unauthorized" };
      }
    }

    if (inDevEnvironment) {
      console.warn("[auth] refreshAccessToken failed", error);
    }
    return { ok: false, reason: "error" };
  }
}
