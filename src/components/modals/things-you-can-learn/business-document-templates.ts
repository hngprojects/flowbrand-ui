import type { ReactNode } from "react";
import { DocsImg } from "@/components/icons/docs-img";
import { PdfImg } from "@/components/icons/pdf-img";

export type BusinessDocumentTemplate = {
  id: string;
  href: string;
  filename: string;
  label: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => ReactNode;
};

export const BUSINESS_DOCUMENT_TEMPLATES: BusinessDocumentTemplate[] = [
  {
    id: "glowlab-docx",
    href: "/files/GlowLab_Skincare_Business_Document_2026.docx",
    filename: "GlowLab_Skincare_Business_Document_2026.docx",
    label: "DOCX",
    icon: DocsImg,
  },
  {
    id: "hoopgear-pdf",
    href: "/files/HoopGearPro_Business_Document_2026.pdf",
    filename: "HoopGearPro_Business_Document_2026.pdf",
    label: "PDF",
    icon: PdfImg,
  },
];

export function downloadBusinessDocument(file: BusinessDocumentTemplate) {
  const link = document.createElement("a");
  link.href = file.href;
  link.download = file.filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}
