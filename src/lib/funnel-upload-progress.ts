import { collectApiRecords, readRecord } from "@/lib/api-envelope";

export type FunnelUploadProgressStatus =
  | "uploading"
  | "parsing"
  | "ready"
  | "failed";

export type ParsedUploadProgress = {
  status: FunnelUploadProgressStatus;
  percentComplete: number;
  uploadedAt?: string;
  failureReason?: string | null;
  fileType?: string;
  fileSizeBytes?: number;
};

export type FunnelUploadEntry = {
  uploadId: string;
  fileName: string;
  status: FunnelUploadProgressStatus;
  percentComplete: number;
  fileType?: string;
  fileSizeBytes?: number;
  errorMessage?: string;
};

/** Prefer nested upload rows over API envelope wrappers (statusCode/message only). */
function scoreUploadRecord(record: Record<string, unknown>): number {
  let score = 0;
  if (
    typeof record.uploadId === "string" ||
    typeof record.upload_id === "string"
  ) {
    score += 20;
  }
  if (
    typeof record.percentComplete === "number" ||
    typeof record.percent_complete === "number" ||
    typeof record.progress === "number" ||
    typeof record.percentage === "number"
  ) {
    score += 10;
  }
  if (typeof record.status === "string") score += 5;
  if (
    typeof record.fileName === "string" ||
    typeof record.file_name === "string"
  ) {
    score += 3;
  }
  if (Array.isArray(record.uploads)) score -= 15;
  if (
    typeof record.statusCode === "number" &&
    !record.uploadId &&
    !record.upload_id
  ) {
    score -= 12;
  }
  if (
    typeof record.message === "string" &&
    !record.uploadId &&
    !record.upload_id
  ) {
    score -= 4;
  }
  return score;
}

function readPercent(record: Record<string, unknown>): number {
  if (typeof record.percentComplete === "number") return record.percentComplete;
  if (typeof record.percent_complete === "number")
    return record.percent_complete;
  if (typeof record.progress === "number") return record.progress;
  if (typeof record.percentage === "number") return record.percentage;
  return 0;
}

export function normalizeUploadStatus(
  raw: unknown,
  percentComplete: number,
): FunnelUploadProgressStatus {
  if (typeof raw === "string") {
    const value = raw.toLowerCase();
    if (value === "ready" || value === "completed" || value === "complete") {
      return "ready";
    }
    if (value === "failed" || value === "error") return "failed";
    if (value === "uploading") return "uploading";
    if (
      value === "parsing" ||
      value === "processing" ||
      value === "processed" ||
      value === "parsed"
    ) {
      return "parsing";
    }
  }
  if (percentComplete >= 100) return "ready";
  return "parsing";
}

function parseProgressFromRecord(
  record: Record<string, unknown>,
): ParsedUploadProgress | null {
  const hasUploadId =
    typeof record.uploadId === "string" || typeof record.upload_id === "string";
  const percent = readPercent(record);
  const hasStatus = typeof record.status === "string";
  const hasPercent = percent > 0;

  if (!hasUploadId && !hasStatus && !hasPercent) {
    return null;
  }

  return {
    status: normalizeUploadStatus(record.status, percent),
    percentComplete: Math.min(100, Math.max(0, percent)),
  };
}

/** Pick the best progress row (not the outer { statusCode, message } envelope). */
function pickBestProgress(
  data: unknown,
  minScore = 0,
): ParsedUploadProgress | null {
  let best: ParsedUploadProgress | null = null;
  let bestScore = minScore;

  for (const record of collectApiRecords(data)) {
    const score = scoreUploadRecord(record);
    if (score < 8) continue;

    const parsed = parseProgressFromRecord(record);
    if (!parsed) continue;

    if (score > bestScore) {
      best = parsed;
      bestScore = score;
    }
  }

  return best;
}

/**
 * GET /upload/progress/{uploadId}
 * API returns nested structure: { success, statusCode, message, data: { uploadId, status, ... } }
 * Fallback to root-level for backward compatibility with older staging responses.
 */
