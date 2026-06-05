/**
 * Temporary client-side admin session for UI development.
 * Replace with server-validated auth (HttpOnly cookie / JWT + middleware)
 * before production — see admin-login-form.tsx.
 */
const ADMIN_SESSION_KEY = "flowbrand-admin-session";
const ADMIN_SESSION_CHANGED_EVENT = "admin-session-changed";

function notifyAdminSessionChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(ADMIN_SESSION_CHANGED_EVENT));
}

export type AdminSession = {
  email: string;
  signedInAt: string;
};

let cachedRaw: string | null | undefined;
let cachedSession: AdminSession | null = null;

function parseAdminSession(raw: string | null): AdminSession | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as AdminSession;
    return parsed?.email ? parsed : null;
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

export function writeAdminSession(email: string): void {
  if (typeof window === "undefined") return;

  const session: AdminSession = {
    email,
    signedInAt: new Date().toISOString(),
  };

  try {
    sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    notifyAdminSessionChanged();
  } catch {
    // Quota exceeded or storage disabled — fail silently for mock auth.
  }
}

export function clearAdminSession(): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    notifyAdminSessionChanged();
  } catch {
    // Ignore storage errors on logout.
  }
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
