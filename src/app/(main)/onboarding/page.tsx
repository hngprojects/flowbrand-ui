"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileUp, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const WIZARD_ROUTE = ["", "onboarding", "step-1"].join("/");

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

function extColor(ext: string) {
  if (ext === "PDF") return "bg-red-500";
  if (ext === "PPT" || ext === "PPTX") return "bg-orange-500";
  return "bg-blue-500";
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
    <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
      <div className="relative mt-0.5 flex h-10 w-8 shrink-0 flex-col items-center justify-end rounded border border-gray-200 bg-gray-50 pb-1 dark:border-gray-700 dark:bg-gray-800">
        <span
          className={`rounded px-1 py-0.5 text-[9px] font-bold text-white ${extColor(ext)}`}
        >
          {ext}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-100">
            {item.file.name}
          </p>
          <span className="shrink-0 text-sm text-gray-500 dark:text-gray-400">
            {item.done ? formatMB(item.file.size) : `${item.progress}% Uploading`}
          </span>
        </div>

        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
          <div
            className="h-full rounded-full bg-amber-400 transition-all duration-300"
            style={{ width: `${item.progress}%` }}
          />
        </div>

        {!item.done && (
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-600">
            {formatMB(item.file.size)}
          </p>
        )}
      </div>

      <button
        onClick={() => onRemove(item.id)}
        className="mt-1 shrink-0 text-gray-300 transition-colors hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-400"
        aria-label="Remove file"
      >
        <X size={15} />
      </button>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragging, setDragging] = useState(false);

  // Store intervals to clear on remove/unmount
  const uploadIntervals = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const goToWizard = useCallback(() => {
    router.push(WIZARD_ROUTE);
  }, [router]);

  const simulateUpload = useCallback((id: string) => {
    let progress = 0;

    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 18) + 8;

      setFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? { ...f, progress: Math.min(progress, 100) }
            : f
        )
      );

      if (progress >= 100) {
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f) => (f.id === id ? { ...f, done: true } : f))
        );
        delete uploadIntervals.current[id];
      }
    }, 350);

    uploadIntervals.current[id] = interval;
  }, []);

  const addFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming) return;

      Array.from(incoming).forEach((file) => {
        const ext = fileExt(file.name);
        if (!ALLOWED_EXTENSIONS.includes(ext)) return; // enforce type
        if (file.size > MAX_MB * 1024 * 1024) return; // enforce size

        const id = `${file.name}-${Date.now()}-${Math.random()}`;
        setFiles((prev) => [...prev, { id, file, progress: 0, done: false }]);
        simulateUpload(id);
      });
    },
    [simulateUpload]
  );

  const removeFile = (id: string) => {
    if (uploadIntervals.current[id]) {
      clearInterval(uploadIntervals.current[id]);
      delete uploadIntervals.current[id];
    }
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Clear all intervals on unmount
  useEffect(() => {
    return () => {
      Object.values(uploadIntervals.current).forEach(clearInterval);
    };
  }, []);

  const hasFiles = files.length > 0;
  const allDone = hasFiles && files.every((f) => f.done);

  return (
    <main className="min-h-screen bg-[#F7F8FA] dark:bg-gray-950">
      <div className="mx-auto flex w-full max-w-[620px] flex-col items-center px-4 py-14 md:py-20">
        <h1 className="mb-2 text-center text-3xl font-semibold text-gray-900 dark:text-gray-100 md:text-4xl">
          Start creating your marketing strategy
        </h1>
        <p className="mb-10 text-center text-sm text-gray-600 dark:text-gray-400">
          Create marketing strategy tailored to your business needs.
        </p>

        <div className="w-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
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
            className={[
              "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed py-10 transition-colors",
              dragging
                ? "border-blue-400 bg-blue-50 dark:bg-blue-950/20"
                : "border-gray-200 hover:border-blue-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/40",
            ].join(" ")}
          >
            <input
              ref={inputRef}
              type="file"
              multiple
              accept={ACCEPTED}
              className="hidden"
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = ""; // reset to allow same file selection
              }}
            />
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-md">
              <FileUp className="h-7 w-7 text-white" strokeWidth={1.8} />
            </div>
            <p className="text-base font-semibold text-gray-800 dark:text-gray-100">
              Upload your business documents
            </p>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              Supports Doc, Docx, PDF, PPT, PPTX . Max 5.0MB
            </p>
          </div>

          {hasFiles && (
            <div className="mt-4 flex flex-col gap-2">
              {files.map((item) => (
                <FileRow key={item.id} item={item} onRemove={removeFile} />
              ))}
            </div>
          )}

          <Button
            onClick={goToWizard}
            disabled={!allDone}
            className="mt-5 w-full rounded-md bg-[#2D4EAB] py-6 text-base font-semibold text-white hover:bg-[#1E3A8A] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-800/90"
          >
            Create my strategy
          </Button>

          <button
            onClick={goToWizard}
            className="mt-5 flex w-full items-center justify-center gap-1 text-sm text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {"Don't know what to do? Click here"}
            <ChevronRight size={15} />
          </button>
        </div>

        <button
          onClick={goToWizard}
          className="mt-6 flex w-full items-center gap-4 rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800/50"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700">
            <FileUp size={20} className="text-gray-500 dark:text-gray-400" strokeWidth={1.8} />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[15px] font-semibold text-gray-800 dark:text-gray-100">
              Don't have a document to upload? Create your strategy another way.
            </p>
            <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-500">
              Create your marketing strategy without the need to upload a document.
            </p>
          </div>
          <ChevronRight size={18} className="shrink-0 text-gray-400" />
        </button>
      </div>
    </main>
  );
}