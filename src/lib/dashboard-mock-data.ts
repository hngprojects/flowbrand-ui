export type MockDocType = "DOC" | "DOCX" | "PDF" | "PPT" | "PPTX";

export type MockUploadedDoc = {
  id: string;
  name: string;
  size: string;
  type: MockDocType;
};

export type DashboardMockSession = {
  businessDescription: string;
  idealCustomerSummary: string;
  trafficChannel: string;
  uploadedDocuments: MockUploadedDoc[];
  completedAt: string;
};

export const DEFAULT_BUSINESS_SUMMARY =
  "I sell small chops and pastries for events and walk-in customers who are typically young women in Lagos who want affordable snacks.";

export const DEFAULT_CUSTOMER_SUMMARY =
  "Young women in Lagos who want affordable snacks for events and walk-in purchases.";

export const DEFAULT_TRAFFIC_CHANNEL = "TikTok";

export function formatFileSize(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export function fileNameToDocType(name: string): MockDocType {
  const ext = name.split(".").pop()?.toUpperCase() ?? "DOC";
  if (ext === "DOCX") return "DOCX";
  if (ext === "PDF") return "PDF";
  if (ext === "PPT" || ext === "PPTX") return "PPT";
  return "DOC";
}

export function buildIdealCustomerSummary(input: {
  theyAre: string[];
  whoWantTo: string[];
  locatedIn: string[];
  customInput: string;
}): string {
  const parts: string[] = [];
  if (input.theyAre.length) parts.push(input.theyAre.join(", "));
  if (input.whoWantTo.length)
    parts.push(`who want to ${input.whoWantTo.join(", ")}`);
  if (input.locatedIn.length) parts.push(`in ${input.locatedIn.join(", ")}`);
  if (input.customInput.trim()) parts.push(input.customInput.trim());
  return parts.join(" ").trim() || DEFAULT_CUSTOMER_SUMMARY;
}

export function buildBusinessSummary(description: string): string {
  const trimmed = description.trim();
  return trimmed.length > 0 ? trimmed : DEFAULT_BUSINESS_SUMMARY;
}
