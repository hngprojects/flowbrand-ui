"use client";

import { ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { PptImg } from "@/components/icons/ppt-img";
import { PdfImg } from "@/components/icons/pdf-img";
import { DocsImg } from "@/components/icons/docs-img";
import { InlineSpinner } from "@/components/icons/loader/inline-spinner";
import type { StrategyPhaseDisplay } from "@/lib/funnel-display";
import { STRATEGY_LOADING_MESSAGE } from "@/hooks/queries/use-strategy-funnel";
import { StrategyIcon } from "@/components/icons/strategy";
import { FunnelSwitcher } from "@/components/dashboard/strategy/funnel-switcher";
import { StageHelpPopover } from "@/components/dashboard/strategy/stage-help-popover";
import type {
  FunnelListItemDisplay,
  UploadedDocDisplay,
} from "@/lib/funnel-display";

const STRATEGY_SIDEBAR_ASIDE_CLASS =
  "sticky top-[72px] z-20 hidden h-[calc(100vh-72px)] w-full shrink-0 flex-col " +
  "overflow-hidden border-r border-[#EAECF0] bg-white md:top-[83px] " +
  "md:flex md:h-[calc(100vh-83px)] md:w-1/3 md:max-w-[380px]";

function docIcon(type: UploadedDocDisplay["type"]) {
  if (type === "PDF") return <PdfImg className="h-10 w-10 shrink-0" />;
  if (type === "PPT" || type === "PPTX")
    return <PptImg className="h-10 w-10 shrink-0" />;
  return <DocsImg className="h-10 w-10 shrink-0" />;
}

function phaseStatusDot(status?: string) {
  const normalized = status?.toLowerCase();
  if (normalized === "complete" || normalized === "completed") {
    return "bg-[#22C55E]";
  }
  if (normalized === "active") {
    return "bg-[#F59E0B] ring-2 ring-[#F59E0B]/30";
  }
  return "bg-[#D0D5DD]";
}

export default function StrategySidebar({
  loading,
  documents = [],
  strategyPhases = [],
  strategySummary,
  funnels = [],
  activeFunnelId = null,
  onSelectFunnel,
  onCreateNewStrategy,
  className,
}: {
  loading: boolean;
  documents?: UploadedDocDisplay[];
  strategyPhases?: readonly StrategyPhaseDisplay[];
  strategySummary?: string;
  funnels?: readonly FunnelListItemDisplay[];
  activeFunnelId?: string | null;
  onSelectFunnel?: (funnelId: string) => void;
  onCreateNewStrategy?: () => void;
  className?: string;
}) {
  const hasPhases = strategyPhases.length > 0;
  const hasDocuments = documents.length > 0;

  return (
    <aside className={cn(STRATEGY_SIDEBAR_ASIDE_CLASS, className)}>
      <div className="scrollbar-none flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-3 py-4 lg:gap-5 lg:px-4 lg:py-5">
        {onSelectFunnel && funnels.length > 0 ? (
          <FunnelSwitcher
            funnels={funnels}
            activeFunnelId={activeFunnelId}
            onSelectFunnel={onSelectFunnel}
          />
        ) : null}

        <div className="space-y-2.5">
          {hasDocuments && (
            <>
              <h2 className="text-sm font-medium text-neutral-500">
                Documents uploaded
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    title={doc.name}
                    className="flex h-16 w-16 items-center justify-center rounded-[14px] border border-primary-80 bg-white shadow-[0px_1px_2px_rgba(16,24,40,0.05)]"
                  >
                    {docIcon(doc.type)}
                  </div>
                ))}
              </div>
            </>
          )}

          {loading && (
            <div className="flex items-center gap-2 pt-0.5">
              <InlineSpinner size={20} />
              <p className="text-sm text-[#344054]">
                {STRATEGY_LOADING_MESSAGE}
              </p>
            </div>
          )}
        </div>

        {!loading && (
          <>
            <p className="text-sm leading-6 text-neutral-500">
              {strategySummary ??
                "We have created a tailored marketing strategy for your unique use case and problem."}
            </p>
            {hasPhases ? (
              <div>
                <h2 className="mb-3 text-sm font-medium text-neutral-500">
                  Your Strategy
                </h2>
                <div className="space-y-1 rounded-[16px] border border-primary-80 bg-white p-3 shadow-[0px_1px_2px_rgba(16,24,40,0.05)]">
                  {strategyPhases.map((item, index) => (
                    <div
                      key={`${item.title}-${item.status ?? index}`}
                      className={cn(
                        "flex items-start justify-between py-3",
                        index < strategyPhases.length - 1 &&
                          "border-b border-primary-80",
                      )}
                    >
                      <div className="flex items-start gap-2.5">
                        <StrategyIcon />
                        <div>
                          <div className="flex items-center gap-1">
                            <h3 className="text-[15px] font-medium text-neutral-900">
                              {item.title}
                            </h3>
                            {item.explanation ? (
                              <StageHelpPopover
                                title={item.title}
                                explanation={item.explanation}
                              />
                            ) : null}
                          </div>
                          <p className="mt-0.5 text-sm text-neutral-500">
                            {item.tasks}
                          </p>
                        </div>
                      </div>
                      <div
                        className={cn(
                          "mt-2 h-2.5 w-2.5 shrink-0 rounded-full",
                          phaseStatusDot(item.status),
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-neutral-500">
                Stages will appear here once generation completes.
              </p>
            )}
            {onCreateNewStrategy && (
              <>
                <p className="text-sm leading-6 text-neutral-500">
                  If you need to create more strategies for specific use cases,
                  click on the button below.
                </p>
                <button
                  type="button"
                  onClick={onCreateNewStrategy}
                  className="flex w-full items-center justify-between rounded-[20px] bg-primary-150 px-3.5 py-3.5 transition-colors hover:bg-primary-125"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-primary-500 shadow-sm">
                      <Plus className="h-6 w-6 text-white" strokeWidth={2.2} />
                    </div>
                    <span className="text-left text-[15px] font-medium text-neutral-900">
                      Create New Strategy
                    </span>
                  </div>
                  <ChevronRight
                    className="h-5 w-5 shrink-0 text-neutral-900"
                    strokeWidth={2}
                  />
                </button>
              </>
            )}
          </>
        )}
      </div>
    </aside>
  );
}
