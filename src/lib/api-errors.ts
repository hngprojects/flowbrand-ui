/**
 * Shared helpers for parsing API error bodies (Nest / class-validator style).
 * Kept separate from `auth-api` so public endpoints (e.g. contact) don't need auth-specific imports.
 */

export function readSuccessMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") {
    return fallback;
  }

  const record = data as Record<string, unknown>;
  const message = record.message;

  if (Array.isArray(message)) {
    const parts = message
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter((item) => item.length > 0);
    if (parts.length > 0) {
      return parts.join(" ");
    }
  }

  if (typeof message === "string") {
    const text = message.trim();
    if (text.length > 0) {
      return text;
    }
  }

  if (typeof record.error === "string" && record.error.trim().length > 0) {
    return record.error.trim();
  }

  return fallback;
}

/** Flattens common NestJS / class-validator error shapes into one line for toasts. */
export function extractApiErrorMessages(data: unknown): string {
  if (!data || typeof data !== "object") {
    return "";
  }

  const record = data as Record<string, unknown>;
  const pieces: string[] = [];

  const msg = record.message;
  if (Array.isArray(msg)) {
    for (const item of msg) {
      if (typeof item === "string" && item.trim()) {
        pieces.push(item.trim());
      }
    }
  }

  const mergeRecordValues = (obj: Record<string, unknown>) => {
    for (const val of Object.values(obj)) {
      if (typeof val === "string" && val.trim()) {
        pieces.push(val.trim());
      } else if (Array.isArray(val)) {
        for (const x of val) {
          if (typeof x === "string") {
            const trimmed = x.trim();
            if (trimmed) {
              pieces.push(trimmed);
            }
          }
        }
      }
    }
  };

  for (const key of ["errors", "validationErrors"]) {
    const block = record[key];
    if (block && typeof block === "object" && !Array.isArray(block)) {
      mergeRecordValues(block as Record<string, unknown>);
    }
  }

  const details = record.details;
  if (Array.isArray(details)) {
    for (const item of details) {
      if (typeof item === "string" && item.trim()) {
        pieces.push(item.trim());
      } else if (item && typeof item === "object") {
        const d = item as Record<string, unknown>;
        if (typeof d.message === "string" && d.message.trim()) {
          pieces.push(d.message.trim());
        }
      }
    }
  }

  const nestedData = record.data;
  if (
    nestedData &&
    typeof nestedData === "object" &&
    !Array.isArray(nestedData)
  ) {
    const nestedMsg = extractApiErrorMessages(nestedData);
    if (nestedMsg) {
      pieces.push(nestedMsg);
    }
  }

  const deduped = [...new Set(pieces.filter(Boolean))];
  return deduped.length > 0 ? deduped.join(" ") : "";
}

export function formatHttpApiError(
  status: number | undefined,
  data: unknown,
  fallback: string,
): string {
  const apiMessage = readSuccessMessage(data, "");

  if (status === 500) {
    return apiMessage && apiMessage !== "Internal server error"
      ? `${apiMessage} Please try again later.`
      : "Something went wrong on our side. Please try again later.";
  }

  if (status === 409) {
    return apiMessage || "A conflict occurred. Please try again.";
  }

  if (status === 400 || status === 422) {
    return apiMessage || "Please check your details and try again.";
  }

  if (apiMessage.length > 0) {
    return apiMessage;
  }

  return fallback;
}
