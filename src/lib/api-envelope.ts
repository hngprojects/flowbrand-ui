/** Shared helpers for staging API envelopes ({ success, data, statusCode, message }). */

export function readRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object") return null;
  return value as Record<string, unknown>;
}

/** Walk root, data, result, funnel, and nested objects for parser hits. */
export function collectApiRecords(data: unknown): Record<string, unknown>[] {
  const records: Record<string, unknown>[] = [];
  const seen = new Set<unknown>();

  const visit = (value: unknown) => {
    const record = readRecord(value);
    if (!record || seen.has(record)) return;
    seen.add(record);
    records.push(record);
    visit(record.data);
    visit(record.result);
    visit(record.funnel);
  };

  visit(data);
  return records;
}

export function readApiMessage(data: unknown): string | null {
  for (const record of collectApiRecords(data)) {
    if (typeof record.message === "string" && record.message.trim()) {
      return record.message.trim();
    }
  }
  return null;
}
