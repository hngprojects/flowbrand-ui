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
const MAX_UPLOAD_POLLS = 240; // 10 min max (240 polls × 2.5s = 600s)
const STALL_TIMEOUT_MS = 300 * 1000; // 5 min of no progress change = stalled (allow slow backends)
const STALL_CHECK_THRESHOLD = 10; // Must see 10 consecutive polls (25s) with same % to detect stall

const uploadProgressTracking = new Map<
  string,
  { lastPercent: number; stableCount: number; firstSeenAt: number }
>();

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

    // Track progress changes to detect stalls
    const tracking = uploadProgressTracking.get(uploadId) || {
      lastPercent: -1,
      stableCount: 0,
      firstSeenAt: Date.now(),
    };

    if (parsed.percentComplete === tracking.lastPercent) {
      tracking.stableCount++;
    } else {
      tracking.stableCount = 0;
      tracking.lastPercent = parsed.percentComplete;
    }

    uploadProgressTracking.set(uploadId, tracking);

    const elapsed = Date.now() - tracking.firstSeenAt;
    const isStalled =
      tracking.stableCount >= STALL_CHECK_THRESHOLD &&
      elapsed > STALL_TIMEOUT_MS;

    flowLog("upload", "GET upload/progress", {
      uploadId,
      status: parsed.status,
      percentComplete: parsed.percentComplete,
      stableFor: `${tracking.stableCount} polls`,
      elapsed: `${Math.round(elapsed / 1000)}s`,
      isStalled,
      rawResponse: data,
    });

    if (isStalled && parsed.status !== "failed") {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `[upload] Progress stalled at ${parsed.percentComplete}% for ${uploadId} after ${Math.round(elapsed / 1000)}s. Response:`,
          data,
        );
      }
    }
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
        const tracking = uploadProgressTracking.get(uploadId);

        // Stop polling if ready or failed
        if (status === "ready" || status === "failed") {
          uploadProgressTracking.delete(uploadId);
          return false;
        }

        // Stop polling after max attempts
        if (query.state.dataUpdateCount >= MAX_UPLOAD_POLLS) {
          if (process.env.NODE_ENV === "development") {
            console.warn(
              `[upload] Max polling attempts (${MAX_UPLOAD_POLLS}) reached for ${uploadId}. Last status: ${status} at ${query.state.data?.percentComplete}%`,
            );
          }
          return false;
        }

        // Stop polling if stalled for too long
        if (tracking) {
          const elapsed = Date.now() - tracking.firstSeenAt;
          if (
            tracking.stableCount >= STALL_CHECK_THRESHOLD &&
            elapsed > STALL_TIMEOUT_MS
          ) {
            if (process.env.NODE_ENV === "development") {
              console.error(
                `[upload] Progress stalled for ${uploadId}. Stopping polling. Last: ${tracking.lastPercent}% status=${status}`,
              );
            }
            return false;
          }
        }

        return UPLOAD_POLL_MS;
      },
      retry: 1,
      retryDelay: 3000,
    })),
  });
}
