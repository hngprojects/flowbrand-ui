const ADMIN_SESSION_KEY = "flowbrand-admin-session";

export type AdminSession = {
  email: string;
  signedInAt: string;
};

export function readAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AdminSession;
    return parsed?.email ? parsed : null;
  } catch {
    return null;
  }
}

export function writeAdminSession(email: string): void {
  if (typeof window === "undefined") return;
  const session: AdminSession = {
    email,
    signedInAt: new Date().toISOString(),
  };
  sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
}

export function clearAdminSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}
