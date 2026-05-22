import { ChevronRight, CircleHelp, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { PptImg } from "@/components/icons/ppt-img";
import { PdfImg } from "@/components/icons/pdf-img";
import { DocsImg } from "@/components/icons/docs-img";
import { InlineSpinner } from "@/components/icons/loader/inline-spinner";
import {
  DUMMY_STRATEGY_PHASES,
  DEFAULT_UPLOADED_DOCS,
  type MockUploadedDoc,
} from "@/lib/dashboard-mock-data";
import { StrategyIcon } from "@/components/icons/strategy";

const STRATEGY_SIDEBAR_ASIDE_CLASS =
  "sticky top-[72px] z-20 hidden h-[calc(100vh-72px)] w-full shrink-0 flex-col gap-5 " +
  "overflow-hidden border-r border-[#EAECF0] bg-white px-4 py-5 md:top-[83px] " +
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

export default function StrategySidebar({
  loading,
  documents = DEFAULT_UPLOADED_DOCS,
  strategyPhases = DUMMY_STRATEGY_PHASES,
  className,
}: {
  loading: boolean;
  documents?: MockUploadedDoc[];
  strategyPhases?: readonly { title: string; tasks: string }[];
  className?: string;
}) {
  const docs = documents.length > 0 ? documents : DEFAULT_UPLOADED_DOCS;

  return (
    <aside className={cn(STRATEGY_SIDEBAR_ASIDE_CLASS, className)}>
      <div className="space-y-2.5">
        <h2 className="text-sm font-medium text-[#667085]">
          Documents uploaded
        </h2>
        {docs.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between rounded-[16px] border border-[#EAECF0] bg-white px-3 py-3 shadow-[0px_1px_2px_rgba(16,24,40,0.05)]"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              {docIcon(doc.type)}
              <p className="truncate text-[15px] font-medium text-[#101828]">
                {truncateName(doc.name)}
              </p>
            </div>
            <p className="shrink-0 text-sm text-[#667085]">{doc.size}</p>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 pt-0.5">
            <InlineSpinner size={20} />
            <p className="text-sm text-[#344054]">
              We are building your marketing strategy...
            </p>
          </div>
        )}
      </div>

      {!loading && (
        <>
          <p className="text-sm leading-6 text-[#667085]">
            We have created a tailored marketing strategy for your unique use
            case and problem.
          </p>

          <div>
            <h2 className="mb-3 text-sm font-medium text-[#667085]">
              Your Strategy
            </h2>
            <div className="space-y-1 rounded-[16px] border border-[#EAECF0] bg-white p-3 shadow-[0px_1px_2px_rgba(16,24,40,0.05)]">
              {strategyPhases.map((item, index) => (
                <div
                  key={item.title}
                  className={cn(
                    "flex items-start justify-between py-3",
                    index < strategyPhases.length - 1 &&
                      "border-b border-[#EAECF0]",
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    <StrategyIcon />
                    <div>
                      <div className="flex items-center gap-1">
                        <h3 className="text-[15px] font-medium text-[#101828]">
                          {item.title}
                        </h3>
                        <CircleHelp className="h-4 w-4 text-[#98A2B3]" />
                      </div>
                      <p className="mt-0.5 text-sm text-[#667085]">
                        {item.tasks}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#F59E0B]" />
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm leading-6 text-[#667085]">
            If you need to create more strategies for specific use cases, click
            on the button below.
          </p>

          <button
            type="button"
            className="flex w-full items-center justify-between rounded-[20px] bg-[#D9DEE8] px-3.5 py-3.5 transition-colors hover:bg-[#CED5E2]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#326AD1] shadow-sm">
                <Plus className="h-6 w-6 text-white" strokeWidth={2.2} />
              </div>
              <span className="text-left text-[15px] font-medium text-[#101828]">
                Create New Strategy
              </span>
            </div>
            <ChevronRight
              className="h-5 w-5 shrink-0 text-[#101828]"
              strokeWidth={2}
            />
          </button>
        </>
      )}
    </aside>
  );
}
