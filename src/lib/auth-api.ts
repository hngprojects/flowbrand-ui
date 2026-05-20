import axios from "axios";
import type { User } from "@/types/auth";

export const AUTH_API_PREFIX = "/api/auth";

export function authApiUrl(baseUrl: string, path: string): string {
  const base = baseUrl.replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${AUTH_API_PREFIX}${suffix}`;
}

export type ApiAuthUser = {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string | null;
  is_verified?: boolean;
  onboarding_completed?: boolean;
  has_strategy?: boolean;
};

export type AuthMeProfile = ApiAuthUser;

export function mapApiUser(user: ApiAuthUser): User {
  const fullName = user.full_name?.trim() ?? "";
  const spaceIndex = fullName.indexOf(" ");

  return {
    id: user.id,
    email: user.email,
    avatar_url: user.avatar_url ?? undefined,
    fullname: fullName,
    first_name: spaceIndex === -1 ? fullName : fullName.slice(0, spaceIndex),
    last_name: spaceIndex === -1 ? "" : fullName.slice(spaceIndex + 1).trim(),
  };
}

/** OTP resend/send cooldown from API (`retryAfter`, `cooldown`, etc.). */
export function readOtpCooldownSeconds(data: unknown): number | undefined {
  if (!data || typeof data !== "object") {
    return undefined;
  }

  const record = data as Record<string, unknown>;
  const nested =
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : null;

  const candidates = [record, nested].filter(Boolean) as Record<
    string,
    unknown
  >[];

  for (const source of candidates) {
    for (const key of [
      "retryAfter",
      "retry_after",
      "cooldown",
      "cooldownSeconds",
      "cooldown_seconds",
    ]) {
      const value = source[key];
      if (typeof value === "number" && Number.isFinite(value) && value > 0) {
        return Math.ceil(value);
      }
    }
  }

  return undefined;
}

export function messageFromApiBody(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") {
    return fallback;
  }

  const record = data as Record<string, unknown>;
  const message = record.message;

  if (Array.isArray(message)) {
    const parts = message
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter((item) => item.length > 0);
    if (parts.length > 0) {
      return parts.join(" ");
    }
  }

  if (typeof message === "string") {
    const text = message.trim();
    if (text.length > 0) {
      return text;
    }
  }

  if (typeof record.error === "string" && record.error.trim().length > 0) {
    return record.error.trim();
  }

  return fallback;
}

/** User-facing error from an API failure (status + Nest-style body). */
export function formatAuthApiError(
  status: number | undefined,
  data: unknown,
  fallback: string,
): string {
  const apiMessage = messageFromApiBody(data, "");

  if (status === 500) {
    return apiMessage && apiMessage !== "Internal server error"
      ? `${apiMessage} Please try again later.`
      : "Something went wrong on our side. Please try again later.";
  }

  if (status === 409) {
    return apiMessage || "An account with this email already exists.";
  }

  if (status === 400 || status === 422) {
    return apiMessage || "Please check your details and try again.";
  }

  if (apiMessage.length > 0) {
    return apiMessage;
  }

  return fallback;
}

function readUserRecord(raw: unknown): Record<string, unknown> | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }
  return raw as Record<string, unknown>;
}

function readFullName(userRecord: Record<string, unknown>): string {
  if (typeof userRecord.full_name === "string") {
    return userRecord.full_name;
  }
  if (typeof userRecord.fullName === "string") {
    return userRecord.fullName;
  }
  return "";
}

export function parseLoginEnvelope(
  body: unknown,
): { user: User; access_token: string; redirect_url?: string } | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const record = body as Record<string, unknown>;
  const data =
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : record;

  const rawUser = data.user;
  const userRecord = readUserRecord(rawUser);
  if (!userRecord) {
    return null;
  }

  const id =
    userRecord.id != null && String(userRecord.id).length > 0
      ? String(userRecord.id)
      : undefined;
  const email =
    typeof userRecord.email === "string" ? userRecord.email : undefined;
  const full_name = readFullName(userRecord);

  const access_token =
    typeof data.access_token === "string"
      ? data.access_token
      : typeof data.accessToken === "string"
        ? data.accessToken
        : undefined;

  const redirect_url =
    typeof data.redirectUrl === "string"
      ? data.redirectUrl
      : typeof data.redirect_url === "string"
        ? data.redirect_url
        : undefined;

  if (!id || !access_token || !email) {
    return null;
  }

  return {
    user: mapApiUser({
      id,
      email,
      full_name,
      avatar_url:
        typeof userRecord.avatar_url === "string"
          ? userRecord.avatar_url
          : null,
    }),
    access_token,
    redirect_url,
  };
}

function readBoolean(
  record: Record<string, unknown>,
  ...keys: string[]
): boolean | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "boolean") {
      return value;
    }
  }
  return undefined;
}

export function parseMeEnvelope(body: unknown): AuthMeProfile | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const record = body as Record<string, unknown>;
  const data =
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : record;

  const userRecord = readUserRecord(data.user ?? data);
  if (!userRecord) {
    return null;
  }

  const id =
    userRecord.id != null && String(userRecord.id).length > 0
      ? String(userRecord.id)
      : undefined;
  const email =
    typeof userRecord.email === "string" ? userRecord.email : undefined;

  if (!id || !email) {
    return null;
  }

  return {
    id,
    email,
    full_name: readFullName(userRecord),
    avatar_url:
      typeof userRecord.avatar_url === "string" ? userRecord.avatar_url : null,
    onboarding_completed:
      readBoolean(data, "onboardingCompleted", "onboarding_completed") ??
      readBoolean(userRecord, "onboardingCompleted", "onboarding_completed"),
    has_strategy:
      readBoolean(data, "hasStrategy", "has_strategy") ??
      readBoolean(userRecord, "hasStrategy", "has_strategy"),
  };
}

export async function fetchAuthMe(
  baseUrl: string,
  accessToken: string,
): Promise<AuthMeProfile | null> {
  try {
    const response = await axios.get(authApiUrl(baseUrl, "/me"), {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true,
    });
    return parseMeEnvelope(response.data);
  } catch {
    return null;
  }
}
