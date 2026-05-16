import type { User } from "@/types/auth";

export const AUTH_API_PREFIX = "/api/v1/auth";

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
};

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

export function messageFromApiBody(data: unknown, fallback: string): string {
  if (
    data &&
    typeof data === "object" &&
    "message" in data &&
    typeof (data as { message: unknown }).message === "string"
  ) {
    const text = (data as { message: string }).message.trim();
    if (text.length > 0) {
      return text;
    }
  }
  return fallback;
}

export function parseLoginEnvelope(
  body: unknown,
): { user: User; access_token: string } | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const record = body as Record<string, unknown>;
  const data =
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : record;

  const user = data.user as ApiAuthUser | undefined;
  const access_token =
    typeof data.access_token === "string" ? data.access_token : undefined;

  if (!user?.id || !access_token) {
    return null;
  }

  return { user: mapApiUser(user), access_token };
}
