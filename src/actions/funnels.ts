"use server";

import axios from "axios";
import { auth } from "@/auth";
import { envConfig } from "@/config/env.config";
import { formatAuthApiError } from "@/lib/auth-api";

const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

function funnelsUrl(path: string): string {
  const base = envConfig.BASEURL.replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}/api/funnels${suffix}`;
}

async function getAccessToken(): Promise<string | null> {
  const session = await auth();
  const token = session?.access_token;
  return session?.user?.id &&
    session.invalid !== true &&
    typeof token === "string"
    ? token
    : null;
}

export type FunnelActionResult<T = unknown> =
  | { ok: true; status: number; data: T }
  | { ok: false; error: string; status?: number };

export async function uploadFunnelDocuments(
  formData: FormData,
): Promise<FunnelActionResult> {
  const token = await getAccessToken();
  if (!token)
    return {
      ok: false,
      error: "Session expired. Please sign in again.",
      status: 401,
    };

  try {
    const res = await axios.post(funnelsUrl("/upload"), formData, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 60000,
      maxBodyLength: MAX_UPLOAD_BYTES,
      maxContentLength: MAX_UPLOAD_BYTES,
    });
    return { ok: true, status: res.status, data: res.data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      return {
        ok: false,
        error: formatAuthApiError(
          status,
          data,
          "Could not upload your documents.",
        ),
        status,
      };
    }
    return { ok: false, error: "Could not reach the server." };
  }
}

export async function getFunnelUploadProgress(
  uploadId: string,
): Promise<FunnelActionResult> {
  const token = await getAccessToken();
  if (!token)
    return {
      ok: false,
      error: "Session expired. Please sign in again.",
      status: 401,
    };

  try {
    const res = await axios.get(funnelsUrl(`/upload/progress/${uploadId}`), {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 30000,
    });
    return { ok: true, status: res.status, data: res.data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      return {
        ok: false,
        error: formatAuthApiError(
          status,
          data,
          "Could not check upload progress.",
        ),
        status,
      };
    }
    return { ok: false, error: "Could not reach the server." };
  }
}
