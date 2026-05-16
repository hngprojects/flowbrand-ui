"use client";

import { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FileUp, ChevronRight, X } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

// ── Types ────────────────────────────────────────────────────────────────────
interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  done: boolean;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const ACCEPTED = ".doc,.docx,.pdf,.ppt,.pptx";
const MAX_MB = 5;

function formatMB(bytes: number) {
  return (bytes / (1024 * 1024)).toFixed(1) + "MB";
}

function fileExt(name: string) {
  return name.split(".").pop()?.toUpperCase() ?? "FILE";
}

function extColor(ext: string) {
  if (ext === "PDF") return "bg-red-500";

  if (ext === "PPT" || ext === "PPTX") {
    return "bg-orange-500";
  }

  return "bg-blue-500";
}

// ── File Row ─────────────────────────────────────────────────────────────────
function FileRow({
  item,
  onRemove,
}: {
  item: UploadedFile;
  onRemove: (id: string) => void;
}) {
  const ext = fileExt(item.file.name);

  return (
    <div
      className="
        flex items-start gap-3 rounded-xl border
        border-gray-100 bg-white px-4 py-3
        dark:border-gray-800 dark:bg-gray-900
      "
    >
      {/* File icon */}
      <div
        className="
          relative mt-0.5 flex h-10 w-8 shrink-0
          flex-col items-center justify-end rounded
          border border-gray-200 bg-gray-50 pb-1
          dark:border-gray-700 dark:bg-gray-800
        "
      >
        <span
          className={`
            rounded px-1 py-0.5 text-[9px]
            font-bold text-white ${extColor(ext)}
          `}
        >
          {ext}
        </span>
      </div>

      {/* Info + progress */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p
            className="
              truncate text-sm font-medium
              text-gray-800 dark:text-gray-100
            "
          >
            {item.file.name}
          </p>

          <span
            className="
              shrink-0 text-sm text-gray-500
              dark:text-gray-400
            "
          >
            {item.done
              ? formatMB(item.file.size)
              : `${item.progress}% Uploading`}
          </span>
        </div>

        {/* Progress bar */}
        <div
          className="
            mt-2 h-1.5 w-full overflow-hidden
            rounded-full bg-gray-100 dark:bg-gray-700
          "
        >
          <div
            className="
              h-full rounded-full bg-amber-400
              transition-all duration-300
            "
            style={{ width: `${item.progress}%` }}
          />
        </div>

        {!item.done && (
          <p
            className="
              mt-1 text-xs text-gray-400
              dark:text-gray-600
            "
          >
            {formatMB(item.file.size)}
          </p>
        )}
      </div>

      {/* Remove */}
      <button
        onClick={() => onRemove(item.id)}
        aria-label="Remove file"
        className="
          mt-1 shrink-0 text-gray-300
          transition-colors hover:text-gray-500
          dark:text-gray-600 dark:hover:text-gray-400
        "
      >
        <X size={15} />
      </button>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<UploadedFile[]>([]);

  const [dragging, setDragging] = useState(false);

  // ── Simulate Upload ────────────────────────────────────────────────────────
  const simulateUpload = useCallback((id: string) => {
    let progress = 0;

    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 18) + 8;

      if (progress >= 100) {
        progress = 100;

        clearInterval(interval);

        setFiles((prev) =>
          prev.map((f) =>
            f.id === id
              ? {
                  ...f,
                  progress: 100,
                  done: true,
                }
              : f,
          ),
        );
      } else {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === id
              ? {
                  ...f,
                  progress,
                }
              : f,
          ),
        );
      }
    }, 350);
  }, []);

  // ── Add Files ──────────────────────────────────────────────────────────────
  const addFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming) return;

      Array.from(incoming).forEach((file) => {
        if (file.size > MAX_MB * 1024 * 1024) {
          return;
        }

        const id = `${file.name}-${Date.now()}-${Math.random()}`;

        setFiles((prev) => [
          ...prev,
          {
            id,
            file,
            progress: 0,
            done: false,
          },
        ]);

        simulateUpload(id);
      });
    },
    [simulateUpload],
  );

  // ── Remove File ────────────────────────────────────────────────────────────
  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // ── Navigation ─────────────────────────────────────────────────────────────
  const goToWizard = () => {
    router.push("/onboarding/step-1");
  };

  const hasFiles = files.length > 0;

  const allDone = hasFiles && files.every((f) => f.done);

  return (
    <main className="min-h-screen bg-[#F7F8FA] dark:bg-gray-950">
      <div
        className="
          mx-auto flex w-full max-w-[620px]
          flex-col items-center px-4 py-14
          md:py-20
        "
      >
        {/* Heading */}
        <h1
          className="
            mb-2 text-center text-3xl
            font-semibold text-gray-700
            dark:text-gray-200 md:text-4xl
          "
        >
          Start creating your marketing strategy
        </h1>

        <p
          className="
            mb-10 text-center text-sm
            text-gray-500 dark:text-gray-400
          "
        >
          Create marketing strategy tailored to your business needs.
        </p>

        {/* Upload Card */}
        <div
          className="
            w-full rounded-2xl border
            border-gray-100 bg-white p-6
            shadow-sm dark:border-gray-800
            dark:bg-gray-900
          "
        >
          {/* Drop zone */}
          <div
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
            onClick={() => inputRef.current?.click()}
            className={`
              flex cursor-pointer flex-col
              items-center justify-center
              rounded-xl border-2 border-dashed
              py-10 transition-colors
              ${
                dragging
                  ? `
                    border-blue-400 bg-blue-50
                    dark:bg-blue-950/20
                  `
                  : `
                    border-gray-200
                    hover:border-blue-300
                    hover:bg-gray-50
                    dark:border-gray-700
                    dark:hover:bg-gray-800/40
                  `
              }
            `}
          >
            <input
              ref={inputRef}
              type="file"
              multiple
              accept={ACCEPTED}
              className="hidden"
              onChange={(e) => addFiles(e.target.files)}
            />

            {/* Upload icon */}
            <div
              className="
                mb-4 flex h-14 w-14
                items-center justify-center
                rounded-2xl bg-gradient-to-br
                from-blue-500 to-blue-700
                shadow-md
              "
            >
              <FileUp className="h-7 w-7 text-white" strokeWidth={1.8} />
            </div>

            <p
              className="
                text-base font-semibold
                text-gray-800 dark:text-gray-100
              "
            >
              Upload your business documents
            </p>

            <p
              className="
                mt-1 text-xs text-gray-500
                dark:text-gray-400
              "
            >
              Supports DOC, DOCX, PDF, PPT, PPTX • Max 5MB
            </p>
          </div>

          {/* File list */}
          {hasFiles && (
            <div className="mt-4 flex flex-col gap-2">
              {files.map((item) => (
                <FileRow key={item.id} item={item} onRemove={removeFile} />
              ))}
            </div>
          )}

          {/* CTA */}
          <Button
            onClick={goToWizard}
            disabled={!allDone}
            className="
              mt-5 w-full rounded-md
              bg-[#2D4EAB] py-6 text-base
              font-semibold text-white
              hover:bg-[#1E3A8A]
              disabled:cursor-not-allowed
              disabled:opacity-50
              dark:bg-blue-700
              dark:hover:bg-blue-800
            "
          >
            Create my strategy
          </Button>

          {/* Help link */}
          <Link
            href="/onboarding/step-1"
            className="
              mt-5 flex items-center
              justify-center gap-1 text-sm
              text-gray-700 transition-colors
              hover:text-gray-900
              dark:text-gray-400
              dark:hover:text-gray-200
            "
          >
            {"Don't know what to do? Click here"}

            <ChevronRight size={15} />
          </Link>
        </div>

        {/* Alternative Path Card */}
        <Button
          onClick={goToWizard}
          variant="outline"
          className="
            mt-6 flex h-auto w-full
            items-center gap-4 rounded-2xl
            border border-gray-100 bg-white
            px-6 py-5 text-left shadow-sm
            transition-colors hover:bg-gray-50
            dark:border-gray-800
            dark:bg-gray-900
            dark:hover:bg-gray-800
          "
        >
          <div
            className="
              flex h-11 w-11 shrink-0
              items-center justify-center
              rounded-xl border
              border-gray-200
              dark:border-gray-700
            "
          >
            <FileUp
              size={20}
              className="
                text-gray-500
                dark:text-gray-400
              "
              strokeWidth={1.8}
            />
          </div>

          <div className="flex-1 text-left">
            <p
              className="
                text-[15px] font-semibold
                text-gray-900
                dark:text-gray-100
              "
            >
              {"Don't have a document to upload?"}
            </p>

            <p
              className="
                mt-0.5 text-sm text-gray-500
                dark:text-gray-400
              "
            >
              Create your marketing strategy without uploading a document.
            </p>
          </div>

          <ChevronRight size={18} className="shrink-0 text-gray-400" />
        </Button>
      </div>
    </main>
  );
}
