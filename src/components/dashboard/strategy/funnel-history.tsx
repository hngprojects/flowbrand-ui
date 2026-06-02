"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
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
  if (status === "complete")
    return (
      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
        Complete
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

function stageStatusDot(status?: string) {
  const normalized = status?.toLowerCase();

  if (normalized === "complete" || normalized === "completed") {
    return "bg-[#326AD1]";
  }

  if (normalized === "active") {
    return "bg-[#F59E0B]";
  }

  return "bg-[#D0D5DD]";
}

export function FunnelHistory({
  currentFunnelId,
}: {
  currentFunnelId?: string | null;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
    <div className="flex flex-col gap-2">
      {previous.map((funnel) => {
        const isExpanded = expandedId === funnel.funnelId;
        const hasStages = (funnel.stages?.length ?? 0) > 0;

        return (
          <div
            key={funnel.funnelId}
            className="rounded-[12px] border border-primary-80 bg-white overflow-hidden"
          >
            <button
              aria-expanded={isExpanded}
              aria-controls={`funnel-${funnel.funnelId}`}
              onClick={() => setExpandedId(isExpanded ? null : funnel.funnelId)}
              className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-neutral-900">
                  {funnel.businessName ?? "Unnamed Strategy"}
                </p>
                <p className="text-xs text-neutral-400 capitalize">
                  {funnel.creationPath?.replace("_", " ") ?? ""}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                {statusBadge(funnel.status)}
                <ChevronRight
                  className={cn(
                    "h-4 w-4 text-neutral-400 transition-transform duration-200",
                    isExpanded && "rotate-90",
                  )}
                />
              </div>
            </button>

            {isExpanded && hasStages && (
              <div
                id={`funnel-${funnel.funnelId}`}
                className="border-t border-primary-80 px-4 py-3 flex flex-col gap-2"
              >
                {funnel.stages?.map((stage) => (
                  <div
                    key={stage.stageId}
                    className="flex items-center gap-2.5"
                  >
                    <div
                      className={cn(
                        "h-2 w-2 shrink-0 rounded-full",
                        stageStatusDot(stage.status),
                      )}
                    />
                    <p className="text-sm text-neutral-700">{stage.name}</p>
                    <p className="ml-auto text-xs text-neutral-400 capitalize">
                      {stage.status}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {isExpanded && !hasStages && (
              <div className="border-t border-primary-80 px-4 py-3">
                <p className="text-xs text-neutral-400">
                  No stage details available.
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
