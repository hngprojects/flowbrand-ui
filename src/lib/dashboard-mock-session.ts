import {
  buildBusinessSummary,
  buildIdealCustomerSummary,
  DEFAULT_TRAFFIC_CHANNEL,
  DEFAULT_UPLOADED_DOCS,
  type DashboardMockSession,
  type MockUploadedDoc,
} from "@/lib/dashboard-mock-data";

const SESSION_KEY = "flowbrand-dashboard-mock-session";

export function saveDashboardMockSession(session: DashboardMockSession): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
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
  const docs =
    input.uploadedDocuments.length > 0
      ? input.uploadedDocuments
      : DEFAULT_UPLOADED_DOCS;

  return {
    businessDescription: buildBusinessSummary(input.businessDescription),
    idealCustomerSummary: buildIdealCustomerSummary({
      theyAre: input.theyAre,
      whoWantTo: input.whoWantTo,
      locatedIn: input.locatedIn,
      customInput: input.customCustomerInput,
    }),
    trafficChannel: input.trafficChannel.trim() || DEFAULT_TRAFFIC_CHANNEL,
    uploadedDocuments: docs,
    completedAt: new Date().toISOString(),
  };
}

export function getDashboardMockSessionOrDefaults(): DashboardMockSession {
  return (
    loadDashboardMockSession() ?? {
      businessDescription: buildBusinessSummary(""),
      idealCustomerSummary: buildIdealCustomerSummary({
        theyAre: [],
        whoWantTo: [],
        locatedIn: [],
        customInput: "",
      }),
      trafficChannel: DEFAULT_TRAFFIC_CHANNEL,
      uploadedDocuments: DEFAULT_UPLOADED_DOCS,
      completedAt: new Date().toISOString(),
    }
  );
}
