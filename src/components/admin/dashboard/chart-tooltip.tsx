"use client";

import { cn } from "@/lib/utils";

type ChartTooltipProps = {
  label: string;
  value: number | string;
  className?: string;
};

export function ChartTooltip({ label, value, className }: ChartTooltipProps) {
  return (
    <div
      className={cn(
        "pointer-events-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-md",
        className,
      )}
    >
      <p className="font-medium text-black-500">{label}</p>
      <p className="text-neutral-500">{value}</p>
    </div>
  );
}
