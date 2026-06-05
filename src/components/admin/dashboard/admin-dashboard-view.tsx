"use client";

import { useAdminDashboardQuery } from "@/hooks/queries/use-admin-dashboard-queries";
import { ActivityLogPreview } from "@/components/admin/dashboard/activity-log-preview";
import { DonutChart } from "@/components/admin/dashboard/donut-chart";
import { MetricCardsRow } from "@/components/admin/dashboard/metric-cards-row";
import { SignUpsChart } from "@/components/admin/dashboard/sign-ups-chart";
import { UserTenureChart } from "@/components/admin/dashboard/user-tenure-chart";

export function AdminDashboardView() {
  const { data, isLoading, isError, refetch } = useAdminDashboardQuery();

  if (isError) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
        <p className="text-sm text-neutral-500">
          Could not load dashboard data. Please try again.
        </p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-4 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <MetricCardsRow metrics={data?.metrics ?? []} isLoading={isLoading} />

      <SignUpsChart
        weeks={data?.signUps.weeks ?? []}
        total={data?.signUps.total ?? 0}
        periodLabel={data?.signUps.periodLabel ?? "Last 12 weeks"}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-black-500">
              User stages
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              {data?.userStages.subtitle ?? ""}
            </p>
          </div>
          {isLoading ? (
            <div className="h-[260px] animate-pulse rounded-xl bg-gray-100" />
          ) : (
            <DonutChart
              segments={data?.userStages.segments ?? []}
              total={data?.userStages.total ?? 0}
            />
          )}
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-black-500">
              Plan distribution
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              {data?.planDistribution.subtitle ?? ""}
            </p>
          </div>
          {isLoading ? (
            <div className="h-[260px] animate-pulse rounded-xl bg-gray-100" />
          ) : (
            <DonutChart
              segments={data?.planDistribution.segments ?? []}
              total={data?.planDistribution.total ?? 0}
              minSweepDegrees={0}
            />
          )}
        </section>
      </div>

      <UserTenureChart
        buckets={data?.userTenure.buckets ?? []}
        total={data?.userTenure.total ?? 0}
        subtitle={data?.userTenure.subtitle ?? ""}
        isLoading={isLoading}
      />

      <ActivityLogPreview
        entries={data?.recentActivity ?? []}
        isLoading={isLoading}
      />
    </div>
  );
}
