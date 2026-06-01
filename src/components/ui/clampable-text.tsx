"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const LINE_CLAMP: Record<number, string> = {
  3: "line-clamp-3",
  4: "line-clamp-4",
  5: "line-clamp-5",
  6: "line-clamp-6",
};

export function ClampableText({
  children,
  className,
  lines = 5,
}: {
  children: string;
  className?: string;
  lines?: 3 | 4 | 5 | 6;
}) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const measure = () => {
      if (expanded) {
        setCanExpand(true);
        return;
      }
      setCanExpand(el.scrollHeight > el.clientHeight + 2);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);

    return () => observer.disconnect();
  }, [children, expanded, lines]);

  const clampClass = LINE_CLAMP[lines] ?? LINE_CLAMP[5];

  return (
    <div>
      <p ref={textRef} className={cn(className, !expanded && clampClass)}>
        {children}
      </p>
      {canExpand ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-1.5 text-xs font-semibold uppercase tracking-wide text-primary-500 hover:text-primary-625"
        >
          {expanded ? "See less" : "See more"}
        </button>
      ) : null}
    </div>
  );
}
