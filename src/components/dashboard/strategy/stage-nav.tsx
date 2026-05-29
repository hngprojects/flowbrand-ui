"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  position: number;
  total: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  nextDisabledReason?: string;
};

const ARROW_CLASS = cn(
  "inline-flex h-8 w-8 items-center justify-center rounded-full",
  "border border-primary-80 bg-white text-neutral-900 transition-colors",
  "hover:bg-primary-150 disabled:cursor-not-allowed disabled:opacity-40",
  "disabled:hover:bg-white",
);

export function StageNav({
  position,
  total,
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
  nextDisabledReason,
}: Props) {
  if (total <= 0) return null;

  const isLast = position >= total;
  const showNextTooltip = !canGoNext && !isLast && !!nextDisabledReason;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onPrevious}
        disabled={!canGoPrevious}
        aria-label="Previous stage"
        className={ARROW_CLASS}
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={2.2} />
      </button>

      <p className="min-w-[3.5rem] text-center text-sm font-medium text-neutral-500">
        {position} of {total}
      </p>

      <button
        type="button"
        onClick={onNext}
        disabled={!canGoNext}
        aria-label="Next stage"
        title={showNextTooltip ? nextDisabledReason : undefined}
        className={ARROW_CLASS}
      >
        <ChevronRight className="h-4 w-4" strokeWidth={2.2} />
      </button>
    </div>
  );
}

export default StageNav;
