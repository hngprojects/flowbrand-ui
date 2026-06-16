"use server";

import { cookies } from "next/headers";
import { envConfig } from "@/config/env.config";
import { formatAuthApiError } from "@/lib/auth-api";
import { flowLog, flowLogApiResult } from "@/lib/flow-debug-log";
import { CallsWithBearer, Calls } from "@/actions/axios";
import axios from "axios";

export type AdminActionResult<T = unknown> =
  | { ok: true; status: number; data: T }
  | { ok: false; error: string; status?: number };

export type AdminRole = "admin" | "super_admin";

export type AdminProfile = {
  id: string;
  full_name: string;
  email: string;
  country: string;
  avatar_url: string | null;
  role: AdminRole;
  created_at: string;
};

export type AdminSearchResult = {
  type: "user";
  id: string;
  display_name: string;
  email: string;
  status: string;
  plan: string;
};

export type AdminSearchResponse = {
  results: AdminSearchResult[];
  query: string;
  total: number;
};

export type AdminDashboardStats = {
  totalUsers: number;
  activeUsers: number;
  totalFunnelsGenerated: number;
  funnelsThisWeek: number;
};

export type FunnelPerformanceItem = {
  stagePosition: number;
  stageName: string;
  completionRate: number;
};

export type UserSegmentItem = {
  label: string;
  count: number;
  percentage: number;
};

export type WeeklyOverviewItem = {
  date: string;
  newUsers: number;
  funnelsGenerated: number;
};

export type AdminLoginInput = {
  email: string;
  password: string;
};

export type UpdateAdminProfileInput = {
  full_name?: string;
  country?: string;
};

export type ChangeAdminPasswordInput = {
  old_password: string;
  new_password: string;
  confirm_password: string;
};

export type CreateAdminInput = {
  full_name: string;
  email: string;
  password: string;
  role: AdminRole;
};

function adminPath(path: string): string {
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `/api/admin${suffix}`;
}

async function getAdminToken(): Promise<string | null> {
  try {
    const jar = await cookies();
    const token = jar.get("adminAccessToken")?.value?.trim();
    return token ?? null;
  } catch {
    return null;
  }
}

async function setAdminTokenCookie(accessToken: string): Promise<void> {
  const jar = await cookies();
  jar.set("adminAccessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 14,
  });
}

async function clearAdminTokenCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete("adminAccessToken");
}

export async function adminLogin(
  input: AdminLoginInput,
): Promise<AdminActionResult<{ accessToken: string }>> {
  flowLog("auth", "POST /api/admin/auth/login → request", {
    email: input.email,
  });

  try {
    const client = Calls();
    const res = await client.post(adminPath("/auth/login"), {
      email: input.email,
      password: input.password,
    });

    const accessToken = res.data?.data?.accessToken as string | undefined;
    if (!accessToken) {
      return {
        ok: false,
        error: "Login succeeded but no token was returned.",
        status: 502,
      };
    }

    await setAdminTokenCookie(accessToken);

    const result = {
      ok: true as const,
      status: res.status,
      data: { accessToken },
    };
    flowLogApiResult("auth", "POST /api/admin/auth/login", result);
    return result;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      const result = {
        ok: false as const,
        error: formatAuthApiError(
          status,
          data,
          status === 423
            ? "Account temporarily locked. Try again in 1 hour."
            : "Invalid email or password.",
        ),
        status,
      };
      flowLogApiResult("auth", "POST /api/admin/auth/login", result);
      return result;
    }
    return { ok: false, error: "Could not reach the server." };
  }
}

export async function adminLogout(): Promise<AdminActionResult<null>> {
  flowLog("auth", "POST /api/admin/auth/logout → request");

  const token = await getAdminToken();
  await clearAdminTokenCookie();

  if (!token) {
    return { ok: true as const, status: 200, data: null };
  }

  try {
    const client = CallsWithBearer(envConfig.BASEURL, token);
    const res = await client.post(adminPath("/auth/logout"), {});

    const result = { ok: true as const, status: res.status, data: null };
    flowLogApiResult("auth", "POST /api/admin/auth/logout", result);
    return result;
  } catch (error) {
    flowLog(
      "auth",
      "POST /api/admin/auth/logout → backend error (cookie cleared)",
      {
        error: error instanceof Error ? error.message : String(error),
      },
    );
    return { ok: true as const, status: 200, data: null };
  }
}

export async function adminRefreshToken(): Promise<
  AdminActionResult<{ accessToken: string }>
> {
  flowLog("auth", "POST /api/admin/auth/refresh-token → request");

  try {
    const client = Calls();
    const res = await client.post(adminPath("/auth/refresh-token"), {});

    const accessToken = res.data?.data?.accessToken as string | undefined;
    if (!accessToken) {
      return {
        ok: false,
        error: "Token refresh succeeded but no token was returned.",
        status: 502,
      };
    }

    await setAdminTokenCookie(accessToken);

    const result = {
      ok: true as const,
      status: res.status,
      data: { accessToken },
    };
    flowLogApiResult("auth", "POST /api/admin/auth/refresh-token", result);
    return result;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      const result = {
        ok: false as const,
        error: formatAuthApiError(
          status,
          data,
          "Session expired. Please sign in again.",
        ),
        status,
      };
      flowLogApiResult("auth", "POST /api/admin/auth/refresh-token", result);
      return result;
    }
    return { ok: false, error: "Could not reach the server." };
  }
}

