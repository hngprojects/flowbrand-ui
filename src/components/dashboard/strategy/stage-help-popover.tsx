"use client";

import { CircleHelp } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function StageHelpPopover({
  title,
  explanation,
  className,
}: {
  title: string;
  explanation: string;
  className?: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`About ${title}`}
          className={cn(
            "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors",
            "hover:bg-neutral-100 hover:text-neutral-600",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40",
            "data-[state=open]:bg-primary-50 data-[state=open]:text-primary-500",
            className,
          )}
        >
          <CircleHelp className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </PopoverTrigger>
      <PopoverContent side="right" align="start" className="p-0">
        <div className="border-b border-primary-80 px-3.5 py-2.5">
          <p className="text-[13px] font-semibold text-neutral-900">{title}</p>
        </div>
        <p className="px-3.5 py-3 text-[13px] leading-relaxed text-neutral-600">
          {explanation}
        </p>
      </PopoverContent>
    </Popover>
  );
}
