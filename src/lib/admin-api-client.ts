import { clearAdminSession, updateAdminSessionRole } from "@/lib/admin-session";
import { ADMIN_LOGIN_ROUTE } from "@/routes";
import type { AdminRole } from "@/types/admin";

type AdminFetchOptions = RequestInit & {
  skipRefresh?: boolean;
};

async function tryAdminRefresh(): Promise<boolean> {
  const res = await fetch("/api/admin/auth/refresh-token", {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) return false;

  const body = (await res.json().catch(() => ({}))) as {
    role?: AdminRole;
  };
  updateAdminSessionRole(body.role);
  return true;
}

/** Authenticated fetch via the admin BFF gateway (Bearer from httpOnly cookie). */
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
  | { ok: true; email?: string; role?: AdminRole }
  | { ok: false; status: number; message: string }
> {
  const res = await fetch("/api/admin/auth/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const body = (await res.json().catch(() => ({}))) as {
    email?: string;
    role?: AdminRole;
    message?: string;
  };

  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      message: body.message ?? "Invalid email or password.",
    };
  }

  return { ok: true, email: body.email ?? email, role: body.role };
}

export async function adminLogoutRequest(): Promise<void> {
  await fetch("/api/admin/auth/logout", {
    method: "POST",
    credentials: "include",
  });
  clearAdminSession();
}
