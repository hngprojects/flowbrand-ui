"use client";

import { useMutation, useQuery, type Query } from "@tanstack/react-query";
import {
  completeVoiceSession,
  getVoiceSessionStatus,
  uploadVoiceRound,
} from "@/actions/onboarding";
import { scheduleApiRequest } from "@/lib/api-request-scheduler";
import { unwrapActionResult } from "@/lib/api-query";
import {
  assertVoiceUploadSize,
  MAX_VOICE_POLLS,
  VOICE_POLL_MS,
} from "@/lib/audio/voice-limits";
import { wavFileForUpload } from "@/lib/audio/voice-upload";
import { flowLog } from "@/lib/flow-debug-log";
import {
  parseVoiceCompleteResult,
  parseVoiceSessionStatus,
  parseVoiceUploadRound,
  type VoiceSessionStatus,
} from "@/lib/voice-onboarding-api";
import { queryKeys } from "@/lib/query-keys";

async function fetchVoiceSessionStatusOnce(
  voiceSessionId: string,
): Promise<VoiceSessionStatus> {
  return scheduleApiRequest(async () => {
    const res = await getVoiceSessionStatus(voiceSessionId);
    const data = unwrapActionResult(
      res,
      "Could not check voice transcription status.",
    );
    const parsed = parseVoiceSessionStatus(data);
    if (!parsed) {
      throw new Error("Could not read voice transcription status.");
    }

    flowLog("voice", "GET /api/onboarding/voice/{id}/status", {
      voiceSessionId,
      ...parsed,
    });

    return parsed;
  });
}

export function useVoiceSessionStatusQuery(
  voiceSessionId: string | null,
  enabled: boolean,
) {
  const id = voiceSessionId?.trim() ?? "";

  return useQuery({
    queryKey: queryKeys.voice.sessionStatus(id),
    queryFn: () => fetchVoiceSessionStatusOnce(id),
    enabled: enabled && Boolean(id),
    staleTime: 0,
    refetchInterval: (query: Query<VoiceSessionStatus, Error>) => {
      if (query.state.data?.isReady) return false;
      if (query.state.dataUpdateCount >= MAX_VOICE_POLLS) return false;
      return VOICE_POLL_MS;
    },
    retry: 1,
  });
}

export function useUploadVoiceRecordingMutation() {
  return useMutation({
    mutationFn: async (blob: Blob) => {
      assertVoiceUploadSize(blob);
      const uploadFile = wavFileForUpload(blob);

      const form = new FormData();
      form.append("file", uploadFile);

      const res = await uploadVoiceRound(form);
      const data = unwrapActionResult(
        res,
        "Could not upload your voice recording.",
      );
      const parsed = parseVoiceUploadRound(data);
      if (!parsed?.voiceSessionId) {
        throw new Error(
          "Upload accepted but the server did not return a voice session id.",
        );
      }

      flowLog("voice", "POST /api/onboarding/voice → ok", parsed);

      return parsed;
    },
    retry: false,
  });
}

export function useCompleteVoiceSessionMutation() {
  return useMutation({
    mutationFn: async (voiceSessionId: string) => {
      const trimmed = voiceSessionId.trim();
      const res = await completeVoiceSession(trimmed);
      const data = unwrapActionResult(
        res,
        "Could not complete your voice session.",
      );
      const parsed = parseVoiceCompleteResult(data);
      if (!parsed?.uploadId) {
        throw new Error(
          "Voice session completed but no upload id was returned.",
        );
      }

      flowLog("voice", "POST /api/onboarding/voice/complete → ok", parsed);

      return parsed;
    },
    retry: false,
  });
}
