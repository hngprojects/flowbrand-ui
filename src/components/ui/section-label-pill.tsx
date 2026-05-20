import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SectionLabelPillProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children: ReactNode;
};

export function SectionLabelPill({
  children,
  className,
  ...properties
}: SectionLabelPillProps) {
  return (
    <div
      className={cn(
        "border-accent bg-accent-50 inline-flex items-center gap-2 rounded-full p-3 mb-4",
        className,
      )}
      {...properties}
    >
      <div className="bg-accent size-3 shrink-0 rounded-full" aria-hidden />
      <span className="text-accent text-xs">{children}</span>
    </div>
  );
}
