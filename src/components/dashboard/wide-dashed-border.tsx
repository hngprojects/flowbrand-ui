"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Drop zone with wide-spaced dashes matching the Seil upload design. */
export function WideDashedBorder({
  children,
  className,
  active,
}: {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const stroke = active ? "#326AD1" : "#BFD1F1";

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const update = () => {
      const { width, height } = node.getBoundingClientRect();
      setDimensions({ width, height });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const { width, height } = dimensions;
  const inset = 1;
  const rx = 11;

  return (
    <div ref={containerRef} className={cn("relative rounded-xl", className)}>
      {width > 0 && height > 0 && (
        <svg
          className="pointer-events-none absolute inset-0 z-10"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          aria-hidden
        >
          <rect
            x={inset}
            y={inset}
            width={width - inset * 2}
            height={height - inset * 2}
            rx={rx}
            ry={rx}
            fill="none"
            stroke={stroke}
            strokeWidth="2"
            strokeDasharray="32 18"
            strokeLinecap="butt"
          />
        </svg>
      )}
      <div className="relative z-0">{children}</div>
    </div>
  );
}
