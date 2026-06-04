import type { ReactNode } from "react";
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
    id: "seil-agrifood",
    href: "/files/Seil_AgriFood_Templates.pdf",
    filename: "Seil_AgriFood_Templates.pdf",
    label: "AgriFood",
    icon: PdfImg,
  },
  {
    id: "seil-fintech",
    href: "/files/Seil_Fintech_Template.pdf",
    filename: "Seil_Fintech_Template.pdf",
    label: "Fintech",
    icon: PdfImg,
  },
  {
    id: "seil-health-wellness",
    href: "/files/Seil_Health_and_Wellness_Template.pdf",
    filename: "Seil_Health_and_Wellness_Template.pdf",
    label: "Health & Wellness",
    icon: PdfImg,
  },
  {
    id: "seil-retail-fashion",
    href: "/files/Seil_Retail_and_Fashion_Template.pdf",
    filename: "Seil_Retail_and_Fashion_Template.pdf",
    label: "Retail & Fashion",
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
