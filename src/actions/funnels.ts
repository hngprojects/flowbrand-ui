"use server";

import axios from "axios";
import { auth } from "@/auth";
import { envConfig } from "@/config/env.config";
import { formatAuthApiError } from "@/lib/auth-api";
import type { FunnelSource } from "@/lib/funnel-api-types";
import { flowLog, flowLogApiResult } from "@/lib/flow-debug-log";

function funnelsUrl(path: string): string {
  const base = envConfig.BASEURL?.trim().replace(/\/$/, "");
  if (!base) {
    throw new Error(
      `BASE_URL environment variable is not set. Cannot call API endpoint. ` +
        `Configure BASE_URL in .env.local (e.g., http://localhost:8000)`,
    );
  }
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}/api/funnels${suffix}`;
}

async function getAccessToken(): Promise<string | null> {
  try {
    const session = await auth();
    const token = session?.access_token;
    const valid =
      session?.user?.id &&
      session.invalid !== true &&
      typeof token === "string";
    if (!valid) {
      flowLog("funnel", "auth token missing or invalid", {
        hasSession: !!session,
        hasUserId: !!session?.user?.id,
        isInvalid: session?.invalid,
        hasToken: typeof token === "string",
      });
      return null;
    }
    return token;
  } catch (err) {
    flowLog("funnel", "auth session fetch failed", { error: String(err) });
    return null;
  }
}

export type FunnelActionResult<T = unknown> =
  | { ok: true; status: number; data: T }
  | { ok: false; error: string; status?: number; data?: unknown };

function funnelUnauthorized(): FunnelActionResult {
  return {
    ok: false,
    error: "Session expired. Please sign in again.",
    status: 401,
  };
}

function funnelNetworkError(): FunnelActionResult {
  return { ok: false, error: "Could not reach the server." };
}

async function withFunnelLogging(
  label: string,
  meta: Record<string, unknown> | undefined,
  fallbackError: string,
  run: (token: string) => Promise<FunnelActionResult>,
): Promise<FunnelActionResult> {
  flowLog("funnel", `${label} → request`, meta);
  const token = await getAccessToken();
  if (!token) {
    const result = funnelUnauthorized();
    flowLogApiResult("funnel", label, result, meta);
    return result;
  }

  try {
    const result = await run(token);
    flowLogApiResult("funnel", label, result, meta);
    return result;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      const result: FunnelActionResult = {
        ok: false,
        error: formatAuthApiError(status, data, fallbackError),
        status,
        data,
      };
      flowLogApiResult("funnel", label, result, meta);
      return result;
    }
    if (error instanceof Error && error.message.includes("BASE_URL")) {
      const result: FunnelActionResult = {
        ok: false,
        error: error.message,
      };
      flowLogApiResult("funnel", label, result, meta);
      return result;
    }
    if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
      const result: FunnelActionResult = {
        ok: false,
        error: "The server took too long to respond. Please try again.",
      };
      flowLogApiResult("funnel", label, result, meta);
      return result;
    }
    if (error instanceof Error && error.message.trim()) {
      const result: FunnelActionResult = {
        ok: false,
        error: error.message,
      };
      flowLogApiResult("funnel", label, result, meta);
      return result;
    }
    const result = funnelNetworkError();
    flowLogApiResult("funnel", label, result, meta);
    return result;
  }
}

export async function uploadFunnelDocuments(
  formData: FormData,
): Promise<FunnelActionResult> {
  return withFunnelLogging(
    "POST /api/funnels/upload",
    undefined,
    "Could not upload your documents.",
    async (token) => {
      const res = await axios.post(funnelsUrl("/upload"), formData, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 60000,
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        validateStatus: (status) => status === 200 || status === 201,
      });
      return { ok: true, status: res.status, data: res.data };
    },
  );
}

export async function updateFunnelTaskStatus(input: {
  funnelId: string;
  stageId: string;
  taskId: string;
  status: "pending" | "complete";
}): Promise<FunnelActionResult> {
  return withFunnelLogging(
    "PATCH /api/funnels/{funnelId}/stages/{stageId}/tasks/{taskId}",
    {
      funnelId: input.funnelId,
      stageId: input.stageId,
      taskId: input.taskId,
      status: input.status,
    },
    "Could not update task status.",
    async (token) => {
      const res = await axios.patch(
        funnelsUrl(
          `/${encodeURIComponent(input.funnelId)}/stages/${encodeURIComponent(
            input.stageId,
          )}/tasks/${encodeURIComponent(input.taskId)}`,
        ),
        { status: input.status },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 30000,
        },
      );
      return { ok: true, status: res.status, data: res.data };
    },
  );
}

export async function completeFunnelStage(
  funnelId: string,
  stageId: string,
): Promise<FunnelActionResult> {
  return withFunnelLogging(
    "PATCH /api/funnels/{funnelId}/stages/{stageId}/complete",
    { funnelId, stageId },
    "Could not complete this stage.",
    async (token) => {
      const res = await axios.patch(
        funnelsUrl(
          `/${encodeURIComponent(funnelId)}/stages/${encodeURIComponent(
            stageId,
          )}/complete`,
        ),
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 30000,
        },
      );
      return { ok: true, status: res.status, data: res.data };
    },
  );
}

export async function submitStageFeedback(input: {
  funnelId: string;
  stageId: string;
  comment: string;
}): Promise<FunnelActionResult> {
  return withFunnelLogging(
    "POST /api/funnels/{funnelId}/stages/{stageId}/feedback",
    { funnelId: input.funnelId, stageId: input.stageId },
    "Could not submit stage feedback.",
    async (token) => {
      const res = await axios.post(
        funnelsUrl(
          `/${encodeURIComponent(input.funnelId)}/stages/${encodeURIComponent(
            input.stageId,
          )}/feedback`,
        ),
        { comment: input.comment },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 30000,
          validateStatus: (status) => status === 200 || status === 201,
        },
      );
      return { ok: true, status: res.status, data: res.data };
    },
  );
}

export async function getFunnelUploadProgress(
  uploadId: string,
): Promise<FunnelActionResult> {
  return withFunnelLogging(
    "GET /api/funnels/upload/progress/{uploadId}",
    { uploadId },
    "Could not check upload progress.",
    async (token) => {
      const res = await axios.get(funnelsUrl(`/upload/progress/${uploadId}`), {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 30000,
      });
      return { ok: true, status: res.status, data: res.data };
    },
  );
}

export type GenerateFunnelInput = {
  source: FunnelSource;
  idempotencyKey: string;
  uploadIds?: string[];
};

export async function generateFunnel(
  input: GenerateFunnelInput,
): Promise<FunnelActionResult> {
  const body: Record<string, unknown> = {
    source: input.source,
    idempotency_key: input.idempotencyKey,
  };
  if (input.source === "document_upload" && input.uploadIds?.length) {
    body.upload_ids = input.uploadIds;
  }

  return withFunnelLogging(
    "POST /api/funnels/generate",
    {
      source: input.source,
      uploadCount: input.uploadIds?.length ?? 0,
    },
    "Could not start strategy generation.",
    async (token) => {
      const res = await axios.post(funnelsUrl("/generate"), body, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 60000,
        validateStatus: (status) => [200, 201, 202, 409].includes(status),
      });
      return { ok: true, status: res.status, data: res.data };
    },
  );
}

export async function getFunnelGenerationStatus(
  funnelId: string,
): Promise<FunnelActionResult> {
  return withFunnelLogging(
    "GET /api/funnels/generate/status/{funnelId}",
    { funnelId },
    "Could not check strategy generation status.",
    async (token) => {
      const res = await axios.get(
        funnelsUrl(`/generate/status/${encodeURIComponent(funnelId)}`),
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 30000,
        },
      );
      return { ok: true, status: res.status, data: res.data };
    },
  );
}

export async function getFunnelStages(
  funnelId: string,
): Promise<FunnelActionResult> {
  return withFunnelLogging(
    "GET /api/funnels/{funnelId}/stages",
    { funnelId },
    "Could not load strategy stages.",
    async (token) => {
      const res = await axios.get(
        funnelsUrl(`/${encodeURIComponent(funnelId)}/stages`),
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 30000,
        },
      );
      return { ok: true, status: res.status, data: res.data };
    },
  );
}

export async function getFunnelStage(
  funnelId: string,
  stageId: string,
): Promise<FunnelActionResult> {
  return withFunnelLogging(
    "GET /api/funnels/{funnelId}/stages/{stageId}",
    { funnelId, stageId },
    "Could not load stage details.",
    async (token) => {
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
    },
  );
}

export async function getFunnelDetail(
  funnelId: string,
): Promise<FunnelActionResult> {
  return withFunnelLogging(
    "GET /api/funnels/{funnelId}",
    { funnelId },
    "Could not load your strategy.",
    async (token) => {
      const res = await axios.get(
        funnelsUrl(`/${encodeURIComponent(funnelId)}`),
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 30000,
        },
      );
      return { ok: true, status: res.status, data: res.data };
    },
  );
}

export async function listFunnels(page = 1): Promise<FunnelActionResult> {
  return withFunnelLogging(
    "GET /api/funnels",
    { page },
    "Could not load your funnels.",
    async (token) => {
      const res = await axios.get(funnelsUrl(""), {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, per_page: 20 },
        timeout: 30000,
      });
      return { ok: true, status: res.status, data: res.data };
    },
  );
}