export async function getAdminProfile(): Promise<
  AdminActionResult<AdminProfile>
> {
  flowLog("auth", "GET /api/admin/profile → request");

  const token = await getAdminToken();
  if (!token) {
    return {
      ok: false,
      error: "Admin session expired. Please sign in again.",
      status: 401,
    };
  }

  try {
    const client = CallsWithBearer(envConfig.BASEURL, token);
    const res = await client.get(adminPath("/profile"));

    const profile = res.data?.data as AdminProfile | undefined;
    if (!profile?.id) {
      return { ok: false, error: "Could not read profile data.", status: 502 };
    }

    const result = { ok: true as const, status: res.status, data: profile };
    flowLogApiResult("auth", "GET /api/admin/profile", result);
    return result;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      const result = {
        ok: false as const,
        error: formatAuthApiError(
          status,
          data,
          "Could not load admin profile.",
        ),
        status,
      };
      flowLogApiResult("auth", "GET /api/admin/profile", result);
      return result;
    }
    return { ok: false, error: "Could not reach the server." };
  }
}

export async function updateAdminProfile(
  input: UpdateAdminProfileInput,
): Promise<AdminActionResult<AdminProfile>> {
  flowLog("auth", "PATCH /api/admin/profile → request", {
    fields: Object.keys(input),
  });

  const token = await getAdminToken();
  if (!token) {
    return {
      ok: false,
      error: "Admin session expired. Please sign in again.",
      status: 401,
    };
  }

  const body: Record<string, string> = {};
  if (input.full_name !== undefined) body.full_name = input.full_name;
  if (input.country !== undefined) body.country = input.country;

  try {
    const client = CallsWithBearer(envConfig.BASEURL, token);
    const res = await client.patch(adminPath("/profile"), body);

    const profile = res.data?.data as AdminProfile | undefined;
    if (!profile?.id) {
      return {
        ok: false,
        error: "Could not read updated profile.",
        status: 502,
      };
    }

    const result = { ok: true as const, status: res.status, data: profile };
    flowLogApiResult("auth", "PATCH /api/admin/profile", result);
    return result;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      const result = {
        ok: false as const,
        error: formatAuthApiError(
          status,
          data,
          "Could not update admin profile. Please check your inputs.",
        ),
        status,
      };
      flowLogApiResult("auth", "PATCH /api/admin/profile", result);
      return result;
    }
    return { ok: false, error: "Could not reach the server." };
  }
}

export async function changeAdminPassword(
  input: ChangeAdminPasswordInput,
): Promise<AdminActionResult<null>> {
  flowLog("auth", "PATCH /api/admin/profile/password → request");

  const token = await getAdminToken();
  if (!token) {
    return {
      ok: false,
      error: "Admin session expired. Please sign in again.",
      status: 401,
    };
  }

  try {
    const client = CallsWithBearer(envConfig.BASEURL, token);
    const res = await client.patch(adminPath("/profile/password"), input);

    const result = { ok: true as const, status: res.status, data: null };
    flowLogApiResult("auth", "PATCH /api/admin/profile/password", result);
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
      flowLogApiResult("auth", "PATCH /api/admin/profile/password", result);
      return result;
    }
    return { ok: false, error: "Could not reach the server." };
  }
}

export async function adminSearch(
  query: string,
): Promise<AdminActionResult<AdminSearchResponse>> {
  flowLog("auth", "GET /api/admin/search → request", { q: query });

  if (!query || query.trim().length < 2) {
    return {
      ok: false,
      error: "Search query must be at least 2 characters.",
      status: 422,
    };
  }

  const token = await getAdminToken();
  if (!token) {
    return {
      ok: false,
      error: "Admin session expired. Please sign in again.",
      status: 401,
    };
  }

  try {
    const client = CallsWithBearer(envConfig.BASEURL, token);
    const res = await client.get(adminPath("/search"), {
      params: { q: query.trim() },
    });

    const result = {
      ok: true as const,
      status: res.status,
      data: res.data as AdminSearchResponse,
    };
    flowLogApiResult("auth", "GET /api/admin/search", result);
    return result;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      const result = {
        ok: false as const,
        error: formatAuthApiError(
          status,
          data,
          "Search failed. Please try again.",
        ),
        status,
      };
      flowLogApiResult("auth", "GET /api/admin/search", result);
      return result;
    }
    return { ok: false, error: "Could not reach the server." };
  }
}

export async function getAdminDashboardStats(): Promise<
  AdminActionResult<AdminDashboardStats>
