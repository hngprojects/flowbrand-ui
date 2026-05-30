"use client";

import { useQuery } from "@tanstack/react-query";
import { listFunnels } from "@/actions/funnels";
import { parseFunnelList } from "@/lib/funnel-api-types";
import { unwrapActionResult } from "@/lib/api-query";
import { queryKeys } from "@/lib/query-keys";

function statusBadge(status?: string) {
  if (status === "active")
    return (
      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
        Active
      </span>
    );
  if (status === "generating")
    return (
      <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
        Generating
      </span>
    );
  if (status === "failed")
    return (
      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
        Failed
      </span>
    );
  return null;
}

export function FunnelHistory({
  currentFunnelId,
}: {
  currentFunnelId?: string | null;
}) {
  const { data: funnels, isLoading } = useQuery({
    queryKey: queryKeys.funnels.all(),
    queryFn: async () => {
      const res = await listFunnels(1);
      const data = unwrapActionResult(res, "Could not load funnels.");
      return parseFunnelList(data);
    },
    staleTime: 30_000,
  });

  const previous = funnels?.filter((f) => f.funnelId !== currentFunnelId);

  if (isLoading) return null;
  if (!previous?.length) return null;

  return (
    <div className="mt-6">
      <h3 className="mb-3 text-sm font-semibold text-neutral-700">
        Previous Strategies
      </h3>
      <div className="flex flex-col gap-2">
        {previous.map((funnel) => (
          <div
            key={funnel.funnelId}
            className="flex items-center justify-between rounded-[12px] border border-primary-80 bg-white px-4 py-3"
          >
            <div>
              <p className="text-sm font-semibold text-neutral-900">
                {funnel.businessName ?? "Unnamed Strategy"}
              </p>
              <p className="text-xs text-neutral-400 capitalize">
                {funnel.creationPath?.replace("_", " ") ?? ""}
              </p>
            </div>
            {statusBadge(funnel.status)}
          </div>
        ))}
      </div>
    </div>
  );
}
