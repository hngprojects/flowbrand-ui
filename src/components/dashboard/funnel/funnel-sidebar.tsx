import type { ReactNode } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PptImg } from "@/components/icons/ppt-img";
import { PdfImg } from "@/components/icons/pdf-img";
import { DocsImg } from "@/components/icons/docs-img";
import { BlueBlackLogo } from "@/components/icons/blueblackLogo";
import { StrategyIcon } from "@/components/icons/strategy";
import type { MockUploadedDoc } from "@/lib/dashboard-mock-data";
import type { StrategyPhaseDisplay } from "@/lib/funnel-display";

function docIcon(type: MockUploadedDoc["type"]) {
  if (type === "PDF") return <PdfImg />;
  if (type === "PPT" || type === "PPTX") return <PptImg />;
  return <DocsImg />;
}

function phaseStatusDot(status?: string) {
  const normalized = status?.toLowerCase();
  if (normalized === "complete" || normalized === "completed") {
    return "bg-primary";
  }
  if (normalized === "active") {
    return "bg-accent ring-2 ring-accent/30";
  }
  return "bg-gray-300";
}

export default function FunnelSidebar({
  steps,
  loading,
  documents = [],
  strategyPhases = [],
  strategySummary,
  onCreateNewStrategy,
  className,
}: {
  steps: ReactNode;
  loading: boolean;
  documents?: MockUploadedDoc[];
  strategyPhases?: readonly StrategyPhaseDisplay[];
  strategySummary?: string;
  onCreateNewStrategy?: () => void;
  className?: string;
}) {
  const hasDocuments = documents.length > 0;
  const hasPhases = strategyPhases.length > 0;

  return (
    <aside
      className={cn(
        "sticky top-0 left-0 hidden h-screen overflow-auto border-r border-gray-200 bg-[#FFFFFF] px-section py-large space-y-section md:block md:w-1/3",
        className,
      )}
    >
      {hasDocuments ? (
        <div className="space-y-3">
          <h2 className="text-[16px] text-black-300">Documents uploaded</h2>
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between rounded-[20px] border border-gray-500 p-default"
            >
              <div className="flex items-center gap-default">
                {docIcon(doc.type)}
                <h3 className="text-[16px] text-foreground">
                  {doc.name.length > 16
                    ? `${doc.name.slice(0, 13)}...`
                    : doc.name}
                </h3>
              </div>
              <p className="text-[14px] text-black-300">{doc.size}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex items-center gap-default text-[16px] text-foreground">
        {loading && <BlueBlackLogo className="w-[25px]" />}
        {loading ? (
          steps
        ) : (
          <div className="flex flex-col gap-[20px]">
            <p>
              {strategySummary ?? "Your marketing strategy has been generated."}
            </p>
            {hasPhases ? (
              <div className="space-y-[12px]">
                <h2 className="text-[16px] text-black-300">Your Strategy</h2>
                <div className="space-y-[20px] rounded-[20px] border border-gray-500 p-[20px]">
                  {strategyPhases.map((item) => (
                    <div
                      key={`${item.title}-${item.status ?? "stage"}`}
                      className="flex items-start justify-between border-b border-gray-500 pb-4 last:border-none"
                    >
                      <div className="flex items-start gap-default">
                        <StrategyIcon />
                        <div className="flex flex-col">
                          <h3 className="text-[16px] text-foreground">
                            {item.title}
                          </h3>
                          <p className="text-[14px] text-black-300">
                            {item.tasks}
                          </p>
                        </div>
                      </div>
                      <div
                        className={cn(
                          "mt-1 h-default w-default shrink-0 rounded-full",
                          phaseStatusDot(item.status),
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-[14px] text-black-300">
                Stages will appear here once generation completes.
              </p>
            )}
          </div>
        )}
      </div>

      {!loading && onCreateNewStrategy ? (
        <Button
          type="button"
          variant="outline"
          onClick={onCreateNewStrategy}
          className="h-auto w-full gap-2 rounded-xl border-gray-500 py-3 text-sm font-semibold"
        >
          <Plus className="size-4" aria-hidden />
          Create new strategy
        </Button>
      ) : null}
    </aside>
  );
}
