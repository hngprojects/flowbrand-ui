"use server";

import axios from "axios";
import { auth } from "@/auth";
import { envConfig } from "@/config/env.config";
import { formatAuthApiError } from "@/lib/auth-api";
import { flowLog, flowLogApiResult } from "@/lib/flow-debug-log";
import { countryCodeToApiLabel } from "@/lib/countries";
import { normalizeAvatarStorageUrl } from "@/lib/user-avatar";
import type {
  NotificationPreferences,
  UpdateNotificationPreferencesInput,
} from "@/schema/notification.schema";

export type UserProfile = {
  id: string;
  fullName: string;
  email: string;
  country: string;
  avatarUrl: string | null;
  authProvider: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ChangePasswordInput = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type UserActionResult<T = unknown> =
  | { ok: true; status: number; data: T }
  | { ok: false; error: string; status?: number };

function userApiUrl(path: string): string {
  const base = envConfig.BASEURL?.trim().replace(/\/$/, "");
  if (!base) throw new Error("BASE_URL is not set.");
  return `${base}/api/users${path}`;
}

function readProfileRecord(body: unknown): Record<string, unknown> | null {
  if (!body || typeof body !== "object") return null;
  const root = body as Record<string, unknown>;
  const data = root.data;
  if (data && typeof data === "object") {
    const dataRecord = data as Record<string, unknown>;
    const nestedUser = dataRecord.user;
    if (nestedUser && typeof nestedUser === "object") {
      return nestedUser as Record<string, unknown>;
    }
    return dataRecord;
  }
  return root;
}

function parseUserProfileFromApi(body: unknown): UserProfile | null {
  const data = readProfileRecord(body);
  if (!data?.id) return null;

  const rawAvatar = data.avatarUrl ?? data.avatar_url;

  return {
    id: String(data.id),
    fullName: String(data.fullName ?? data.full_name ?? ""),
    email: String(data.email ?? ""),
    country: String(data.country ?? ""),
    avatarUrl: normalizeAvatarStorageUrl(
      typeof rawAvatar === "string" ? rawAvatar : null,
      envConfig.BASEURL,
    ),
    authProvider: String(data.authProvider ?? data.auth_provider ?? ""),
    isVerified: Boolean(data.isVerified ?? data.is_verified),
    createdAt: String(data.createdAt ?? data.created_at ?? ""),
    updatedAt: String(data.updatedAt ?? data.updated_at ?? ""),
  };
}

function parseAvatarUrlFromResponse(body: unknown): string | null {
  const data = readProfileRecord(body);
  if (!data) return null;

  const url = data.avatarUrl ?? data.avatar_url;
  return normalizeAvatarStorageUrl(
    typeof url === "string" ? url : null,
    envConfig.BASEURL,
  );
}

async function getAccessToken(): Promise<string | null> {
  try {
    const session = await auth();
    const token = session?.access_token;
    const valid =
      session?.user?.id &&
      session.invalid !== true &&
      typeof token === "string";
    return valid ? token : null;
  } catch {
    return null;
  }
}

export async function getUserProfile(): Promise<UserActionResult<UserProfile>> {
  flowLog("auth", "GET /api/users/me → request");

  const token = await getAccessToken();
  if (!token) {
    return {
      ok: false,
      error: "Session expired. Please sign in again.",
      status: 401,
    };
  }

  try {
    const res = await axios.get(userApiUrl("/me"), {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 30_000,
    });

    const profile = parseUserProfileFromApi(res.data);
    if (!profile) {
      return { ok: false, error: "Could not read profile data.", status: 502 };
    }

    const result = { ok: true as const, status: res.status, data: profile };
    flowLogApiResult("auth", "GET /api/users/me", result);
    return result;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      const result = {
        ok: false as const,
        error: formatAuthApiError(status, data, "Could not load your profile."),
        status,
      };
      flowLogApiResult("auth", "GET /api/users/me", result);
      return result;
    }
    return { ok: false, error: "Could not reach the server." };
  }
}

export type UpdateProfileInput = {
  fullName?: string;
  country?: string;
};

export async function updateUserProfile(
  input: UpdateProfileInput,
): Promise<UserActionResult<UserProfile>> {
  flowLog("auth", "PATCH /api/users/me → request", { input });

  const token = await getAccessToken();
  if (!token) {
    return {
      ok: false,
      error: "Session expired. Please sign in again.",
      status: 401,
    };
  }

  try {
    const payload: UpdateProfileInput = { ...input };
    if (payload.country) {
      const apiCountry =
        countryCodeToApiLabel(payload.country) ?? payload.country;
      payload.country = apiCountry;
    }

    const res = await axios.patch(userApiUrl("/me"), payload, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 30_000,
    });

    const profile = parseUserProfileFromApi(res.data);
    if (!profile) {
      return {
        ok: false,
        error: "Could not read updated profile.",
        status: 502,
      };
    }

    const result = { ok: true as const, status: res.status, data: profile };
    flowLogApiResult("auth", "PATCH /api/users/me", result);
    return result;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;

      const result = {
        ok: false as const,
        error: formatAuthApiError(
          status,
          data,
          "Could not update your profile. Please check your inputs.",
        ),
        status,
      };
      flowLogApiResult("auth", "PATCH /api/users/me", result);
      return result;
    }
    return { ok: false, error: "Could not reach the server." };
  }
}

