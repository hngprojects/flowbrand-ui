"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import type { AdminMetricCard } from "@/types/admin";

type MetricCardsRowProps = {
  metrics: AdminMetricCard[];
  isLoading?: boolean;
};

function MetricCardSkeleton() {
  return (
    <div className="h-[120px] rounded-2xl bg-primary/40 md:min-w-[200px] md:flex-1" />
  );
}

export function MetricCardsRow({ metrics, isLoading }: MetricCardsRowProps) {
  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-1">
        {Array.from({ length: 4 }).map((_, index) => (
          <MetricCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-none">
      {metrics.map((metric) => {
        const isUp = metric.trend === "up";
        const TrendIcon = isUp ? TrendingUp : TrendingDown;
        const changePrefix = isUp ? "+" : "-";

        return (
          <article
            key={metric.id}
            className="flex min-h-[120px] h-[168px] min-w-[200px] flex-1 flex-col justify-between rounded-2xl bg-primary px-5 py-4 text-white shadow-sm "
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-white">{metric.label}</p>
              <span
                className="relative flex h-8 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border
               border-white/10 border-t-white/45 border-l-white/30 bg-white/[0.01] shadow-[0_1px_4px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-1px_0_rgba(0,0,0,0.12)]
                backdrop-blur-md"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-transparent to-black/5"
                />
                <TrendIcon
                  className="relative size-[18px] text-white"
                  strokeWidth={3}
                />
              </span>
            </div>

            <div className="flex items-end justify-between gap-3 mb-10">
              <p className="text-[32px] font-semibold leading-none tracking-tight">
                {metric.value.toLocaleString()}
              </p>
              <p className="shrink-0 text-sm font-medium text-white">
                {changePrefix}
                {metric.changePercent.toFixed(2)}%
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
