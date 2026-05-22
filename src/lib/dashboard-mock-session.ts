import {
  buildBusinessSummary,
  buildIdealCustomerSummary,
  type DashboardMockSession,
  type MockUploadedDoc,
} from "@/lib/dashboard-mock-data";

const SESSION_KEY = "flowbrand-dashboard-mock-session";

export function saveDashboardMockSession(session: DashboardMockSession): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearDashboardMockSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
}

export function loadDashboardMockSession(): DashboardMockSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DashboardMockSession;
  } catch {
    return null;
  }
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
