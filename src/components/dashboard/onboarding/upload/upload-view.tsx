"use client";

import { useGenerateFunnel, useUploadDocuments } from "@/app/hooks/useFunnels";

import { useRef, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileUp, ChevronRight, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DocsImg } from "@/components/icons/docs-img";
import { PptImg } from "@/components/icons/ppt-img";
import { PdfImg } from "@/components/icons/pdf-img";
import { fileNameToDocType, formatFileSize } from "@/lib/dashboard-mock-data";
import {
  buildSessionFromOnboarding,
  saveDashboardMockSession,
} from "@/lib/dashboard-mock-session";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { FUNNEL_ROUTE, ONBOARDING_QUESTIONS_ROUTE } from "@/routes";
import {
  uploadFunnelDocuments,
  getFunnelUploadProgress,
} from "@/actions/funnels";
import { cn } from "@/lib/utils";

type UploadStatus = "uploading" | "parsing" | "ready" | "failed";

interface UploadedFile {
  id: string;
  uploadId?: string;
  file: File;
  progress: number;
  status: UploadStatus;
}

// const uploadMutation = useUploadDocuments();

const ACCEPTED = ".doc,.docx,.pdf,.ppt,.pptx";
const MAX_MB = 5;
const MAX_FILES = 3;
const ALLOWED_EXTENSIONS = ["DOC", "DOCX", "PDF", "PPT", "PPTX"];

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
  if (ext === "PDF") return <PdfImg className="h-8 w-8 shrink-0" />;
  if (ext === "PPT" || ext === "PPTX")
    return <PptImg className="h-8 w-8 shrink-0" />;
  return <DocsImg className="h-8 w-8 shrink-0" />;
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
          <p className="truncate text-sm font-medium text-[#1F2937]">
            {item.file.name}
          </p>
          <span className="shrink-0 text-sm text-[#6B7280]">
            {statusLabel(item)}
          </span>
        </div>

        <div className="mt-2 h-[6px] w-full overflow-hidden rounded-full bg-[#F3F4F6]">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300",
              item.status === "failed" ? "bg-red-500" : "bg-[#F59E0B]",
            )}
            style={{
              width: `${item.status === "ready" ? 100 : item.progress}%`,
            }}
          />
        </div>

        {item.status !== "ready" && (
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
  const uploadMutation = useUploadDocuments();
  const generateMutation = useGenerateFunnel();
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

  const goToFunnel = useCallback(asy() => {
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
    toast.success("Documents uploaded. Building your strategy…");
    const generated = await generateMutation.mutateAsync({
  businessDescription: state.businessDescription,
  theyAre: state.theyAre,
});
    router.push(FUNNEL_ROUTE);
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
        const res = await uploadMutation.mutateAsync(form);
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

  const removeFile = (id: string) => {
    if (pollIntervals.current[id]) {
      clearInterval(pollIntervals.current[id]);
      delete pollIntervals.current[id];
    }
    const row = files.find((f) => f.id === id);
    if (row?.uploadId) removeUploadedDocument(row.uploadId);
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

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
