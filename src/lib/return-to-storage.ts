/**
 * "Return-to" storage — remembers the last dashboard page a user was on so we
 * can land them there after their next login.
 *
 * The path is stamped with the user's email so that if Person B signs in on the
 * same browser later, we don't drop them onto Person A's saved page.
 */

export const RETURN_TO_STORAGE_KEY = "flowbrand-return-to-path";

/** Only paths under this prefix are eligible to be remembered or restored. */
const DASHBOARD_PREFIX = "/dashboard";

type StoredReturnTo = {
  path: string;
  savedAt: number;
  userEmail: string;
};

function isValidStored(value: unknown): value is StoredReturnTo {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.path === "string" &&
    typeof v.savedAt === "number" &&
    typeof v.userEmail === "string"
  );
}

/** Same-origin path-only check — blocks "//evil.com/..." and similar. */
function isSafeDashboardPath(path: string): boolean {
  if (typeof path !== "string") return false;
  if (!path.startsWith(DASHBOARD_PREFIX)) return false;
  // Reject protocol-relative URLs ("//host") and any whitespace shenanigans.
  if (path.startsWith("//")) return false;
  if (/\s/.test(path)) return false;
  return true;
}

function normalizeEmail(email: string | null | undefined): string {
  return (email ?? "").trim().toLowerCase();
}

export function setReturnToPath(path: string, userEmail: string): void {
  if (typeof window === "undefined") return;
  if (!isSafeDashboardPath(path)) return;
  const email = normalizeEmail(userEmail);
  if (!email) return;

  const payload: StoredReturnTo = {
    path,
    savedAt: Date.now(),
    userEmail: email,
  };

  try {
    localStorage.setItem(RETURN_TO_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // localStorage can throw (quota, private mode). Best-effort only.
  }
}

/**
 * Read the saved path. Returns null unless the saved email matches the
 * `forUserEmail` argument (case-insensitive) — this keeps account-switching
 * on the same browser from sending the wrong user to the wrong page.
 */
export function getReturnToPath(forUserEmail: string): string | null {
  if (typeof window === "undefined") return null;
  const email = normalizeEmail(forUserEmail);
  if (!email) return null;

  let raw: string | null = null;
  try {
    raw = localStorage.getItem(RETURN_TO_STORAGE_KEY);
  } catch {
    return null;
  }
  if (!raw) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    clearReturnToPath();
    return null;
  }

  if (!isValidStored(parsed)) {
    clearReturnToPath();
    return null;
  }

  if (parsed.userEmail !== email) return null;
  if (!isSafeDashboardPath(parsed.path)) {
    clearReturnToPath();
    return null;
  }

  return parsed.path;
}

export function clearReturnToPath(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(RETURN_TO_STORAGE_KEY);
  } catch {
    // best effort
  }
}
