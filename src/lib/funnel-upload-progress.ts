export type FunnelUploadProgressStatus =
  | "uploading"
  | "parsing"
  | "ready"
  | "failed";

export type ParsedUploadProgress = {
  status: FunnelUploadProgressStatus;
  percentComplete: number;
};

export type FunnelUploadEntry = {
  uploadId: string;
  fileName: string;
  status: FunnelUploadProgressStatus;
  percentComplete: number;
};

function readRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object") return null;
  return value as Record<string, unknown>;
}

function collectApiRecords(data: unknown): Record<string, unknown>[] {
  const records: Record<string, unknown>[] = [];
  const seen = new Set<unknown>();

  const visit = (value: unknown) => {
    const record = readRecord(value);
    if (!record || seen.has(record)) return;
    seen.add(record);
    records.push(record);
    visit(record.data);
  };

  visit(data);
  return records;
}

function normalizeUploadStatus(
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

/** GET /upload/progress — flat or enveloped. */
export function parseUploadProgress(
  data: unknown,
): ParsedUploadProgress | null {
  for (const record of collectApiRecords(data)) {
    const percent =
      typeof record.percentComplete === "number"
        ? record.percentComplete
        : typeof record.percent_complete === "number"
          ? record.percent_complete
          : typeof record.progress === "number"
            ? record.progress
            : typeof record.percentage === "number"
              ? record.percentage
              : 0;
    const status = normalizeUploadStatus(record.status, percent);
    return { status, percentComplete: percent };
  }
  return null;
}

function parseUploadEntry(raw: unknown): FunnelUploadEntry | null {
  const record = readRecord(raw);
  if (!record) return null;

  const uploadId = record.uploadId ?? record.upload_id;
  const fileName = record.fileName ?? record.file_name;
  if (typeof uploadId !== "string" || typeof fileName !== "string") return null;

  const percent =
    typeof record.percentComplete === "number"
      ? record.percentComplete
      : typeof record.percent_complete === "number"
        ? record.percent_complete
        : typeof record.progress === "number"
          ? record.progress
          : typeof record.percentage === "number"
            ? record.percentage
            : 0;

  return {
    uploadId,
    fileName,
    percentComplete: percent,
    status: normalizeUploadStatus(record.status, percent),
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