> {
  flowLog("auth", "GET /api/admin/dashboard/stats → request");

  const token = await getAdminToken();
  if (!token) {
    return {
      ok: false,
      error: "Admin session expired. Please sign in again.",
      status: 401,
    };
  }

  try {
    const client = CallsWithBearer(envConfig.BASEURL, token);
    const res = await client.get(adminPath("/dashboard/stats"));

    const result = {
      ok: true as const,
      status: res.status,
      data: res.data?.data as AdminDashboardStats,
    };
    flowLogApiResult("auth", "GET /api/admin/dashboard/stats", result);
    return result;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      const result = {
        ok: false as const,
        error: formatAuthApiError(
          status,
          data,
          "Could not load dashboard stats.",
        ),
        status,
      };
      flowLogApiResult("auth", "GET /api/admin/dashboard/stats", result);
      return result;
    }
    return { ok: false, error: "Could not reach the server." };
  }
}

export async function getAdminFunnelPerformance(): Promise<
  AdminActionResult<FunnelPerformanceItem[]>
> {
  flowLog("auth", "GET /api/admin/dashboard/funnel-performance → request");

  const token = await getAdminToken();
  if (!token) {
    return {
      ok: false,
      error: "Admin session expired. Please sign in again.",
      status: 401,
    };
  }

  try {
    const client = CallsWithBearer(envConfig.BASEURL, token);
    const res = await client.get(adminPath("/dashboard/funnel-performance"));

    const result = {
      ok: true as const,
      status: res.status,
      data: res.data?.data as FunnelPerformanceItem[],
    };
    flowLogApiResult(
      "auth",
      "GET /api/admin/dashboard/funnel-performance",
      result,
    );
    return result;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      const result = {
        ok: false as const,
        error: formatAuthApiError(
          status,
          data,
          "Could not load funnel performance data.",
        ),
        status,
      };
      flowLogApiResult(
        "auth",
        "GET /api/admin/dashboard/funnel-performance",
        result,
      );
      return result;
    }
    return { ok: false, error: "Could not reach the server." };
  }
}

export async function getAdminUserSegments(): Promise<
  AdminActionResult<UserSegmentItem[]>
> {
  flowLog("auth", "GET /api/admin/dashboard/user-segments → request");

  const token = await getAdminToken();
  if (!token) {
    return {
      ok: false,
      error: "Admin session expired. Please sign in again.",
      status: 401,
    };
  }

  try {
    const client = CallsWithBearer(envConfig.BASEURL, token);
    const res = await client.get(adminPath("/dashboard/user-segments"));

    const result = {
      ok: true as const,
      status: res.status,
      data: res.data?.data as UserSegmentItem[],
    };
    flowLogApiResult("auth", "GET /api/admin/dashboard/user-segments", result);
    return result;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      const result = {
        ok: false as const,
        error: formatAuthApiError(
          status,
          data,
          "Could not load user segment data.",
        ),
        status,
      };
      flowLogApiResult(
        "auth",
        "GET /api/admin/dashboard/user-segments",
        result,
      );
      return result;
    }
    return { ok: false, error: "Could not reach the server." };
  }
}

export async function getAdminWeeklyOverview(): Promise<
  AdminActionResult<WeeklyOverviewItem[]>
> {
  flowLog("auth", "GET /api/admin/dashboard/weekly-overview → request");

  const token = await getAdminToken();
  if (!token) {
    return {
      ok: false,
      error: "Admin session expired. Please sign in again.",
      status: 401,
    };
  }

  try {
    const client = CallsWithBearer(envConfig.BASEURL, token);
    const res = await client.get(adminPath("/dashboard/weekly-overview"));

    const result = {
      ok: true as const,
      status: res.status,
      data: res.data?.data as WeeklyOverviewItem[],
    };
    flowLogApiResult(
      "auth",
      "GET /api/admin/dashboard/weekly-overview",
      result,
    );
    return result;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      const result = {
        ok: false as const,
        error: formatAuthApiError(
          status,
          data,
          "Could not load weekly overview data.",
        ),
        status,
      };
      flowLogApiResult(
        "auth",
        "GET /api/admin/dashboard/weekly-overview",
        result,
      );
      return result;
    }
    return { ok: false, error: "Could not reach the server." };
  }
}

export async function createAdminUser(
  input: CreateAdminInput,
): Promise<AdminActionResult<null>> {
  flowLog("auth", "POST /api/admin/users/create-admin → request", {
    email: input.email,
    role: input.role,
  });

  const token = await getAdminToken();
  if (!token) {
    return {
      ok: false,
      error: "Admin session expired. Please sign in again.",
      status: 401,
    };
  }

  try {
    const client = CallsWithBearer(envConfig.BASEURL, token);
    const res = await client.post(adminPath("/users/create-admin"), input);

    const result = { ok: true as const, status: res.status, data: null };
    flowLogApiResult("auth", "POST /api/admin/users/create-admin", result);
    return result;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      const result = {
        ok: false as const,
        error: formatAuthApiError(
          status,
          data,
          status === 409
            ? "Email already registered."
            : status === 403
              ? "Only super admins can create admin accounts."
              : "Could not create admin account.",
        ),
        status,
      };
      flowLogApiResult("auth", "POST /api/admin/users/create-admin", result);
      return result;
    }
    return { ok: false, error: "Could not reach the server." };
  }
}
