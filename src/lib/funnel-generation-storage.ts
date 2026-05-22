import type { FunnelSource } from "@/lib/funnel-api-types";

const STORAGE_KEY = "flowbrand_active_funnel_generation";

export type StoredFunnelGeneration = {
  funnelId: string;
  idempotencyKey: string;
  source: FunnelSource;
};

export function saveActiveFunnelGeneration(
  state: StoredFunnelGeneration,
): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadActiveFunnelGeneration(): StoredFunnelGeneration | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredFunnelGeneration;
    if (
      typeof parsed.funnelId === "string" &&
      typeof parsed.idempotencyKey === "string" &&
      (parsed.source === "wizard" || parsed.source === "document_upload")
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function clearActiveFunnelGeneration(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}
