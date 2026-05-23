import {
  buildBusinessSummary,
  buildIdealCustomerSummary,
  type DashboardMockSession,
  type MockUploadedDoc,
} from "@/lib/dashboard-mock-data";

export type { DashboardMockSession, MockUploadedDoc };

const SESSION_KEY = "flowbrand-dashboard-mock-session";
const SESSION_CHANGE_EVENT = "flowbrand-dashboard-mock-session-change";

let cachedRaw: string | null | undefined;
let cachedSnapshot: DashboardMockSession | null = null;

function invalidateSnapshotCache(): void {
  cachedRaw = undefined;
}

function notifySessionChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
}

/** Stable snapshot for useSyncExternalStore (same reference while storage unchanged). */
export function getDashboardMockSessionSnapshot(): DashboardMockSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw === cachedRaw) return cachedSnapshot;
    cachedRaw = raw;
    if (!raw) {
      cachedSnapshot = null;
      return null;
    }
    cachedSnapshot = JSON.parse(raw) as DashboardMockSession;
    return cachedSnapshot;
  } catch {
    cachedSnapshot = null;
    cachedRaw = null;
    return null;
  }
}

export function subscribeDashboardMockSession(
  onStoreChange: () => void,
): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => onStoreChange();
  window.addEventListener(SESSION_CHANGE_EVENT, handler);
  return () => window.removeEventListener(SESSION_CHANGE_EVENT, handler);
}

export function saveDashboardMockSession(session: DashboardMockSession): void {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(session);
  sessionStorage.setItem(SESSION_KEY, raw);
  cachedRaw = raw;
  cachedSnapshot = session;
  notifySessionChange();
}

export function clearDashboardMockSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
  invalidateSnapshotCache();
  cachedSnapshot = null;
  cachedRaw = null;
  notifySessionChange();
}

export function loadDashboardMockSession(): DashboardMockSession | null {
  return getDashboardMockSessionSnapshot();
}

export function buildSessionFromOnboarding(input: {
  businessDescription: string;
  theyAre: string[];
  whoWantTo: string[];
  locatedIn: string[];
  customCustomerInput: string;
  trafficChannel: string;
  uploadedDocuments: MockUploadedDoc[];
}): DashboardMockSession {
  return {
    businessDescription: buildBusinessSummary(input.businessDescription),
    idealCustomerSummary: buildIdealCustomerSummary({
      theyAre: input.theyAre,
      whoWantTo: input.whoWantTo,
      locatedIn: input.locatedIn,
      customInput: input.customCustomerInput,
    }),
    trafficChannel: input.trafficChannel.trim(),
    uploadedDocuments: input.uploadedDocuments,
    completedAt: new Date().toISOString(),
  };
}
