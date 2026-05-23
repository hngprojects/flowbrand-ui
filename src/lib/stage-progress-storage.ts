const STORAGE_KEY = "flowbrand:completed_stages";

function normalizeStageIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((id): id is string => typeof id === "string");
}

function readCompleted(): Record<string, string[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    const result: Record<string, string[]> = {};
    for (const [funnelId, stages] of Object.entries(parsed)) {
      if (typeof funnelId !== "string") continue;
      result[funnelId] = normalizeStageIds(stages);
    }
    return result;
  } catch {
    return {};
  }
}

function writeCompleted(all: Record<string, string[]>): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return true;
  } catch {
    return false;
  }
}

export function getCompletedStages(funnelId: string): string[] {
  return readCompleted()[funnelId] ?? [];
}

export function markStageComplete(funnelId: string, stageId: string): boolean {
  if (typeof window === "undefined") return false;
  const all = readCompleted();
  const existing = all[funnelId] ?? [];
  if (existing.includes(stageId)) return true;
  all[funnelId] = [...existing, stageId];
  return writeCompleted(all);
}

export function clearFunnelProgress(funnelId: string): void {
  if (typeof window === "undefined") return;
  const all = readCompleted();
  delete all[funnelId];
  writeCompleted(all);
}
