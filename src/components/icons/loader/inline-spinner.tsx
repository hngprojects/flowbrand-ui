"use client";

import { useId } from "react";

/** Small blue arc for inline “building strategy” status text. */
export function InlineSpinner({ size = 20 }: { size?: number }) {
  const uid = useId().replace(/:/g, "");
  const center = size / 2;
  const r = size * 0.38;
  const stroke = Math.max(2, size * 0.12);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <defs>
        <linearGradient id={`inlineArc-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A1BAEA" />
          <stop offset="100%" stopColor="#326AD1" />
        </linearGradient>
      </defs>
      <g
        className="animate-spin"
        style={{
          transformOrigin: `${center}px ${center}px`,
          animationDuration: "1.2s",
        }}
      >
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke={`url(#inlineArc-${uid})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${r * 3} ${r * 2}`}
        />
      </g>
    </svg>
  );
}
