import type { AdminRole } from "@/types/admin";

/** Normalize backend/JWT role strings to portal roles. */
export function normalizeAdminRole(value: unknown): AdminRole | null {
  if (typeof value !== "string") return null;

  const role = value.trim().toLowerCase().replace(/-/g, "_");
  if (role === "super_admin" || role === "superadmin") return "super_admin";
  if (role === "admin") return "admin";
  return null;
}

export function isSuperAdminRole(role: AdminRole | null | undefined): boolean {
  return role === "super_admin";
}

/** Read role claim from a JWT access token (UI gating only; API enforces auth). */
export function readAdminRoleFromAccessToken(
  accessToken: string,
): AdminRole | null {
  try {
    const segment = accessToken.split(".")[1];
    if (!segment) return null;

    const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const payload = JSON.parse(atob(padded)) as Record<string, unknown>;

    return (
      normalizeAdminRole(payload.role) ??
      normalizeAdminRole(payload.admin_role) ??
      normalizeAdminRole(payload.adminRole)
    );
  } catch {
    return null;
  }
}
