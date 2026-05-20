

import { X } from "lucide-react";

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  done: boolean;
}

interface FileRowProps {
  item: UploadedFile;
  onRemove: (id: string) => void;
}

function formatMB(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function fileExtension(name: string) {
  const extension = name.split(".").at(-1);

  return extension?.toUpperCase() ?? "FILE";
}

function extensionColor(extension: string) {
  switch (extension) {
    case "PDF":
      return "bg-red-500";

    case "PPT":
    case "PPTX":
      return "bg-orange-500";

    default:
      return "bg-blue-500";
  }
}

export default function FileRow({ item, onRemove }: FileRowProps) {
  const extension = fileExtension(item.file.name);

  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
      <div className="relative mt-0.5 flex h-10 w-8 shrink-0 flex-col items-center justify-end rounded border border-gray-200 bg-gray-50 pb-1 dark:border-gray-700 dark:bg-gray-800">
        <span
          className={`rounded px-1 py-0.5 text-[9px] font-bold text-white ${extensionColor(
            extension,
          )}`}
        >
          {extension}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-100">
            {item.file.name}
          </p>

          <span className="shrink-0 text-sm text-gray-500 dark:text-gray-400">
            {item.done
              ? formatMB(item.file.size)
              : `${item.progress}% Uploading`}
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
        type="button"
        onClick={() => onRemove(item.id)}
        aria-label="Remove file"
        className="mt-1 shrink-0 text-gray-300 transition-colors hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-400"
      >
        <X size={15} />
      </button>
    </div>
  );
}
