"use client";

import { useMutation, useQueries, type Query } from "@tanstack/react-query";
import {
  uploadFunnelDocuments,
  getFunnelUploadProgress,
} from "@/actions/funnels";
import { unwrapActionResult } from "@/lib/api-query";
import {
  parseUploadEntriesFromPost,
  parseUploadProgress,
  type ParsedUploadProgress,
} from "@/lib/funnel-upload-progress";
import { queryKeys } from "@/lib/query-keys";

const UPLOAD_POLL_MS = 1500;
const MAX_UPLOAD_POLLS = 80;

export async function fetchUploadProgress(
  uploadId: string,
): Promise<ParsedUploadProgress> {
  const res = await getFunnelUploadProgress(uploadId);
  const data = unwrapActionResult(res, "Could not check upload progress.");
  const parsed = parseUploadProgress(data);
  if (!parsed) {
    throw new Error("Could not read processing status.");
  }
  return parsed;
}

export function useUploadDocumentsMutation() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await uploadFunnelDocuments(formData);
      const data = unwrapActionResult(res, "Could not upload your documents.");
      return parseUploadEntriesFromPost(data);
    },
  });
}

export function useUploadProgressQueries(uploadIds: string[], enabled = true) {
  return useQueries({
    queries: uploadIds.map((uploadId) => ({
      queryKey: queryKeys.uploads.progress(uploadId),
      queryFn: () => fetchUploadProgress(uploadId),
      enabled: enabled && Boolean(uploadId),
      refetchInterval: (query: Query<ParsedUploadProgress, Error>) => {
        const status = query.state.data?.status;
        if (status === "ready" || status === "failed") return false;
        if (query.state.dataUpdateCount >= MAX_UPLOAD_POLLS) return false;
        return UPLOAD_POLL_MS;
      },
      retry: 1,
    })),
  });
}
