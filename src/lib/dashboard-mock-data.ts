export type MockDocType = "DOC" | "DOCX" | "PDF" | "PPT" | "PPTX";

export type MockUploadedDoc = {
  id: string;
  name: string;
  size: string;
  type: MockDocType;
};

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