export async function changeUserPassword(
  input: ChangePasswordInput,
): Promise<UserActionResult<null>> {
  flowLog("auth", "PATCH /api/users/me/password → request");

  const token = await getAccessToken();
  if (!token) {
    return {
      ok: false,
      error: "Session expired. Please sign in again.",
      status: 401,
    };
  }

  try {
    const res = await axios.patch(userApiUrl("/me/password"), input, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 30_000,
    });

    const result = { ok: true as const, status: res.status, data: null };
    flowLogApiResult("auth", "PATCH /api/users/me/password", result);
    return result;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;

      const result = {
        ok: false as const,
        error: formatAuthApiError(
          status,
          data,
          status === 401
            ? "Current password is incorrect."
            : "Could not change password. Please check your inputs.",
        ),
        status,
      };
      flowLogApiResult("auth", "PATCH /api/users/me/password", result);
      return result;
    }
    return { ok: false, error: "Could not reach the server." };
  }
}

export async function uploadUserAvatar(
  file: File,
): Promise<UserActionResult<{ avatarUrl: string }>> {
  flowLog("auth", "POST /api/users/me/avatar → request");

  const token = await getAccessToken();
  if (!token) {
    return {
      ok: false,
      error: "Session expired. Please sign in again.",
      status: 401,
    };
  }

  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await axios.post(userApiUrl("/me/avatar"), formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 30_000,
    });
    flowLog("auth", "POST /api/users/me/avatar → raw response", {
      data: res.data,
    });
    const avatarUrl = parseAvatarUrlFromResponse(res.data);
    if (!avatarUrl) {
      return { ok: false, error: "Could not read avatar URL.", status: 502 };
    }

    const result = {
      ok: true as const,
      status: res.status,
      data: { avatarUrl },
    };
    console.log("avatar upload result:", JSON.stringify(result));
    flowLogApiResult("auth", "POST /api/users/me/avatar", result);
    return result;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      const result = {
        ok: false as const,
        error: formatAuthApiError(
          status,
          data,
          status === 422
            ? "Invalid image. Please upload a JPEG, PNG, or WebP under 2MB."
            : "Could not upload avatar. Please try again.",
        ),
        status,
      };
      flowLogApiResult("auth", "POST /api/users/me/avatar", result);
      return result;
    }
    return { ok: false, error: "Could not reach the server." };
  }
}

export async function deleteUserAccount(): Promise<UserActionResult<null>> {
  flowLog("auth", "DELETE /api/users/me → request");

  const token = await getAccessToken();
  if (!token) {
    return {
      ok: false,
      error: "Session expired. Please sign in again.",
      status: 401,
    };
  }

  try {
    const res = await axios.delete(userApiUrl("/me"), {
      headers: { Authorization: `Bearer ${token}` },
      data: { confirmation: "DELETE" },
      timeout: 30_000,
    });

    const result = { ok: true as const, status: res.status, data: null };
    flowLogApiResult("auth", "DELETE /api/users/me", result);
    return result;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      const result = {
        ok: false as const,
        error: formatAuthApiError(
          status,
          data,
          "Could not delete account. Please try again.",
        ),
        status,
      };
      flowLogApiResult("auth", "DELETE /api/users/me", result);
      return result;
    }
    return { ok: false, error: "Could not reach the server." };
  }
}

export async function getNotificationPreferences(): Promise<
  UserActionResult<NotificationPreferences>
> {
  flowLog("auth", "GET /api/users/me/notification-preferences → request");

  const token = await getAccessToken();
  if (!token) {
    return {
      ok: false,
      error: "Session expired. Please sign in again.",
      status: 401,
    };
  }

  try {
    const res = await axios.get(userApiUrl("/me/notification-preferences"), {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 30_000,
    });

    const data = res.data?.data as NotificationPreferences;
    if (!data?.id) {
      return {
        ok: false,
        error: "Could not read notification preferences.",
        status: 502,
      };
    }
    const result = { ok: true as const, status: res.status, data };
    flowLogApiResult(
      "auth",
      "GET /api/users/me/notification-preferences",
      result,
    );
    return result;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      return {
        ok: false,
        error: formatAuthApiError(
          status,
          data,
          "Could not load notification preferences.",
        ),
        status,
      };
    }
    return { ok: false, error: "Could not reach the server." };
  }
}

export async function updateNotificationPreferences(
  input: UpdateNotificationPreferencesInput,
): Promise<UserActionResult<null>> {
  flowLog("auth", "PATCH /api/users/me/notification-preferences → request", {
    input,
  });

  const token = await getAccessToken();
  if (!token) {
    return {
      ok: false,
      error: "Session expired. Please sign in again.",
      status: 401,
    };
  }

  try {
    const res = await axios.patch(
      userApiUrl("/me/notification-preferences"),
      input,
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 30_000,
      },
    );

    const result = { ok: true as const, status: res.status, data: null };
    flowLogApiResult(
      "auth",
      "PATCH /api/users/me/notification-preferences",
      result,
    );
    return result;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      return {
        ok: false,
        error: formatAuthApiError(
          status,
          data,
          "Could not update notification preferences.",
        ),
        status,
      };
    }
    return { ok: false, error: "Could not reach the server." };
  }
}