export function parseUploadProgress(
  data: unknown,
): ParsedUploadProgress | null {
  const root = readRecord(data);
  if (!root) return null;

  // Check for nested data structure (current API)
  if (root.data && typeof root.data === "object") {
    const nested = root.data as Record<string, unknown>;
    const hasUploadId =
      typeof nested.uploadId === "string" ||
      typeof nested.upload_id === "string";
    if (hasUploadId) {
      const percent = readPercent(nested);
      const uploadedAt = nested.uploadedAt ?? nested.uploaded_at;
      const failureReason = nested.failureReason ?? nested.failure_reason;
      const fileType = nested.fileType ?? nested.file_type;
      const fileSizeBytes = nested.fileSizeBytes ?? nested.file_size_bytes;

      return {
        status: normalizeUploadStatus(nested.status, percent),
        percentComplete: Math.min(100, Math.max(0, percent)),
        ...(typeof uploadedAt === "string" && { uploadedAt }),
        ...((typeof failureReason === "string" || failureReason === null) && {
          failureReason,
        }),
        ...(typeof fileType === "string" && { fileType }),
        ...(typeof fileSizeBytes === "number" && { fileSizeBytes }),
      };
    }
  }

  // Fallback to root-level (older staging format)
  const hasUploadId =
    typeof root.uploadId === "string" || typeof root.upload_id === "string";
  if (hasUploadId) {
    const direct = parseProgressFromRecord(root);
    if (direct) return direct;
  }

  return pickBestProgress(data);
}

function parseUploadEntry(raw: unknown): FunnelUploadEntry | null {
  const record = readRecord(raw);
  if (!record) return null;

  const uploadId = record.uploadId ?? record.upload_id;
  const fileName = record.fileName ?? record.file_name;
  if (typeof uploadId !== "string" || typeof fileName !== "string") return null;

  const percent = readPercent(record);
  const fileType = record.fileType ?? record.file_type;
  const fileSizeBytes = record.fileSizeBytes ?? record.file_size_bytes;
  const errorMessage = record.errorMessage ?? record.error_message;

  return {
    uploadId,
    fileName,
    percentComplete: Math.min(100, Math.max(0, percent)),
    status: normalizeUploadStatus(record.status, percent),
    ...(typeof fileType === "string" && { fileType }),
    ...(typeof fileSizeBytes === "number" && { fileSizeBytes }),
    ...(typeof errorMessage === "string" && { errorMessage }),
  };
}

/** POST /upload — uploads array may be nested under data. */
export function parseUploadEntriesFromPost(data: unknown): FunnelUploadEntry[] {
  for (const record of collectApiRecords(data)) {
    const uploads = record.uploads;
    if (Array.isArray(uploads)) {
      return uploads
        .map((item) => parseUploadEntry(item))
        .filter((entry): entry is FunnelUploadEntry => entry !== null);
    }
  }
  return [];
}

/** Merge poll result with POST baseline so UI progress never jumps backward. */
export function mergeUploadProgress(
  baseline: { percentComplete: number; status: FunnelUploadProgressStatus },
  polled: ParsedUploadProgress | null | undefined,
): ParsedUploadProgress {
  if (!polled) {
    return {
      status: baseline.status === "uploading" ? "parsing" : baseline.status,
      percentComplete: Math.max(baseline.percentComplete, 5),
    };
  }

  // const percent = Math.max(
  //   baseline.percentComplete,
  //   polled.percentComplete,
  //   polled.status === "parsing" ? 5 : 0,
  // );

  const percent =
    polled.percentComplete > 0
      ? polled.percentComplete
      : Math.max(baseline.percentComplete, polled.status === "parsing" ? 5 : 0);

  let status = polled.status;
  if (baseline.status === "ready" || polled.status === "ready") {
    status = "ready";
  } else if (polled.status === "failed") {
    status = "failed";
  } else if (percent > 0 || polled.status === "parsing") {
    status = "parsing";
  }

  return {
    status,
    percentComplete: status === "ready" ? 100 : Math.min(100, percent),
    ...(polled.uploadedAt && { uploadedAt: polled.uploadedAt }),
    ...((typeof polled.failureReason === "string" ||
      polled.failureReason === null) && {
      failureReason: polled.failureReason,
    }),
    ...(polled.fileType && { fileType: polled.fileType }),
    ...(polled.fileSizeBytes && { fileSizeBytes: polled.fileSizeBytes }),
  };
}
