"use client";

import { useCallback, useState } from "react";
import { Download } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";
import {
  BUSINESS_DOCUMENT_TEMPLATES,
  downloadBusinessDocument,
  type BusinessDocumentTemplate,
} from "@/components/modals/things-you-can-learn/business-document-templates";

function isTouchPrimaryDevice() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}

export function BusinessDocumentTemplatesFooter() {
  const [downloadPrompt, setDownloadPrompt] =
    useState<BusinessDocumentTemplate | null>(null);

  const handleTemplateActivate = useCallback(
    (template: BusinessDocumentTemplate) => {
      if (isTouchPrimaryDevice()) {
        setDownloadPrompt(template);
        return;
      }
      downloadBusinessDocument(template);
    },
    [],
  );

  const confirmDownload = useCallback(() => {
    if (!downloadPrompt) return;
    downloadBusinessDocument(downloadPrompt);
    setDownloadPrompt(null);
  }, [downloadPrompt]);

  return (
    <>
      <p className="text-sm text-black-300">Business document templates</p>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        {BUSINESS_DOCUMENT_TEMPLATES.map((template) => (
          <TemplateDownloadCard
            key={template.id}
            template={template}
            onActivate={handleTemplateActivate}
          />
        ))}
      </div>

      <Dialog
        open={downloadPrompt !== null}
        onOpenChange={(open) => !open && setDownloadPrompt(null)}
      >
        <DialogContent
          showCloseButton={false}
          className="w-[calc(100%-2rem)] max-w-[340px] rounded-2xl border border-primary-80 bg-white p-6"
          overlayClassName="bg-black-500/80"
        >
          <VisuallyHidden>
            <DialogTitle>Download file</DialogTitle>
          </VisuallyHidden>

          <div className="flex flex-col gap-4 text-center">
            <p className="text-base font-semibold text-black-500">
              Download file
            </p>
            <p className="text-sm text-black-300">{downloadPrompt?.filename}</p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={confirmDownload}
                className="h-11 w-full rounded-[10px] bg-primary-500 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Download
              </button>
              <button
                type="button"
                onClick={() => setDownloadPrompt(null)}
                className="h-11 w-full rounded-[10px] border border-primary-500 
                text-sm font-semibold text-primary-500 transition-colors hover:bg-primary-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function TemplateDownloadCard({
  template,
  onActivate,
}: {
  template: BusinessDocumentTemplate;
  onActivate: (template: BusinessDocumentTemplate) => void;
}) {
  const Icon = template.icon;

  return (
    <button
      type="button"
      onClick={() => onActivate(template)}
      className={cn(
        "group relative flex h-16 w-16 cursor-pointer items-center justify-center rounded-xl border border-neutral-200 bg-white shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
      )}
      aria-label={`Download ${template.filename}`}
    >
      <Icon className="h-10 w-10" aria-hidden />

      <span
        className={cn(
          "pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-black-500/70 opacity-0 transition-opacity duration-200",
          "group-hover:opacity-100 group-focus-visible:opacity-100",
        )}
        aria-hidden
      >
        <Download className="size-6 text-white" strokeWidth={2} />
      </span>
    </button>
  );
}
