"use client";

import { useMemo, useState } from "react";
import type { SignUpWeek } from "@/types/admin";
import { ChartTooltip } from "@/components/admin/dashboard/chart-tooltip";

type SignUpsChartProps = {
  weeks: SignUpWeek[];
  total: number;
  periodLabel: string;
  isLoading?: boolean;
};

const BAR_WIDTH_CLASS = "w-[32px] md:w-[67.75px]";

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
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-black-500">Sign ups</h2>
        <p className="mt-1 text-sm text-neutral-500">
          {periodLabel} · {total} total sign ups
        </p>
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

        <div className="relative z-10 flex h-full gap-1 pl-8 pr-2 md:gap-2">
          {weeks.map((week) => {
            const barHeightPct = (week.signUps / yMax) * 100;
            const isActive = activeWeek === week.week;

            return (
              <div
                key={week.week}
                className="relative flex h-full min-w-0 flex-1 items-end justify-center"
                onMouseEnter={() => setActiveWeek(week.week)}
                onMouseLeave={() => setActiveWeek(null)}
              >
                {isActive ? (
                  <div className="absolute bottom-full z-20 mb-2">
                    <ChartTooltip
                      label={week.week}
                      value={`${week.signUps} sign ups`}
                    />
                  </div>
                ) : null}

                <div className={`relative h-full shrink-0 ${BAR_WIDTH_CLASS}`}>
                  <div aria-hidden className="absolute inset-0 bg-primary-50" />
                  <div
                    className={`absolute bottom-0 left-0 rounded-full transition-all duration-200 ${BAR_WIDTH_CLASS} ${
                      isActive ? "bg-primary" : "bg-primary/90"
                    }`}
                    style={{
                      height: `${barHeightPct}%`,
                      minHeight: week.signUps > 0 ? "6px" : "0",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex gap-1 pl-8 pr-2 md:gap-2">
        {weeks.map((week) => (
          <span
            key={`${week.week}-label`}
            className="min-w-0 flex-1 text-center text-xs text-neutral-500"
          >
            {week.week}
          </span>
        ))}
      </div>
    </section>
  );
}
