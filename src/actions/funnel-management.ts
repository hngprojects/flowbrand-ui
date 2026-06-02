"use server";

import { auth } from "@/auth";
import { envConfig } from "@/config/env.config";
import axios from "axios";

async function getToken(): Promise<string | null> {
  const session = await auth();
  const token = session?.access_token;
  return session?.user?.id &&
    session.invalid !== true &&
    typeof token === "string"
    ? token
    : null;
}

function funnelsUrl(path: string): string {
  const base = envConfig.BASEURL.trim().replace(/\/$/, "");
  return `${base}/api/funnels${path}`;
}

export async function renameFunnel(
  funnelId: string,
  name: string,
): Promise<{ ok: boolean; error?: string }> {
  const token = await getToken();
  if (!token) return { ok: false, error: "Session expired." };

  try {
    // TODO: confirm endpoint path with backend
    await axios.patch(
      funnelsUrl(`/${encodeURIComponent(funnelId)}`),
      { name },
      { headers: { Authorization: `Bearer ${token}` }, timeout: 30000 },
    );
    return { ok: true };
  } catch (error) {
    console.error("Rename funnel failed:", error);

    return {
      ok: false,
      error: "Failed to rename funnel",
    };
  }
}

export async function deleteFunnel(
  funnelId: string,
): Promise<{ ok: boolean; error?: string }> {
  const token = await getToken();
  if (!token) return { ok: false, error: "Session expired." };

  try {
    // TODO: confirm endpoint path with backend
    await axios.delete(funnelsUrl(`/${encodeURIComponent(funnelId)}`), {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 30000,
    });
    return { ok: true };
  } catch (error) {
    console.error("Delete funnel failed:", error);

    return {
      ok: false,
      error: "Failed to delete funnel",
    };
  }
}
