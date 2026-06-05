"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { SignUpWeek } from "@/types/admin";
import { ChartTooltip } from "@/components/admin/dashboard/chart-tooltip";

type SignUpsChartProps = {
  weeks: SignUpWeek[];
  total: number;
  periodLabel: string;
  isLoading?: boolean;
};

function buildYAxisTicks(max: number): number[] {
  const step = max <= 50 ? 10 : 20;
  const ticks: number[] = [0];
  for (let value = step; value <= max; value += step) {
    ticks.push(value);
  }
  if (ticks[ticks.length - 1] !== max) {
    ticks.push(max);
  }
  return ticks;
}

export function SignUpsChart({
  weeks,
  total,
  periodLabel,
  isLoading,
}: SignUpsChartProps) {
  const [activeWeek, setActiveWeek] = useState<string | null>(null);

  const yMax = useMemo(() => {
    const peak = Math.max(...weeks.map((week) => week.signUps), 1);
    const rounded = Math.ceil(peak / 20) * 20;
    return Math.max(100, rounded);
  }, [weeks]);

  const ticks = useMemo(() => buildYAxisTicks(yMax), [yMax]);

  if (isLoading) {
    return (
      <div className="h-[360px] animate-pulse rounded-2xl border border-gray-200 bg-white" />
    );
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-black-500">Sign ups</h2>
          <p className="mt-1 text-sm text-neutral-500">
            {periodLabel} · {total} total sign ups
          </p>
        </div>
        {/* TODO: Wire period selector dropdown when live overview API is ready. */}
        <div
          aria-hidden
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-black-500"
        >
          Weekly live overview
          <ChevronDown className="size-4 text-neutral-500" />
        </div>
      </div>

      <div className="relative h-[280px]">
        <div className="absolute inset-0 flex flex-col justify-between pl-8 pr-2">
          {ticks
            .slice()
            .reverse()
            .filter((tick) => tick > 0)
            .map((tick) => (
              <div
                key={tick}
                className="relative border-b border-dashed border-gray-500"
              >
                <span className="absolute -left-7 -top-2 text-xs text-neutral-400">
                  {tick}
                </span>
              </div>
            ))}
        </div>

        <div className="relative z-10 flex h-full gap-2 pl-8 pr-2">
          {weeks.map((week) => {
            const barHeightPct = (week.signUps / yMax) * 100;
            const isActive = activeWeek === week.week;

            return (
              <div
                key={week.week}
                className="relative flex h-full min-w-0 flex-1 flex-col"
                onMouseEnter={() => setActiveWeek(week.week)}
                onMouseLeave={() => setActiveWeek(null)}
              >
                <div className="relative flex min-h-0 flex-1 items-end justify-center">
                  {isActive ? (
                    <div className="absolute bottom-full z-20 mb-2">
                      <ChartTooltip
                        label={week.week}
                        value={`${week.signUps} sign ups`}
                      />
                    </div>
                  ) : null}

                  <div
                    className={`w-full max-w-[67px] rounded-full transition-all duration-200 ${
                      isActive ? "bg-primary" : "bg-primary/90"
                    }`}
                    style={{
                      height: `${barHeightPct}%`,
                      minHeight: week.signUps > 0 ? "6px" : "0",
                    }}
                  />

                  <span
                    aria-hidden
                    className="pointer-events-none absolute max-w-[67px] inset-x-0 translate-x-5 bottom-0 top-0 -z-10 bg-primary-50"
                  />
                </div>

                <span className="mt-3 shrink-0 text-center text-xs text-neutral-500">
                  {week.week}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
