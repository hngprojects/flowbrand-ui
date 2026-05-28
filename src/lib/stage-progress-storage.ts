const STORAGE_KEY = "flowbrand:completed_stages";

function readCompleted(): Record<string, string[]> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as Record<
      string,
      string[]
    >;
  } catch {
    return {};
  }
}

export function getCompletedStages(funnelId: string): string[] {
  return readCompleted()[funnelId] ?? [];
}

export function markStageComplete(funnelId: string, stageId: string): void {
  if (typeof window === "undefined") return;
  const all = readCompleted();
  const existing = all[funnelId] ?? [];
  if (existing.includes(stageId)) return;
  all[funnelId] = [...existing, stageId];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function clearFunnelProgress(funnelId: string): void {
  if (typeof window === "undefined") return;
  const all = readCompleted();
  delete all[funnelId];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}
