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

export const DEFAULT_UPLOADED_DOCS: MockUploadedDoc[] = [
  {
    id: "1",
    name: "Business-requirements.docx",
    size: "2.5MB",
    type: "DOCX",
  },
  {
    id: "2",
    name: "Business-strategy.pptx",
    size: "3.5MB",
    type: "PPT",
  },
  {
    id: "3",
    name: "Marketing-overview.pdf",
    size: "2.5MB",
    type: "PDF",
  },
];

export const DUMMY_STRATEGY_PHASES = [
  { title: "Get Noticed", tasks: "1/5 tasks this week" },
  { title: "Spark interest", tasks: "0/10 tasks this week" },
  { title: "Make first sale", tasks: "0/7 tasks this week" },
  { title: "Bring them back", tasks: "0/3 tasks this week" },
] as const;

export type FunnelTask = {
  id: string;
  title: string;
  description: string;
  resources: { label: string; href: string }[];
};

export const DUMMY_FUNNEL_FOCUS = {
  phase: "Get Noticed",
  progress: "1 of 4",
  subtitle:
    "To get noticed, help people discover your product for the first time, using these methods outlined below.",
};

export const DUMMY_FUNNEL_TASKS: FunnelTask[] = [
  {
    id: "clear-description",
    title: "Clear Description",
    description:
      "When describing your product, provide a comprehensive overview that highlights features and benefits for potential customers.",
    resources: [
      { label: "https://www.share-images.com", href: "#" },
      { label: "https://www.social-media-marketing.com", href: "#" },
    ],
  },
  {
    id: "post-weekly",
    title: "Post Weekly",
    description:
      "Share three captivating photos of your product each week. Consistent posting keeps your audience engaged and showcases what you sell.",
    resources: [{ label: "https://www.instagram.com/business", href: "#" }],
  },
  {
    id: "visual-proof",
    title: "Visual Proof",
    description:
      "Use before-and-after or behind-the-scenes visuals so new customers can quickly understand your offer.",
    resources: [{ label: "https://www.canva.com", href: "#" }],
  },
];

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
