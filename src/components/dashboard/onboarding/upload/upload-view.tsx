"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileUp, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocsImg } from "@/components/icons/docs-img";
import { PptImg } from "@/components/icons/ppt-img";
import { PdfImg } from "@/components/icons/pdf-img";
import { showFunnelPreviewToast } from "@/lib/funnel-preview-toast";
import { fileNameToDocType, formatFileSize } from "@/lib/dashboard-mock-data";
import {
  buildSessionFromOnboarding,
  saveDashboardMockSession,
} from "@/lib/dashboard-mock-session";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { FUNNEL_ROUTE, ONBOARDING_QUESTIONS_ROUTE } from "@/routes";
import { cn } from "@/lib/utils";

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  done: boolean;
}

const ACCEPTED = ".doc,.docx,.pdf,.ppt,.pptx";
const MAX_MB = 5;
const ALLOWED_EXTENSIONS = ["DOC", "DOCX", "PDF", "PPT", "PPTX"];

function formatMB(bytes: number) {
  return (bytes / (1024 * 1024)).toFixed(1) + "MB";
}

function fileExt(name: string) {
  return name.split(".").pop()?.toUpperCase() ?? "FILE";
}

function FileTypeIcon({ ext }: { ext: string }) {
  if (ext === "PDF") return <PdfImg className="h-8 w-8 shrink-0" />;
  if (ext === "PPT" || ext === "PPTX")
    return <PptImg className="h-8 w-8 shrink-0" />;
  return <DocsImg className="h-8 w-8 shrink-0" />;
}

