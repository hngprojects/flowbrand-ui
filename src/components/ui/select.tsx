import * as React from "react";

import { cn } from "@/lib/utils";

export type SelectProperties = React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = React.forwardRef<HTMLSelectElement, SelectProperties>(
  ({ className, children, ...properties }, reference) => {
    return (
      <select
        className={cn(
          "border-input bg-background ring-offset-background focus-visible:ring-primary flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={reference}
        {...properties}
      >
        {children}
      </select>
    );
  },
);
Select.displayName = "Select";

export { Select };
