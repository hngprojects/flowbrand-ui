"use client";

import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Compact pager for the activity log, e.g. `< 1 2 … 9 10 >`.
 * Renders first two and last two pages with an ellipsis between, matching the
 * Figma. Page changes are reported to the parent which re-queries.
 */
export function LogPagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = buildPageList(page, totalPages);

  return (
    <nav
      aria-label="Activity log pagination"
      className="flex items-center justify-center gap-1.5 py-4"
    >
      <PagerButton
        ariaLabel="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="size-4" />
      </PagerButton>

      {pages.map((item, index) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="px-1.5 text-sm text-neutral-400"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-current={item === page ? "page" : undefined}
            onClick={() => onPageChange(item)}
            className={cn(
              "inline-flex size-8 items-center justify-center rounded-md text-sm",
              item === page
                ? "bg-primary text-primary-foreground"
                : "text-black-500 hover:bg-gray-100",
            )}
          >
            {item}
          </button>
        ),
      )}

      <PagerButton
        ariaLabel="Next page"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight className="size-4" />
      </PagerButton>
    </nav>
  );
}

function PagerButton({
  children,
  disabled,
  onClick,
  ariaLabel,
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex size-8 items-center justify-center rounded-md text-neutral-500 hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function buildPageList(page: number, total: number): (number | "ellipsis")[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const result: (number | "ellipsis")[] = [1, 2];
  if (page > 3 && page < total - 2) {
    result.push("ellipsis", page, "ellipsis");
  } else {
    result.push("ellipsis");
  }
  result.push(total - 1, total);
  // De-duplicate while preserving order.
  return result.filter(
    (item, index, array) =>
      item === "ellipsis" || array.indexOf(item) === index,
  );
}
