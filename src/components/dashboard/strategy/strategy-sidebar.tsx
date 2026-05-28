import { ChevronRight, CircleHelp, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { PptImg } from "@/components/icons/ppt-img";
import { PdfImg } from "@/components/icons/pdf-img";
import { DocsImg } from "@/components/icons/docs-img";
import { InlineSpinner } from "@/components/icons/loader/inline-spinner";
import type { MockUploadedDoc } from "@/lib/dashboard-mock-data";
import type { StrategyPhaseDisplay } from "@/lib/funnel-display";
import { STRATEGY_LOADING_MESSAGE } from "@/hooks/queries/use-strategy-funnel";
import { StrategyIcon } from "@/components/icons/strategy";

const STRATEGY_SIDEBAR_ASIDE_CLASS =
  "sticky top-[72px] z-20 hidden h-[calc(100vh-72px)] w-full shrink-0 flex-col " +
  "overflow-hidden border-r border-[#EAECF0] bg-white md:top-[83px] " +
  "md:flex md:h-[calc(100vh-83px)] md:w-1/3 md:max-w-[380px]";

function docIcon(type: MockUploadedDoc["type"]) {
  if (type === "PDF") return <PdfImg className="h-10 w-10 shrink-0" />;
  if (type === "PPT" || type === "PPTX")
    return <PptImg className="h-10 w-10 shrink-0" />;
  return <DocsImg className="h-10 w-10 shrink-0" />;
}

function truncateName(name: string, max = 18) {
  if (name.length <= max) return name;
  return `${name.slice(0, max - 3)}...`;
}

function phaseStatusDot(status?: string) {
  const normalized = status?.toLowerCase();
  if (normalized === "complete" || normalized === "completed") {
    return "bg-[#326AD1]";
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
  onCreateNewStrategy,
  className,
}: {
  loading: boolean;
  documents?: MockUploadedDoc[];
  strategyPhases?: readonly StrategyPhaseDisplay[];
  strategySummary?: string;
  onCreateNewStrategy?: () => void;
  className?: string;
}) {
  const hasPhases = strategyPhases.length > 0;
  const hasDocuments = documents.length > 0;

  return (
    <aside className={cn(STRATEGY_SIDEBAR_ASIDE_CLASS, className)}>
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 py-5">
        <div className="space-y-2.5">
          {hasDocuments ? (
            <>
              <h2 className="text-sm font-medium text-neutral-500">
                Documents uploaded
              </h2>
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-[16px] border border-primary-80 bg-white px-3 py-3 shadow-[0px_1px_2px_rgba(16,24,40,0.05)]"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    {docIcon(doc.type)}
                    <p className="truncate text-[15px] font-medium text-neutral-900">
                      {truncateName(doc.name)}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm text-neutral-500">
                    {doc.size}
                  </p>
                </div>
              ))}
            </>
          ) : null}

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
                            <CircleHelp className="h-4 w-4 text-neutral-400" />
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

            {onCreateNewStrategy ? (
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
            ) : null}
          </>
        )}
      </div>
    </aside>
  );
}
