"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, FileUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import FileRow from "./file-row";

const WIZARD_ROUTE = "/onboarding/step-1";

const ACCEPTED_FILES = ".doc,.docx,.pdf,.ppt,.pptx";

const MAX_FILE_SIZE_MB = 5;

const ALLOWED_EXTENSIONS = [
  "DOC",
  "DOCX",
  "PDF",
  "PPT",
  "PPTX",
];

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  done: boolean;
}

function fileExtension(name: string) {
  const extension = name.split(".").at(-1);

  return extension?.toUpperCase() ?? "FILE";
}

export default function OnboardingUpload() {
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  const uploadIntervals = useRef<
    Record<string, ReturnType<typeof setInterval>>
  >({});

  const [files, setFiles] = useState<UploadedFile[]>([]);

  const [isDragging, setIsDragging] = useState(false);

  const navigateToWizard = useCallback(() => {
    router.push(WIZARD_ROUTE);
  }, [router]);

  const simulateUpload = useCallback((id: string) => {
    let progress = 0;

    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 18) + 8;

      setFiles((previousFiles) =>
        previousFiles.map((file) =>
          file.id === id
            ? {
                ...file,
                progress: Math.min(progress, 100),
              }
            : file,
        ),
      );

      if (progress >= 100) {
        clearInterval(interval);

        setFiles((previousFiles) =>
          previousFiles.map((file) =>
            file.id === id
              ? {
                  ...file,
                  done: true,
                }
              : file,
          ),
        );

        delete uploadIntervals.current[id];
      }
    }, 350);

    uploadIntervals.current[id] = interval;
  }, []);

  const addFiles = useCallback(
    (incomingFiles: FileList | null) => {
      if (!incomingFiles) return;

      for (const file of Array.from(incomingFiles)) {
        const extension = fileExtension(file.name);

        const isAllowedExtension =
          ALLOWED_EXTENSIONS.includes(extension);

        const isValidSize =
          file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;

        if (!isAllowedExtension || !isValidSize) {
          continue;
        }

        const id = `${file.name}-${Date.now()}-${Math.random()}`;

        setFiles((previousFiles) => [
          ...previousFiles,
          {
            id,
            file,
            progress: 0,
            done: false,
          },
        ]);

        simulateUpload(id);
      }
    },
    [simulateUpload],
  );

  const removeFile = useCallback((id: string) => {
    if (uploadIntervals.current[id]) {
      clearInterval(uploadIntervals.current[id]);

      delete uploadIntervals.current[id];
    }

    setFiles((previousFiles) =>
      previousFiles.filter((file) => file.id !== id),
    );
  }, []);

  useEffect(() => {
    return () => {
      Object.values(uploadIntervals.current).forEach(clearInterval);
    };
  }, []);

  const hasFiles = files.length > 0;

  const allUploadsCompleted =
    hasFiles && files.every((file) => file.done);

  return (
    <main className="h-screen overflow-y-auto bg-[#F7F8FA] dark:bg-gray-950">
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
            onKeyDown={(event) => {
              if (
                event.key === "Enter" ||
                event.key === " "
              ) {
                inputRef.current?.click();
              }
            }}
            onDragOver={(event) => {
              event.preventDefault();

              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault();

              setIsDragging(false);

              addFiles(event.dataTransfer.files);
            }}
            className={[
              "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed py-10 transition-colors",
              isDragging
                ? "border-blue-400 bg-blue-50 dark:bg-blue-950/20"
                : "border-gray-200 hover:border-blue-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/40",
            ].join(" ")}
          >
            <input
              ref={inputRef}
              type="file"
              multiple
              accept={ACCEPTED_FILES}
              className="hidden"
              onChange={(event) => {
                addFiles(event.target.files);

                event.target.value = "";
              }}
            />

            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-md">
              <FileUp
                className="h-7 w-7 text-white"
                strokeWidth={1.8}
              />
            </div>

            <p className="text-base font-semibold text-gray-800 dark:text-gray-100">
              Upload your business documents
            </p>

            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              Supports Doc, Docx, PDF, PPT, PPTX. Max 5.0MB
            </p>
          </div>

          {hasFiles && (
            <div className="mt-4 flex flex-col gap-2">
              {files.map((item) => (
                <FileRow
                  key={item.id}
                  item={item}
                  onRemove={removeFile}
                />
              ))}
            </div>
          )}

          <Button
            onClick={navigateToWizard}
            disabled={!allUploadsCompleted}
            className="mt-5 mb-5 w-full rounded-md bg-[#2D4EAB] py-6 text-base font-semibold text-white hover:bg-[#1E3A8A] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-800/90"
          >
            Create my strategy
          </Button>

          <div className="border-t-2" />

          <button
            type="button"
            onClick={navigateToWizard}
            className="mt-5 flex w-full items-center justify-center gap-1 text-sm text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {"Don't know what to do? Click here"}

            <ChevronRight size={15} />
          </button>
        </div>

        <button
          type="button"
          onClick={navigateToWizard}
          className="mt-6 flex w-full items-center gap-4 rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800/50"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700">
            <FileUp
              size={20}
              strokeWidth={1.8}
              className="text-gray-500 dark:text-gray-400"
            />
          </div>

          <div className="flex-1 text-left">
            <p className="text-[15px] font-semibold text-gray-800 dark:text-gray-100">
            {" Don't have a document to upload? Create your funnel another way."}
            </p>

            <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-500">
              Create your marketing strategy without the need to upload a
              document.
            </p>
          </div>

          <ChevronRight
            size={18}
            className="shrink-0 text-gray-900"
          />
        </button>
      </div>
    </main>
  );
}