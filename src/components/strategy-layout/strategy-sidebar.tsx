"use client";

import {
  ChevronRight,
  Plus,
  CircleHelp,
  FileText,
} from "lucide-react";

type StrategySection = {
  id: string;
  title: string;
  progress: string;
};

type Props = {
  strategies: StrategySection[];
  activeStrategy: string;
  setActiveStrategy: (id: string) => void;
};

export default function StrategySidebar({
  strategies,
  activeStrategy,
  setActiveStrategy,
}: Props) {
  return (
    <aside className="hidden w-[320px] shrink-0 border-r border-[#EAECF0] bg-[#FAFAFA] px-8 py-8 lg:block">
      <div>
        <p className="mb-5 text-[15px] font-medium text-[#344054]">
          Documents uploaded
        </p>

        <div className="flex items-center justify-between rounded-[18px] border border-[#EAECF0] bg-white px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#EAECF0]">
              <FileText className="h-5 w-5 text-[#2F6FED]" />
            </div>

            <div>
              <p className="max-w-[120px] truncate text-sm font-medium text-[#101828]">
                Business requ...
              </p>

              <p className="mt-1 text-xs font-semibold text-[#2F6FED]">
                DOCX
              </p>
            </div>
          </div>

          <p className="text-sm text-[#667085]">2.5MB</p>
        </div>
      </div>

      <p className="mt-10 text-[15px] leading-7 text-[#667085]">
        We have created a tailored marketing strategy for your unique use
        case and problem.
      </p>

      <div className="mt-10">
        <h2 className="mb-5 text-base font-medium text-[#344054]">
          Your Strategy
        </h2>

        <div className="space-y-3">
          {strategies.map((item) => {
            const active = activeStrategy === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveStrategy(item.id)}
                className={`flex w-full items-center justify-between rounded-[18px] border px-4 py-4 text-left transition-all duration-200 ${
                  active
                    ? "border-[#EAECF0] bg-white"
                    : "border-transparent hover:bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-[3px] h-5 w-5 rounded-full border-[5px] border-[#2F6FED]" />

                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-[15px] font-medium text-[#101828]">
                        {item.title}
                      </p>

                      <CircleHelp className="h-4 w-4 text-[#98A2B3]" />
                    </div>

                    <p className="mt-1 text-sm text-[#667085]">
                      {item.progress}
                    </p>
                  </div>
                </div>

                <div className="h-3 w-3 rounded-full bg-[#F59E0B]" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-10">
        <p className="mb-5 text-[15px] leading-7 text-[#667085]">
          If you need to create more funnels for specific use cases, click
          on the button below.
        </p>

        <button className="flex w-full items-center justify-between rounded-[24px] bg-[#D9DEE8] px-5 py-5 transition-all duration-200 hover:bg-[#CED5E2]">
          <div className="flex items-center gap-4">
            <div className="flex h-[56px] w-[56px] items-center justify-center rounded-[16px] bg-[#2F6FED] shadow-sm">
              <Plus className="h-7 w-7 text-white" strokeWidth={2.2} />
            </div>

            <p className="text-[18px] font-medium text-[#101828]">
              Create New Strategy
            </p>
          </div>

          <ChevronRight
            className="h-7 w-7 text-[#101828]"
            strokeWidth={2}
          />
        </button>
      </div>
    </aside>
  );
}