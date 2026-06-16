import { collectApiRecords, readRecord } from "@/lib/api-envelope";

export type VoiceUploadRoundResult = {
  voiceSessionId: string;
  status: string;
};

export type VoiceSessionStatus = {
  expectedCount: number;
  completedCount: number;
  isReady: boolean;
};

export type VoiceCompleteResult = {
  uploadId: string;
};

function readString(
  record: Record<string, unknown>,
  ...keys: string[]
): string | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

function readNumber(
  record: Record<string, unknown>,
  ...keys: string[]
): number | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return undefined;
}

export function parseVoiceUploadRound(
  data: unknown,
): VoiceUploadRoundResult | null {
  for (const record of collectApiRecords(data)) {
    const voiceSessionId = readString(
      record,
      "voiceSessionId",
      "voice_session_id",
    );
    const status = readString(record, "status");
    if (!voiceSessionId) continue;
    return { voiceSessionId, status: status ?? "processing" };
  }
  return null;
}

export function parseVoiceSessionStatus(
  data: unknown,
): VoiceSessionStatus | null {
  for (const record of collectApiRecords(data)) {
    const expectedCount = readNumber(record, "expectedCount", "expected_count");
    const completedCount = readNumber(
      record,
      "completedCount",
      "completed_count",
    );
    if (expectedCount == null && completedCount == null) continue;

    const isReady =
      record.isReady === true ||
      record.is_ready === true ||
      (expectedCount != null &&
        completedCount != null &&
        expectedCount > 0 &&
        completedCount >= expectedCount);

    return {
      expectedCount: expectedCount ?? 0,
      completedCount: completedCount ?? 0,
      isReady,
    };
  }

  const root = readRecord(data);
  if (!root) return null;

  const expectedCount = readNumber(root, "expectedCount", "expected_count");
  const completedCount = readNumber(root, "completedCount", "completed_count");
  if (expectedCount == null && completedCount == null) return null;

  return {
    expectedCount: expectedCount ?? 0,
    completedCount: completedCount ?? 0,
    isReady:
      root.isReady === true ||
      root.is_ready === true ||
      (expectedCount != null &&
        completedCount != null &&
        expectedCount > 0 &&
        completedCount >= expectedCount),
  };
}

export function parseVoiceCompleteResult(
  data: unknown,
): VoiceCompleteResult | null {
  for (const record of collectApiRecords(data)) {
    const uploadId = readString(record, "uploadId", "upload_id");
    if (uploadId) return { uploadId };
  }
  return null;
}
