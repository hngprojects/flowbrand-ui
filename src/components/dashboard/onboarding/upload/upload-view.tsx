"use client";

import Image from "next/image";
import { useRef, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { WideDashedBorder } from "@/components/dashboard/wide-dashed-border";
import { DocsImg } from "@/components/icons/docs-img";
import { PptImg } from "@/components/icons/ppt-img";
import { PdfImg } from "@/components/icons/pdf-img";
import { showStrategyPreviewToast } from "@/lib/strategy-preview-toast";
import { fileNameToDocType, formatFileSize } from "@/lib/dashboard-mock-data";
import {
  buildSessionFromOnboarding,
  saveDashboardMockSession,
} from "@/lib/dashboard-mock-session";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { STRATEGY_ROUTE, ONBOARDING_QUESTIONS_ROUTE } from "@/routes";
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
const PROGRESS_ORANGE = "#E88320";

function formatMB(bytes: number) {
  return (bytes / (1024 * 1024)).toFixed(1) + "MB";
}

function fileExt(name: string) {
  return name.split(".").pop()?.toUpperCase() ?? "FILE";
}

function FileTypeIcon({ ext }: { ext: string }) {
  if (ext === "PDF") return <PdfImg className="h-10 w-10 shrink-0" />;
  if (ext === "PPT" || ext === "PPTX")
    return <PptImg className="h-10 w-10 shrink-0" />;
  return <DocsImg className="h-10 w-10 shrink-0" />;
}

function FileRow({ item }: { item: UploadedFile }) {
  const ext = fileExt(item.file.name);

  return (
    <div className="flex items-start gap-3 py-1">
      <FileTypeIcon ext={ext} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-sm font-semibold text-[#101828]">
            {item.file.name}
          </p>
          <span className="shrink-0 text-sm text-[#667085]">
            {item.done
              ? formatMB(item.file.size)
              : `${item.progress}% Uploading`}
          </span>
        </div>

        <div className="mt-2.5 h-[5px] w-full overflow-hidden rounded-full bg-[#FDEBD6]">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${item.done ? 100 : item.progress}%`,
              backgroundColor: PROGRESS_ORANGE,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function UploadView() {
  const router = useRouter();
  const addUploadedDocument = useOnboardingStore((s) => s.addUploadedDocument);
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragging, setDragging] = useState(false);

  const uploadIntervals = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const goToQuestions = useCallback(() => {
    router.push(ONBOARDING_QUESTIONS_ROUTE);
  }, [router]);

  const goToStrategy = useCallback(() => {
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
    showStrategyPreviewToast();
    router.push(STRATEGY_ROUTE);
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
              f.id === id ? { ...f, done: true, progress: 100 } : f,
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
      <div className="mx-auto flex w-full max-w-[640px] flex-col items-center px-4 py-10 md:py-14">
        <h1 className="mb-2 text-center text-[26px] font-semibold leading-tight tracking-tight text-[#101828] md:text-[32px]">
          Start creating your marketing strategy
        </h1>
        <p className="mb-8 max-w-md text-center text-sm text-[#667085] md:mb-10 md:text-[15px]">
          Create marketing strategy tailored to your business needs.
        </p>

        <div className="w-full rounded-2xl border border-[#EAECF0] bg-white p-5 shadow-[0px_4px_24px_rgba(16,24,40,0.06)] md:p-8">
          <WideDashedBorder active={dragging}>
            <div
              role="button"
              tabIndex={0}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  inputRef.current?.click();
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
                "flex cursor-pointer flex-col items-center justify-center rounded-xl px-4 py-10 transition-colors md:py-12",
                dragging ? "bg-[#F0F5FD]" : "bg-white hover:bg-[#FAFBFC]",
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
              <Image
                src="/images/upload.svg"
                alt=""
                width={80}
                height={80}
                className="mb-5 h-[72px] w-[72px] md:h-20 md:w-20"
                priority
              />
              <p className="text-center text-[15px] font-semibold text-[#101828] md:text-base">
                <span className="md:hidden">
                  Upload your business documents
                </span>
                <span className="hidden md:inline">
                  Upload your business identity documents
                </span>
              </p>
              <p className="mt-1.5 text-center text-xs text-[#98A2B3] md:text-[13px]">
                Supports Doc, Docx, PDF, PPT, PPTX - Max 5.0MB
              </p>
            </div>
          </WideDashedBorder>

          {hasFiles && (
            <div className="mt-6 flex flex-col gap-5">
              {files.map((item) => (
                <FileRow key={item.id} item={item} />
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={goToStrategy}
            disabled={!allDone}
            className={cn(
              "mt-6 h-[52px] w-full rounded-xl text-base font-semibold transition-colors",
              allDone
                ? "cursor-pointer bg-[#326AD1] text-white hover:bg-[#2859B8]"
                : "cursor-not-allowed bg-[#E8EDF5] text-[#326AD1]",
            )}
          >
            Create my strategy
          </button>

          <button
            type="button"
            onClick={goToQuestions}
            className="mt-4 flex w-full cursor-pointer items-center justify-center gap-0.5 text-sm text-[#667085] transition-colors hover:text-[#344054]"
          >
            Don&apos;t know what to do? Click here
            <ChevronRight size={16} className="text-[#98A2B3]" />
          </button>
        </div>

        <button
          type="button"
          onClick={goToQuestions}
          className={cn(
            "mt-5 flex w-full cursor-pointer items-center gap-4 rounded-2xl border border-[#EAECF0] bg-white px-5 py-5",
            "shadow-[0px_4px_24px_rgba(16,24,40,0.06)] transition-colors hover:bg-[#FAFBFC]",
          )}
        >
          <Image
            src="/images/upload2.svg"
            alt=""
            width={48}
            height={48}
            className="h-12 w-12 shrink-0"
          />
          <div className="min-w-0 flex-1 text-left">
            <p className="text-[15px] font-semibold leading-snug text-[#101828]">
              Don&apos;t have a document to upload? Create your strategy another
              way.
            </p>
            <p className="mt-1 text-sm text-[#667085]">
              Create your marketing strategy without the need to upload a
              document.
            </p>
          </div>
          <ChevronRight size={20} className="shrink-0 text-[#98A2B3]" />
        </button>
      </div>
    </main>
  );
}
