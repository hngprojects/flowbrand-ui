"use client";

import { ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { LogDateRange } from "@/types/admin";

const OPTIONS: { value: LogDateRange; label: string }[] = [
  { value: "all", label: "All time" },
  { value: "last_7_days", label: "Last 7 days" },
  { value: "last_30_days", label: "Last 30 days" },
  { value: "custom", label: "Custom" },
];

/** "All time" date-range dropdown for the activity log. */
export function LogDateFilter({
  value,
  onChange,
}: {
  value: LogDateRange;
  onChange: (value: LogDateRange) => void;
}) {
  const current =
    OPTIONS.find((option) => option.value === value) ?? OPTIONS[0];

  return (
    <Popover>
      <PopoverTrigger className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-300 px-3 text-sm text-black-500">
        {current.label}
        <ChevronDown className="size-4 text-neutral-400" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-44 p-1">
        <ul className="flex flex-col">
          {OPTIONS.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => onChange(option.value)}
                className={cn(
                  "w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100",
                  option.value === value
                    ? "font-medium text-primary-700"
                    : "text-black-500",
                )}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
