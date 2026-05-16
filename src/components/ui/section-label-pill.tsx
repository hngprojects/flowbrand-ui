import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "~/utils";

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
        "border-accent bg-accent-background inline-flex items-center gap-2 rounded-full border px-3 py-1",
        className,
      )}
      {...properties}
    >
      <div className="bg-accent size-2 shrink-0 rounded-full" aria-hidden />
      <span className="text-accent text-xs">{children}</span>
    </div>
  );
}
