"use client";

import { useMemo, useState } from "react";
import type { UserTenureBucket } from "@/types/admin";
import { ChartTooltip } from "@/components/admin/dashboard/chart-tooltip";

type UserTenureChartProps = {
  buckets: UserTenureBucket[];
  total: number;
  subtitle: string;
  isLoading?: boolean;
};

export function UserTenureChart({
  buckets,
  total,
  subtitle,
  isLoading,
}: UserTenureChartProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const maxValue = useMemo(
    () => Math.max(...buckets.map((bucket) => bucket.value), 1),
    [buckets],
  );

  if (isLoading) {
    return (
      <div className="h-[320px] animate-pulse rounded-2xl border border-gray-200 bg-white" />
    );
  }

  const activeBucket = buckets.find((bucket) => bucket.id === activeId);

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-black-500">
          Length of users
        </h2>
        <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
      </div>

      <div className="flex gap-4">
        <p
          className="shrink-0 text-[20px] font-medium text-black-300 font-[600] flex items-center justify-center"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          {total} users
        </p>

        <div className="flex min-w-0 flex-1 flex-col">
          {buckets.map((bucket) => {
            const widthPct = (bucket.value / maxValue) * 100;
            const isActive = activeId === bucket.id;

            return (
              <div
                key={bucket.id}
                className="relative"
                onMouseEnter={() => setActiveId(bucket.id)}
                onMouseLeave={() => setActiveId(null)}
              >
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-1">
                  <div
                    className="flex h-14 items-center rounded-lg px-3 text-sm font-semibold text-white transition-all duration-200 sm:h-[80px]"
                    style={{
                      width: `${widthPct}%`,
                      minWidth: "72px",
                      backgroundColor: bucket.color,
                      opacity: isActive || activeId === null ? 1 : 0.55,
                    }}
                  />
                  <span className="text-sm font-semibold text-black-500">
                    {bucket.value}
                  </span>
                </div>
                {isActive ? (
                  <div className="absolute right-0 top-0 z-10 -translate-y-full pb-2">
                    <ChartTooltip label={bucket.label} value={bucket.value} />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        {buckets.map((bucket) => (
          <div
            key={bucket.id}
            className="flex items-center gap-2 text-sm text-neutral-600"
          >
            <span
              className="size-3 rounded-sm"
              style={{ backgroundColor: bucket.color }}
            />
            {bucket.label}
          </div>
        ))}
      </div>

      {activeBucket ? (
        <p className="sr-only">
          {activeBucket.label}: {activeBucket.value}
        </p>
      ) : null}
    </section>
  );
}
