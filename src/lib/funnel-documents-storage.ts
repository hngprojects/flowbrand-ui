import type { UploadedDocDisplay } from "@/lib/funnel-display";

const STORAGE_KEY = "flowbrand_funnel_documents_v1";

type FunnelDocumentsMap = Record<string, UploadedDocDisplay[]>;

function readMap(): FunnelDocumentsMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as FunnelDocumentsMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeMap(map: FunnelDocumentsMap): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

/** Persist upload metadata for a funnel (API does not return documents on GET /funnels/{id}). */
export function saveFunnelDocuments(
  funnelId: string,
  documents: UploadedDocDisplay[],
): void {
  if (!funnelId || documents.length === 0) return;
  const map = readMap();
  map[funnelId] = documents;
  writeMap(map);
}

export function loadFunnelDocuments(funnelId: string): UploadedDocDisplay[] {
  if (!funnelId) return [];
  return readMap()[funnelId] ?? [];
}

export function clearFunnelDocuments(funnelId: string): void {
  if (!funnelId) return;
  const map = readMap();
  if (!(funnelId in map)) return;
  delete map[funnelId];
  writeMap(map);
}
