import {
  clearAdminSession,
  readAdminSession,
  updateAdminAccessToken,
} from "@/lib/admin-session";
import { ADMIN_LOGIN_ROUTE } from "@/routes";

type AdminFetchOptions = RequestInit & {
  skipRefresh?: boolean;
};

function adminAuthHeaders(): HeadersInit {
  const session = readAdminSession();
  if (!session?.accessToken) return {};
  return { Authorization: `Bearer ${session.accessToken}` };
}

async function tryAdminRefresh(): Promise<boolean> {
  const res = await fetch("/api/admin/auth/refresh-token", {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) return false;

  const body = (await res.json()) as { access_token?: string };
  if (!body.access_token?.trim()) return false;

  updateAdminAccessToken(body.access_token);
  return true;
}

/** Authenticated fetch via the admin BFF gateway. */
export async function adminGatewayFetch(
  path: string,
  options: AdminFetchOptions = {},
): Promise<Response> {
  const { skipRefresh, ...init } = options;

  const run = () =>
    fetch(`/api/admin/gateway/${path}`, {
      ...init,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...adminAuthHeaders(),
        ...init.headers,
      },
    });

  let response = await run();

  if (response.status === 401 && !skipRefresh) {
    const refreshed = await tryAdminRefresh();
    if (refreshed) {
      response = await run();
    } else {
      clearAdminSession();
      if (typeof window !== "undefined") {
        const callback = encodeURIComponent(window.location.pathname);
        window.location.href = `${ADMIN_LOGIN_ROUTE}?callbackUrl=${callback}`;
      }
    }
  }

  return response;
}

export async function adminLoginRequest(
  email: string,
  password: string,
): Promise<
  | { ok: true; access_token: string }
  | { ok: false; status: number; message: string }
> {
  const res = await fetch("/api/admin/auth/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const body = (await res.json().catch(() => ({}))) as {
    access_token?: string;
    message?: string;
  };

  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      message: body.message ?? "Invalid email or password.",
    };
  }

  if (!body.access_token?.trim()) {
    return {
      ok: false,
      status: 502,
      message: "Login succeeded but the response was invalid.",
    };
  }

  return { ok: true, access_token: body.access_token };
}

export async function adminLogoutRequest(): Promise<void> {
  await fetch("/api/admin/auth/logout", {
    method: "POST",
    credentials: "include",
    headers: adminAuthHeaders(),
  });
  clearAdminSession();
}
