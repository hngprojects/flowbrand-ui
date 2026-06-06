import { adminGatewayFetch } from "@/lib/admin-api-client";
import { normalizeAdminRole } from "@/lib/admin-role";
import type { AdminProfile } from "@/types/admin";

type ApiProfile = {
  id: string;
  full_name: string;
  email: string;
  country: string;
  avatar_url: string | null;
  role: AdminProfile["role"];
  created_at: string;
};

function mapProfile(data: ApiProfile): AdminProfile {
  return {
    id: data.id,
    fullName: data.full_name,
    email: data.email,
    country: data.country,
    avatarUrl: data.avatar_url,
    role: normalizeAdminRole(data.role) ?? "admin",
    createdAt: data.created_at,
  };
}

function readProfileData(body: unknown): ApiProfile | null {
  if (!body || typeof body !== "object") return null;
  const record = body as Record<string, unknown>;
  const data =
    record.data && typeof record.data === "object"
      ? (record.data as ApiProfile)
      : (record as unknown as ApiProfile);
  if (!data.id || !data.email) return null;
  return data;
}

/** GET /api/admin/profile */
export async function fetchAdminProfile(): Promise<AdminProfile> {
  const res = await adminGatewayFetch("profile");
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? `Profile request failed (${res.status})`);
  }
  const body = await res.json();
  const profile = readProfileData(body);
  if (!profile) throw new Error("Invalid profile response.");
  return mapProfile(profile);
}

/** PATCH /api/admin/profile */
export async function updateAdminProfile(input: {
  full_name?: string;
  country?: string;
}): Promise<AdminProfile> {
  const res = await adminGatewayFetch("profile", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? `Profile update failed (${res.status})`);
  }
  const body = await res.json();
  const profile = readProfileData(body);
  if (!profile) throw new Error("Invalid profile response.");
  return mapProfile(profile);
}

/** PATCH /api/admin/profile/password */
export async function changeAdminPassword(input: {
  old_password: string;
  new_password: string;
  confirm_password: string;
}): Promise<void> {
  const res = await adminGatewayFetch("profile/password", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? `Password update failed (${res.status})`);
  }
}
