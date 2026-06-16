"use client";

import type { ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import type { AdminMetricCard } from "@/types/admin";

type MetricCardsRowProps = {
  metrics: AdminMetricCard[];
  isLoading?: boolean;
};

const METRIC_CARD_CLASS =
  "flex h-[168px] min-h-[120px] w-[min(82vw,280px)] shrink-0 snap-start snap-always flex-col justify-between rounded-2xl bg-primary px-5 py-4 text-white shadow-sm sm:w-auto sm:shrink";

function MetricCardsTrack({ children }: { children: ReactNode }) {
  return (
    <div className="-mx-4 min-w-0 overflow-x-auto overscroll-x-contain px-4 [-webkit-overflow-scrolling:touch] scrollbar-none sm:mx-0 sm:overflow-visible sm:px-0">
      <div className="flex w-max min-w-full snap-x snap-mandatory gap-4 sm:grid sm:w-full sm:grid-cols-2 sm:snap-none xl:grid-cols-4">
        {children}
      </div>
    </div>
  );
}

function MetricCardSkeleton() {
  return (
    <div className="h-[168px] min-h-[120px] w-[min(82vw,280px)] shrink-0 snap-start snap-always rounded-2xl bg-primary/40 sm:w-auto sm:shrink" />
  );
}

export function MetricCardsRow({ metrics, isLoading }: MetricCardsRowProps) {
  if (isLoading) {
    return (
      <MetricCardsTrack>
        {Array.from({ length: 4 }).map((_, index) => (
          <MetricCardSkeleton key={index} />
        ))}
      </MetricCardsTrack>
    );
  }

  return (
    <MetricCardsTrack>
      {metrics.map((metric) => {
        const isUp = metric.trend === "up";
        const TrendIcon = isUp ? TrendingUp : TrendingDown;
        const changePrefix = isUp ? "+" : "-";

        return (
          <article key={metric.id} className={METRIC_CARD_CLASS}>
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

            <div className="flex items-end justify-between gap-3">
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
    </MetricCardsTrack>
  );
}
