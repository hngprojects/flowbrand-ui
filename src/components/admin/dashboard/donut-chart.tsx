"use client";

import { useMemo, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import type { ChartSegment } from "@/types/admin";
import { cn } from "@/lib/utils";

type DonutChartProps = {
  segments: ChartSegment[];
  total: number;
  centerLabel?: string;
  size?: number;
  /**
   * Target min arc degrees for small values (not a strict guarantee).
   * When many segments exceed available angle, sweeps are scaled down uniformly.
   * Use 0 for true proportional slices (e.g. plan 140/44).
   */
  minSweepDegrees?: number;
};

type ChartSegmentWithVisual = ChartSegment & {
  chartValue: number;
};

type BadgeLayout = {
  segment: ChartSegment;
  x: number;
  y: number;
};

const LEGEND_ORDER = [
  "signed-up",
  "intake-done",
  "created-strategies",
  "stage-1",
  "stage-2",
  "stage-3",
  "free",
  "pro",
];

const INNER_RADIUS = 92;
const OUTER_RADIUS = 130;
const PADDING_ANGLE = 3;
const CORNER_RADIUS = 14;
const SEGMENT_STROKE = 2;
const START_ANGLE = 90;
const END_ANGLE = -270;
const DEFAULT_MIN_SWEEP_DEGREES = 40;

function computeVisualSweeps(
  segments: ChartSegment[],
  minSweepDegrees: number,
): number[] {
  const totalPadding = PADDING_ANGLE * segments.length;
  const availableAngle = 360 - totalPadding;
  const valueSum =
    segments.reduce((acc, segment) => acc + segment.value, 0) || 1;

  let sweeps = segments.map((segment) => {
    const rawSweep = (segment.value / valueSum) * availableAngle;
    return minSweepDegrees > 0 ? Math.max(rawSweep, minSweepDegrees) : rawSweep;
  });

  // Scale down uniformly when min sweeps exceed available angle (may drop below minSweepDegrees).
  const sweepSum = sweeps.reduce((acc, sweep) => acc + sweep, 0);
  if (sweepSum > availableAngle) {
    const scale = availableAngle / sweepSum;
    sweeps = sweeps.map((sweep) => sweep * scale);
  }

  return sweeps;
}

function toChartSegments(
  segments: ChartSegment[],
  minSweepDegrees: number,
): ChartSegmentWithVisual[] {
  const totalPadding = PADDING_ANGLE * segments.length;
  const availableAngle = 360 - totalPadding;
  const valueSum =
    segments.reduce((acc, segment) => acc + segment.value, 0) || 1;
  const sweeps = computeVisualSweeps(segments, minSweepDegrees);

  return segments.map((segment, index) => ({
    ...segment,
    chartValue: (sweeps[index] / availableAngle) * valueSum,
  }));
}

function computeBadgeLayouts(
  segments: ChartSegment[],
  size: number,
  minSweepDegrees: number,
): BadgeLayout[] {
  const cx = size / 2;
  const cy = size / 2;
  const sweeps = computeVisualSweeps(segments, minSweepDegrees);
  const labelRadius = INNER_RADIUS + (OUTER_RADIUS - INNER_RADIUS) * 0.58;

  let cursor = START_ANGLE;

  return segments.map((segment, index) => {
    const sweep = sweeps[index];
    const midAngle = cursor - sweep / 2;
    cursor -= sweep + PADDING_ANGLE;

    const radian = (midAngle * Math.PI) / 180;
    const x = cx + labelRadius * Math.cos(-radian);
    const y = cy + labelRadius * Math.sin(-radian);

    return { segment, x, y };
  });
}

function SegmentBadge({ value }: { value: number }) {
  return (
    <span className="rounded-full border border-white/60 bg-white/55 px-2 py-0.5 text-[11px] font-semibold leading-tight text-black-500 shadow-[0_1px_6px_rgba(0,0,0,0.1)] backdrop-blur-[3px]">
      {value}
    </span>
  );
}

export function DonutChart({
  segments,
  total,
  centerLabel = "Total Users",
  size = 300,
  minSweepDegrees = DEFAULT_MIN_SWEEP_DEGREES,
}: DonutChartProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const chartSegments = useMemo(
    () => toChartSegments(segments, minSweepDegrees),
    [segments, minSweepDegrees],
  );

  const badgeLayouts = useMemo(
    () => computeBadgeLayouts(segments, size, minSweepDegrees),
    [segments, size, minSweepDegrees],
  );

  const legendSegments = useMemo(
    () =>
      [...segments].sort(
        (a, b) =>
          (LEGEND_ORDER.indexOf(a.id) === -1
            ? 99
            : LEGEND_ORDER.indexOf(a.id)) -
          (LEGEND_ORDER.indexOf(b.id) === -1 ? 99 : LEGEND_ORDER.indexOf(b.id)),
      ),
    [segments],
  );

  return (
    <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-center lg:gap-12">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <PieChart width={size} height={size}>
          <Pie
            data={chartSegments}
            dataKey="chartValue"
            nameKey="label"
            cx="50%"
            cy="50%"
            startAngle={START_ANGLE}
            endAngle={END_ANGLE}
            innerRadius={INNER_RADIUS}
            outerRadius={OUTER_RADIUS}
            paddingAngle={PADDING_ANGLE}
            cornerRadius={CORNER_RADIUS}
            stroke="#ffffff"
            strokeWidth={SEGMENT_STROKE}
            isAnimationActive={false}
          >
            {chartSegments.map((segment) => (
              <Cell
                key={segment.id}
                fill={segment.color}
                fillOpacity={
                  activeId === null || activeId === segment.id ? 1 : 0.35
                }
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setActiveId(segment.id)}
                onMouseLeave={() => setActiveId(null)}
              />
            ))}
          </Pie>
        </PieChart>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-[28px] font-semibold leading-none text-black-500">
            {total}
          </p>
          <p className="mt-1.5 text-sm text-neutral-500">{centerLabel}</p>
        </div>

        {badgeLayouts.map(({ segment, x, y }) => (
          <div
            key={`badge-${segment.id}`}
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={{ left: x, top: y }}
          >
            <SegmentBadge value={segment.value} />
          </div>
        ))}
      </div>

      <ul className="flex min-w-[180px] flex-col gap-3.5">
        {legendSegments.map((segment) => (
          <li
            key={segment.id}
            className="flex cursor-default items-center gap-2.5 text-sm"
            onMouseEnter={() => setActiveId(segment.id)}
            onMouseLeave={() => setActiveId(null)}
          >
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: segment.color }}
            />
            <span
              className={cn(
                "text-neutral-600 transition-colors",
                activeId === segment.id && "font-medium text-black-500",
              )}
            >
              {segment.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
