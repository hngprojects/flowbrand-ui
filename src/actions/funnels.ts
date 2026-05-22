"use server";

import axios from "axios";
import { auth } from "@/auth";
import { envConfig } from "@/config/env.config";
import { formatAuthApiError } from "@/lib/auth-api";
import type { FunnelSource } from "@/lib/funnel-api-types";

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

export type GenerateFunnelInput = {
  source: FunnelSource;
  idempotencyKey: string;
  uploadIds?: string[];
};

export async function generateFunnel(
  input: GenerateFunnelInput,
): Promise<FunnelActionResult> {
  const token = await getAccessToken();
  if (!token)
    return {
      ok: false,
      error: "Session expired. Please sign in again.",
      status: 401,
    };

  const body: Record<string, unknown> = {
    source: input.source,
    idempotency_key: input.idempotencyKey,
  };
  if (input.source === "document_upload" && input.uploadIds?.length) {
    body.upload_ids = input.uploadIds;
  }

  try {
    const res = await axios.post(funnelsUrl("/generate"), body, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 60000,
    });
    return { ok: true, status: res.status, data: res.data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      if (status === 409 || status === 200 || status === 202) {
        return { ok: true, status, data };
      }
      return {
        ok: false,
        error: formatAuthApiError(
          status,
          data,
          "Could not start strategy generation.",
        ),
        status,
      };
    }
    return { ok: false, error: "Could not reach the server." };
  }
}

export async function getFunnelGenerationStatus(
  funnelId: string,
): Promise<FunnelActionResult> {
  const token = await getAccessToken();
  if (!token)
    return {
      ok: false,
      error: "Session expired. Please sign in again.",
      status: 401,
    };

  try {
    const res = await axios.get(
      funnelsUrl(`/generate/status/${encodeURIComponent(funnelId)}`),
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 30000,
      },
    );
    return { ok: true, status: res.status, data: res.data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      return {
        ok: false,
        error: formatAuthApiError(
          status,
          data,
          "Could not check strategy generation status.",
        ),
        status,
      };
    }
    return { ok: false, error: "Could not reach the server." };
  }
}

export async function getFunnelStages(
  funnelId: string,
): Promise<FunnelActionResult> {
  const token = await getAccessToken();
  if (!token)
    return {
      ok: false,
      error: "Session expired. Please sign in again.",
      status: 401,
    };

  try {
    const res = await axios.get(
      funnelsUrl(`/${encodeURIComponent(funnelId)}/stages`),
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 30000,
      },
    );
    return { ok: true, status: res.status, data: res.data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      return {
        ok: false,
        error: formatAuthApiError(
          status,
          data,
          "Could not load strategy stages.",
        ),
        status,
      };
    }
    return { ok: false, error: "Could not reach the server." };
  }
}

export async function getFunnelStage(
  funnelId: string,
  stageId: string,
): Promise<FunnelActionResult> {
  const token = await getAccessToken();
  if (!token)
    return {
      ok: false,
      error: "Session expired. Please sign in again.",
      status: 401,
    };

  try {
    const res = await axios.get(
      funnelsUrl(
        `/${encodeURIComponent(funnelId)}/stages/${encodeURIComponent(stageId)}`,
      ),
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 30000,
      },
    );
    return { ok: true, status: res.status, data: res.data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      return {
        ok: false,
        error: formatAuthApiError(
          status,
          data,
          "Could not load stage details.",
        ),
        status,
      };
    }
    return { ok: false, error: "Could not reach the server." };
  }
}

export async function getFunnelDetail(
  funnelId: string,
): Promise<FunnelActionResult> {
  const token = await getAccessToken();
  if (!token)
    return {
      ok: false,
      error: "Session expired. Please sign in again.",
      status: 401,
    };

  try {
    const res = await axios.get(
      funnelsUrl(`/${encodeURIComponent(funnelId)}`),
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 30000,
      },
    );
    return { ok: true, status: res.status, data: res.data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      return {
        ok: false,
        error: formatAuthApiError(
          status,
          data,
          "Could not load your strategy.",
        ),
        status,
      };
    }
    return { ok: false, error: "Could not reach the server." };
  }
}

export async function listFunnels(page = 1): Promise<FunnelActionResult> {
  const token = await getAccessToken();
  if (!token)
    return {
      ok: false,
      error: "Session expired. Please sign in again.",
      status: 401,
    };

  try {
    const res = await axios.get(funnelsUrl(""), {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, per_page: 20 },
      timeout: 30000,
    });
    return { ok: true, status: res.status, data: res.data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      return {
        ok: false,
        error: formatAuthApiError(status, data, "Could not load your funnels."),
        status,
      };
    }
    return { ok: false, error: "Could not reach the server." };
  }
}
