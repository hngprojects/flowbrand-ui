import { readAdminRoleFromAccessToken } from "@/lib/admin-role";
import type { AdminRole } from "@/types/admin";

const ADMIN_SESSION_KEY = "flowbrand-admin-session";
const ADMIN_SESSION_CHANGED_EVENT = "admin-session-changed";

function notifyAdminSessionChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(ADMIN_SESSION_CHANGED_EVENT));
}

export type AdminSession = {
  accessToken: string;
  email?: string;
  role?: AdminRole;
  signedInAt: string;
};

let cachedRaw: string | null | undefined;
let cachedSession: AdminSession | null = null;

function parseAdminSession(raw: string | null): AdminSession | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as AdminSession;
    return parsed?.accessToken ? parsed : null;
  } catch {
    return null;
  }
}

function readAdminSessionRaw(): string | null {
  if (typeof window === "undefined") return null;

  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY);
  } catch {
    return null;
  }
}

function persistSession(session: AdminSession | null): void {
  if (typeof window === "undefined") return;

  try {
    if (!session) {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } else {
      sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    }
    cachedRaw = undefined;
    notifyAdminSessionChanged();
  } catch {
    // Quota exceeded or storage disabled.
  }
}

/** Stable snapshot for useSyncExternalStore — reuses the same object until storage changes. */
export function getAdminSessionSnapshot(): AdminSession | null {
  const raw = readAdminSessionRaw();

  if (raw === cachedRaw) {
    return cachedSession;
  }

  cachedRaw = raw;
  cachedSession = parseAdminSession(raw);
  return cachedSession;
}

export function readAdminSession(): AdminSession | null {
  return getAdminSessionSnapshot();
}

export function writeAdminSession(input: {
  accessToken: string;
  email?: string;
  role?: AdminRole;
}): void {
  if (typeof window === "undefined") return;

  persistSession({
    accessToken: input.accessToken,
    email: input.email,
    role:
      input.role ??
      readAdminRoleFromAccessToken(input.accessToken) ??
      undefined,
    signedInAt: new Date().toISOString(),
  });
}

export function updateAdminAccessToken(accessToken: string): void {
  const current = readAdminSession();
  if (!current) {
    writeAdminSession({ accessToken });
    return;
  }

  persistSession({
    ...current,
    accessToken,
    role: readAdminRoleFromAccessToken(accessToken) ?? current.role,
  });
}

export function clearAdminSession(): void {
  persistSession(null);
}

export function subscribeToAdminSession(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener(ADMIN_SESSION_CHANGED_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(ADMIN_SESSION_CHANGED_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}
