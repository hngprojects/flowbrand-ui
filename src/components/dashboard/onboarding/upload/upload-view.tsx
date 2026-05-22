"use client";

import Image from "next/image";
import { useRef, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, X } from "lucide-react";
import { toast } from "sonner";
import {
  uploadFunnelDocuments,
  getFunnelUploadProgress,
} from "@/actions/funnels";
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

type UploadStatus = "uploading" | "parsing" | "ready" | "failed";

interface UploadedFile {
  id: string;
  uploadId?: string;
  file: File;
  progress: number;
  status: UploadStatus;
}

const ACCEPTED = ".doc,.docx,.pdf,.ppt,.pptx";
const MAX_MB = 5;
const MAX_FILES = 3;
const ALLOWED_EXTENSIONS = ["DOC", "DOCX", "PDF", "PPT", "PPTX"];
const PROGRESS_ORANGE = "#E88320";

function formatMB(bytes: number) {
  return (bytes / (1024 * 1024)).toFixed(1) + "MB";
}

function normalizeStatus(raw: unknown): UploadStatus {
  switch (raw) {
    case "uploading":
    case "parsing":
    case "ready":
    case "failed":
      return raw;
    default:
      return "parsing";
  }
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

function statusLabel(item: UploadedFile) {
  if (item.status === "ready") return formatMB(item.file.size);
  if (item.status === "failed") return "Failed";
  if (item.status === "uploading") return "Uploading…";
  return `${item.progress}% Processing`;
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
          <p className="truncate text-sm font-semibold text-[#101828]">
            {item.file.name}
          </p>
          <span className="shrink-0 text-sm text-[#667085]">
            {statusLabel(item)}
          </span>
        </div>

        <div className="mt-2.5 h-[5px] w-full overflow-hidden rounded-full bg-[#FDEBD6]">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${item.status === "ready" ? 100 : item.progress}%`,
              backgroundColor: PROGRESS_ORANGE,
            }}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="mt-0.5 shrink-0 text-[#D0D5DD] transition-colors hover:text-[#667085]"
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

  const pollIntervals = useRef<{ [key: string]: NodeJS.Timeout }>({});

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

  const pollProgress = useCallback(
    (rowId: string, uploadId: string, file: File) => {
      let attempts = 0;
      const MAX_ATTEMPTS = 20;

      const interval = setInterval(async () => {
        attempts += 1;
        try {
          const res = await getFunnelUploadProgress(uploadId);

          if (!res.ok) {
            clearInterval(interval);
            delete pollIntervals.current[rowId];
            setFiles((prev) =>
              prev.map((f) =>
                f.id === rowId ? { ...f, status: "failed" } : f,
              ),
            );
            toast.error(res.error);
            return;
          }

          const body = res.data as {
            status?: string;
            percentComplete?: number;
            data?: { status?: string; percentComplete?: number };
          };
          const node = body?.data ?? body;
          const pct =
            typeof node.percentComplete === "number" ? node.percentComplete : 0;
          const status = normalizeStatus(node.status);

          setFiles((prev) =>
            prev.map((f) =>
              f.id === rowId ? { ...f, progress: pct, status } : f,
            ),
          );

          if (status === "ready" || status === "failed") {
            clearInterval(interval);
            delete pollIntervals.current[rowId];
            if (status === "ready") {
              addUploadedDocument({
                id: uploadId,
                name: file.name,
                size: formatFileSize(file.size),
                type: fileNameToDocType(file.name),
              });
            } else {
              toast.error(`${file.name} failed to process.`);
            }
            return;
          }

          if (attempts >= MAX_ATTEMPTS) {
            clearInterval(interval);
            delete pollIntervals.current[rowId];
            setFiles((prev) =>
              prev.map((f) =>
                f.id === rowId ? { ...f, status: "failed" } : f,
              ),
            );
            toast.error(`${file.name} is taking too long. Please try again.`);
          }
        } catch {
          clearInterval(interval);
          delete pollIntervals.current[rowId];
          setFiles((prev) =>
            prev.map((f) => (f.id === rowId ? { ...f, status: "failed" } : f)),
          );
          toast.error(`${file.name}: could not check upload progress.`);
        }
      }, 1500);

      pollIntervals.current[rowId] = interval;
    },
    [addUploadedDocument],
  );

  const removeFile = (id: string) => {
    if (pollIntervals.current[id]) {
      clearInterval(pollIntervals.current[id]);
      delete pollIntervals.current[id];
    }
    const row = files.find((f) => f.id === id);
    if (row?.uploadId) removeUploadedDocument(row.uploadId);
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const addFiles = useCallback(
    async (incoming: FileList | null) => {
      if (!incoming) return;

      const candidates = Array.from(incoming).filter((file) => {
        const ext = fileExt(file.name);
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
          toast.error(`${file.name}: unsupported file type`);
          return false;
        }
        if (file.size > MAX_MB * 1024 * 1024) {
          toast.error(`${file.name}: exceeds ${MAX_MB}MB`);
          return false;
        }
        return true;
      });

      if (candidates.length === 0) return;

      const remainingSlots = MAX_FILES - files.length;
      if (remainingSlots <= 0) {
        toast.error(`You can upload up to ${MAX_FILES} files.`);
        return;
      }

      const toUpload = candidates.slice(0, remainingSlots);
      if (toUpload.length < candidates.length) {
        toast.error(`Only ${MAX_FILES} files allowed. Some were skipped.`);
      }

      const rows: UploadedFile[] = toUpload.map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        progress: 0,
        status: "uploading",
      }));
      setFiles((prev) => [...prev, ...rows]);

      const form = new FormData();
      toUpload.forEach((file) => form.append("files", file));

      try {
        const res = await uploadFunnelDocuments(form);
        if (!res.ok) {
          toast.error(res.error);
          setFiles((prev) =>
            prev.map((f) =>
              rows.some((r) => r.id === f.id) ? { ...f, status: "failed" } : f,
            ),
          );
          return;
        }

        type UploadEntry = {
          uploadId: string;
          fileName: string;
          status: string;
          percentComplete: number;
        };
        const body = res.data as {
          uploads?: UploadEntry[];
          data?: {
            uploads?: UploadEntry[];
            data?: { uploads?: UploadEntry[] };
          };
        };
        const uploads: UploadEntry[] =
          body?.data?.data?.uploads ??
          body?.data?.uploads ??
          body?.uploads ??
          [];

        const usedIdx = new Set<number>();
        const rowToUpload = new Map<string, UploadEntry>();
        for (const r of rows) {
          const matchIdx = uploads.findIndex(
            (u, i) => !usedIdx.has(i) && u.fileName === r.file.name,
          );
          if (matchIdx !== -1) {
            usedIdx.add(matchIdx);
            rowToUpload.set(r.id, uploads[matchIdx]);
          }
        }

        setFiles((prev) =>
          prev.map((f) => {
            if (!rows.some((r) => r.id === f.id)) return f;
            const up = rowToUpload.get(f.id);
            if (!up) return { ...f, status: "failed" };
            return {
              ...f,
              uploadId: up.uploadId,
              progress: up.percentComplete ?? 0,
              status: normalizeStatus(up.status),
            };
          }),
        );

        rows.forEach((r) => {
          const up = rowToUpload.get(r.id);
          if (!up) return;
          const status = normalizeStatus(up.status);
          if (status === "ready") {
            addUploadedDocument({
              id: up.uploadId,
              name: r.file.name,
              size: formatFileSize(r.file.size),
              type: fileNameToDocType(r.file.name),
            });
          } else if (status !== "failed") {
            pollProgress(r.id, up.uploadId, r.file);
          }
        });
      } catch {
        toast.error("Could not upload your documents. Please try again.");
        setFiles((prev) =>
          prev.map((f) =>
            rows.some((r) => r.id === f.id) ? { ...f, status: "failed" } : f,
          ),
        );
      }
    },
    [files.length, pollProgress, addUploadedDocument],
  );

  useEffect(() => {
    const intervals = pollIntervals.current;
    return () => {
      Object.values(intervals).forEach(clearInterval);
    };
  }, []);

  const hasFiles = files.length > 0;
  const allDone = hasFiles && files.every((f) => f.status === "ready");

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
                <FileRow key={item.id} item={item} onRemove={removeFile} />
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
