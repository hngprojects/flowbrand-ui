import type { FunnelSource } from "@/lib/funnel-api-types";

const STORAGE_KEY = "flowbrand_active_funnel_generation";
const PENDING_KEY = "flowbrand_pending_generate";
const SKIP_AUTO_RESOLVE_KEY = "flowbrand_skip_strategy_auto_resolve";

export type StoredFunnelGeneration = {
  funnelId: string;
  idempotencyKey: string;
  source: FunnelSource;
  startedAt?: number;
};

export type PendingGenerationAttempt = {
  idempotencyKey: string;
  source: FunnelSource;
};

export function saveActiveFunnelGeneration(
  state: StoredFunnelGeneration,
): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  clearPendingGeneration();
  clearStrategyAutoResolveSkipped();
}

/** Set when the user cancels generation — blocks re-attaching an old in-flight funnel. */
export function markStrategyAutoResolveSkipped(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SKIP_AUTO_RESOLVE_KEY, "1");
}

export function clearStrategyAutoResolveSkipped(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SKIP_AUTO_RESOLVE_KEY);
}

export function shouldSkipStrategyAutoResolve(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SKIP_AUTO_RESOLVE_KEY) === "1";
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
      return {
        ...parsed,
        startedAt:
          typeof parsed.startedAt === "number" &&
          Number.isFinite(parsed.startedAt)
            ? parsed.startedAt
            : undefined,
      };
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

/** Reserve once per path; reuse on retry (per API idempotency contract). */
export function reserveIdempotencyKey(source: FunnelSource): string {
  if (typeof window === "undefined") return crypto.randomUUID();

  const pending = loadPendingGeneration();
  if (pending?.source === source) {
    return pending.idempotencyKey;
  }

  const idempotencyKey = crypto.randomUUID();
  sessionStorage.setItem(
    PENDING_KEY,
    JSON.stringify({
      idempotencyKey,
      source,
    } satisfies PendingGenerationAttempt),
  );
  return idempotencyKey;
}

export function loadPendingGeneration(): PendingGenerationAttempt | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingGenerationAttempt;
    if (
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

export function clearPendingGeneration(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(PENDING_KEY);
}
