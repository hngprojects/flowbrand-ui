import axios, {
  type AxiosResponseHeaders,
  type RawAxiosResponseHeaders,
} from "axios";
import { collectApiRecords } from "@/lib/api-envelope";
import { messageFromApiBody } from "@/lib/auth-api";

export const ADMIN_API_PREFIX = "/api/admin";

export function adminApiUrl(baseUrl: string, path: string): string {
  const base = baseUrl.replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${ADMIN_API_PREFIX}${suffix}`;
}

export function readSetCookieHeaders(
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders,
): string[] {
  const raw = headers["set-cookie"];
  if (!raw) return [];
  return Array.isArray(raw) ? raw : [raw];
}

function readAccessToken(record: Record<string, unknown>): string | undefined {
  const data =
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : record;

  if (typeof data.accessToken === "string" && data.accessToken.trim()) {
    return data.accessToken;
  }
  if (typeof data.access_token === "string" && data.access_token.trim()) {
    return data.access_token;
  }
  if (typeof record.accessToken === "string" && record.accessToken.trim()) {
    return record.accessToken;
  }
  if (typeof record.access_token === "string" && record.access_token.trim()) {
    return record.access_token;
  }

  return undefined;
}

export function parseAdminLoginEnvelope(body: unknown): string | null {
  for (const record of collectApiRecords(body)) {
    const token = readAccessToken(record);
    if (token) return token;
  }
  return null;
}

/** Admin login proxy — forwards refreshToken HttpOnly cookie to the browser. */
export async function adminLoginWithCookieForward(
  baseUrl: string,
  body: { email: string; password: string },
): Promise<
  | { ok: true; access_token: string; setCookieHeaders: string[] }
  | { ok: false; status: number; message: string }
> {
  try {
    const response = await axios.post(
      adminApiUrl(baseUrl, "/auth/login"),
      body,
      { withCredentials: true, timeout: 15_000 },
    );
    const access_token = parseAdminLoginEnvelope(response.data);
    if (!access_token) {
      return {
        ok: false,
        status: 502,
        message:
          "Login succeeded but the server response was invalid. Contact support.",
      };
    }
    return {
      ok: true,
      access_token,
      setCookieHeaders: readSetCookieHeaders(response.headers),
    };
  } catch (error) {
    const status =
      axios.isAxiosError(error) && error.response ? error.response.status : 500;
    const message =
      axios.isAxiosError(error) && error.response
        ? messageFromApiBody(error.response.data, "Invalid email or password.")
        : "Could not reach the server.";
    return { ok: false, status, message };
  }
}

/** Admin logout proxy — revokes session and clears refresh cookie. */
export async function adminLogoutWithCookieForward(
  baseUrl: string,
  options: { accessToken?: string | null; cookieHeader?: string },
): Promise<{ ok: boolean; setCookieHeaders: string[]; status: number }> {
  const headers: Record<string, string> = {};
  const token = options.accessToken?.trim();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const cookieHeader = options.cookieHeader?.trim();
  if (cookieHeader) {
    headers.Cookie = cookieHeader;
  }

  try {
    const response = await axios.post(
      adminApiUrl(baseUrl, "/auth/logout"),
      {},
      {
        withCredentials: true,
        headers: Object.keys(headers).length > 0 ? headers : undefined,
        validateStatus: () => true,
        timeout: 15_000,
      },
    );

    return {
      ok: response.status >= 200 && response.status < 300,
      setCookieHeaders: readSetCookieHeaders(response.headers),
      status: response.status,
    };
  } catch {
    return { ok: false, setCookieHeaders: [], status: 500 };
  }
}

/** Admin refresh proxy — rotates refresh cookie and returns a new access token. */
export async function adminRefreshWithCookieForward(
  baseUrl: string,
  cookieHeader?: string,
): Promise<
  | { ok: true; access_token: string; setCookieHeaders: string[] }
  | { ok: false; status: number; message: string }
> {
  const headers: Record<string, string> = {};
  if (cookieHeader?.trim()) {
    headers.Cookie = cookieHeader;
  }

  try {
    const response = await axios.post(
      adminApiUrl(baseUrl, "/auth/refresh-token"),
      {},
      {
        withCredentials: true,
        headers: Object.keys(headers).length > 0 ? headers : undefined,
        validateStatus: () => true,
        timeout: 15_000,
      },
    );

    if (response.status < 200 || response.status >= 300) {
      return {
        ok: false,
        status: response.status,
        message: messageFromApiBody(
          response.data,
          "Invalid or expired refresh token.",
        ),
      };
    }

    const access_token = parseAdminLoginEnvelope(response.data);
    if (!access_token) {
      return {
        ok: false,
        status: 502,
        message: "Token refresh succeeded but the response was invalid.",
      };
    }

    return {
      ok: true,
      access_token,
      setCookieHeaders: readSetCookieHeaders(response.headers),
    };
  } catch {
    return {
      ok: false,
      status: 500,
      message: "Could not reach the server.",
    };
  }
}