function FileRow({
  item,
  onRemove,
}: {
  item: UploadedFile;
  onRemove: (id: string) => void;
}) {
  const ext = fileExt(item.file.name);

  return (
    <div className="flex items-start gap-3 py-1">
      <FileTypeIcon ext={ext} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-sm font-medium text-[#1F2937]">
            {item.file.name}
          </p>
          <span className="shrink-0 text-sm text-[#6B7280]">
            {item.done
              ? formatMB(item.file.size)
              : `${item.progress}% Uploading`}
          </span>
        </div>

        <div className="mt-2 h-[6px] w-full overflow-hidden rounded-full bg-[#F3F4F6]">
          <div
            className="h-full rounded-full bg-[#F59E0B] transition-all duration-300"
            style={{ width: `${item.done ? 100 : item.progress}%` }}
          />
        </div>

        {!item.done && (
          <p className="mt-1 text-xs text-[#9CA3AF]">
            {formatMB(item.file.size)}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="mt-0.5 shrink-0 text-[#D1D5DB] transition-colors hover:text-[#6B7280]"
        aria-label="Remove file"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function UploadView() {
  const router = useRouter();
  const addUploadedDocument = useOnboardingStore((s) => s.addUploadedDocument);
  const removeUploadedDocument = useOnboardingStore(
    (s) => s.removeUploadedDocument,
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragging, setDragging] = useState(false);

  const uploadIntervals = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const goToQuestions = useCallback(() => {
    router.push(ONBOARDING_QUESTIONS_ROUTE);
  }, [router]);

  const goToFunnel = useCallback(() => {
    const state = useOnboardingStore.getState();
    saveDashboardMockSession(
      buildSessionFromOnboarding({
        businessDescription: state.businessDescription,
        theyAre: state.theyAre,
        whoWantTo: state.whoWantTo,
        locatedIn: state.locatedIn,
        customCustomerInput: state.customCustomerInput,
        trafficChannel: state.trafficChannel,
        uploadedDocuments: state.uploadedDocuments,
      }),
    );
    showFunnelPreviewToast();
    router.push(FUNNEL_ROUTE);
  }, [router]);

  const simulateUpload = useCallback(
    (id: string) => {
      let progress = 0;

      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 18) + 8;

        setFiles((prev) =>
          prev.map((f) =>
            f.id === id ? { ...f, progress: Math.min(progress, 100) } : f,
          ),
        );

        if (progress >= 100) {
          clearInterval(interval);
          setFiles((prev) => {
            const updated = prev.map((f) =>
              f.id === id ? { ...f, done: true } : f,
            );
            const finished = updated.find((f) => f.id === id);
            if (finished) {
              addUploadedDocument({
                id: finished.id,
                name: finished.file.name,
                size: formatFileSize(finished.file.size),
                type: fileNameToDocType(finished.file.name),
              });
            }
            return updated;
          });
          delete uploadIntervals.current[id];
        }
      }, 350);

      uploadIntervals.current[id] = interval;
    },
    [addUploadedDocument],
  );

  const addFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming) return;

      Array.from(incoming).forEach((file) => {
        const ext = fileExt(file.name);
        if (!ALLOWED_EXTENSIONS.includes(ext)) return;
        if (file.size > MAX_MB * 1024 * 1024) return;

        const id = `${file.name}-${Date.now()}-${Math.random()}`;
        setFiles((prev) => [...prev, { id, file, progress: 0, done: false }]);
        simulateUpload(id);
      });
    },
    [simulateUpload],
  );

  const removeFile = (id: string) => {
    if (uploadIntervals.current[id]) {
      clearInterval(uploadIntervals.current[id]);
      delete uploadIntervals.current[id];
    }
    removeUploadedDocument(id);
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  useEffect(() => {
    const intervals = uploadIntervals.current;
    return () => {
      Object.values(intervals).forEach(clearInterval);
    };
  }, []);

  const hasFiles = files.length > 0;
  const allDone = hasFiles && files.every((f) => f.done);

  return (
    <main className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-[640px] flex-col items-center px-4 py-12 md:py-16">
        <h1 className="mb-2 text-center text-[28px] font-semibold leading-tight text-[#111827] md:text-[32px]">
          Start creating your marketing strategy
        </h1>
        <p className="mb-8 max-w-md text-center text-sm text-[#6B7280] md:mb-10 md:text-base">
          Create marketing strategy tailored to your business needs.
        </p>

        <div className="w-full rounded-2xl border border-[#F3F4F6] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] md:p-8">
          <div
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              addFiles(e.dataTransfer.files);
            }}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-10 transition-colors",
              dragging
                ? "border-primary bg-primary-50"
                : "border-[#E5E7EB] bg-white hover:border-primary-300 hover:bg-[#FAFBFC]",
            )}
          >
            <input
              ref={inputRef}
              type="file"
              multiple
              accept={ACCEPTED}
              className="hidden"
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary shadow-sm">
              <FileUp className="h-7 w-7 text-white" strokeWidth={1.8} />
            </div>
            <p className="text-center text-base font-semibold text-[#111827]">
              Upload your business identity documents
            </p>
            <p className="mt-1 text-center text-xs text-[#9CA3AF]">
              Supports Doc, Docx, PDF, PPT, PPTX . Max 5.0MB
            </p>
          </div>

          {hasFiles && (
            <div className="mt-6 flex flex-col gap-4 border-t border-[#F3F4F6] pt-6">
              {files.map((item) => (
                <FileRow key={item.id} item={item} onRemove={removeFile} />
              ))}
            </div>
          )}

          <Button
            type="button"
            onClick={goToFunnel}
            disabled={!allDone}
            className="mt-6 h-auto w-full rounded-[10px] bg-primary py-4 text-base font-semibold text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Create my strategy
          </Button>

          <button
            type="button"
            onClick={goToQuestions}
            className="mt-4 flex w-full cursor-pointer items-center justify-center gap-0.5 text-sm text-[#6B7280] transition-colors hover:text-[#374151]"
          >
            Don&apos;t know what to do? Click here
            <ChevronRight size={16} className="text-[#9CA3AF]" />
          </button>
        </div>

        <button
          type="button"
          onClick={goToQuestions}
          className={cn(
            "mt-6 flex w-full cursor-pointer items-center gap-4 rounded-2xl border border-[#F3F4F6] bg-white px-5 py-5",
            "shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-colors hover:bg-[#FAFBFC] hover:cursor-pointer",
          )}
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white">
            <FileUp size={20} className="text-[#9CA3AF]" strokeWidth={1.8} />
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="text-[15px] font-semibold leading-snug text-[#111827]">
              Don&apos;t have a document to upload? Create your funnel another
              way.
            </p>
            <p className="mt-1 text-sm text-[#6B7280]">
              Create your marketing strategy without the need to upload a
              document.
            </p>
          </div>
          <ChevronRight size={20} className="shrink-0 text-[#9CA3AF]" />
        </button>
      </div>
    </main>
  );
}
