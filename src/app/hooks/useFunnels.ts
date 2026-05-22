"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";
// import { apiFetch } from "@/lib/api";

export interface UploadEntry {
  uploadId: string;
  fileName: string;
  status: string;
  percentComplete: number;
}

export interface UploadResponse {
  ok?: boolean;
  error?: string;
  data?: {
    uploads?: UploadEntry[];
    data?: {
      uploads?: UploadEntry[];
    };
  };
  uploads?: UploadEntry[];
}

export function useUploadDocuments() {
  return useMutation<UploadResponse, Error, FormData>({
    mutationFn: async (formData: FormData) => {
      return apiFetch<UploadResponse>("/api/funnels/upload", {
        method: "POST",
        body: formData,
      });
    },
  });
}

export function useGenerateFunnel() {
  return useMutation({
    mutationFn: async (body: unknown) => {
      return apiFetch("/api/funnels/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    },
  });
}

export function useFunnelStatus(funnelId: string) {
  return useQuery({
    queryKey: ["funnel-status", funnelId],
    queryFn: async () => {
      return apiFetch(`/api/funnels/status/${funnelId}`);
    },
    enabled: !!funnelId,
    refetchInterval: 3000,
  });
}
