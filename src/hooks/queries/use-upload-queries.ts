"use client";

import { useMutation, useQueries, type Query } from "@tanstack/react-query";
import {
  uploadFunnelDocuments,
  getFunnelUploadProgress,
} from "@/actions/funnels";
import { scheduleApiRequest, staggerDelay } from "@/lib/api-request-scheduler";
import { unwrapActionResult } from "@/lib/api-query";
import {
  parseUploadEntriesFromPost,
  parseUploadProgress,
  type ParsedUploadProgress,
} from "@/lib/funnel-upload-progress";
import { queryKeys } from "@/lib/query-keys";
import { flowLog } from "@/lib/flow-debug-log";

/** Per API guide: poll every ~2s while parsing. */
const UPLOAD_POLL_MS = 2500;
const UPLOAD_STAGGER_MS = 500;
const MAX_UPLOAD_POLLS = 90;

async function fetchUploadProgressOnce(
  uploadId: string,
  staggerIndex: number,
): Promise<ParsedUploadProgress> {
  await staggerDelay(staggerIndex, UPLOAD_STAGGER_MS);
  return scheduleApiRequest(async () => {
    const res = await getFunnelUploadProgress(uploadId);
    const data = unwrapActionResult(res, "Could not check upload progress.");
    const parsed = parseUploadProgress(data);
    if (!parsed) {
      throw new Error("Could not read processing status.");
    }
    flowLog("upload", "GET upload/progress", {
      uploadId,
      status: parsed.status,
      percentComplete: parsed.percentComplete,
    });
    return parsed;
  });
}

export function useUploadDocumentsMutation() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await uploadFunnelDocuments(formData);
      const data = unwrapActionResult(res, "Could not upload your documents.");
      const entries = parseUploadEntriesFromPost(data);
      if (entries.length === 0) {
        throw new Error(
          "Upload accepted but the server did not return file details. Please try again.",
        );
      }
      flowLog("upload", "POST /api/funnels/upload → ok", {
        count: entries.length,
        uploadIds: entries.map((e) => e.uploadId),
      });
      return entries;
    },
    retry: false,
  });
}

export function useUploadProgressQueries(uploadIds: string[], enabled = true) {
  return useQueries({
    queries: uploadIds.map((uploadId, index) => ({
      queryKey: queryKeys.uploads.progress(uploadId),
      queryFn: () => fetchUploadProgressOnce(uploadId, index),
      enabled: enabled && Boolean(uploadId),
      staleTime: 0,
      placeholderData: (previousData: ParsedUploadProgress | undefined) =>
        previousData,
      refetchInterval: (query: Query<ParsedUploadProgress, Error>) => {
        const status = query.state.data?.status;
        if (status === "ready" || status === "failed") return false;
        if (query.state.dataUpdateCount >= MAX_UPLOAD_POLLS) return false;
        return UPLOAD_POLL_MS;
      },
      retry: 1,
      retryDelay: 3000,
    })),
  });
}
