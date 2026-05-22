"use client";

import StrategySidebar from "@/components/dashboard/strategy/strategy-sidebar";
import { StrategyMainPanel } from "@/components/dashboard/mesh-background";
import Loader from "@/components/ui/loader";
import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { StrategyIcon } from "@/components/icons/strategy";
import { LinkIcon } from "@/components/icons/link";
import OnboardingNavbar from "@/components/navigation/onboarding-navbar";
import { showStrategyPreviewToast } from "@/lib/strategy-preview-toast";
import { getDashboardMockSessionOrDefaults } from "@/lib/dashboard-mock-session";
import {
  DUMMY_STRATEGY_FOCUS,
  DUMMY_STRATEGY_TASKS,
  DUMMY_STRATEGY_PHASES,
} from "@/lib/dashboard-mock-data";
import { cn } from "@/lib/utils";

const LOADING_MS = 4500;

function TaskCheckbox({
  checked,
  onClick,
}: {
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Mark task complete"
      className={cn(
        "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-all",
        checked ? "border-[#326AD1] bg-[#326AD1]" : "border-[#D0D5DD] bg-white",
      )}
    >
      {checked && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
    </button>
  );
}

export function StrategyView() {
  const [session] = useState(() => getDashboardMockSessionOrDefaults());
  const [loading, setLoading] = useState(true);
  const [checkedTasks, setCheckedTasks] = useState<string[]>([]);

  useEffect(() => {
    showStrategyPreviewToast();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), LOADING_MS);
    return () => clearTimeout(timer);
  }, []);

  const toggleTask = (id: string) => {
    setCheckedTasks((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <OnboardingNavbar
        loading={loading}
        documents={session.uploadedDocuments}
        strategyPhases={DUMMY_STRATEGY_PHASES}
      />

      {loading ? (
        <>
          <div className="w-full hidden flex-1 lg:flex">
            <StrategySidebar
              loading
              documents={session.uploadedDocuments}
              strategyPhases={DUMMY_STRATEGY_PHASES}
            />
            <StrategyMainPanel className="min-h-[calc(100vh-83px)] w-full">
              <div className="flex flex-1 items-center justify-center px-4">
                <Loader
                  className="h-full w-full"
                  text="Building your marketing strategy..."
                />
              </div>
            </StrategyMainPanel>
          </div>

          <StrategyMainPanel className="min-h-[calc(100vh-72px)] flex-1 lg:hidden">
            <div className="flex flex-1 items-center justify-center px-4">
              <Loader
                className="h-full w-full"
                text="Building your marketing strategy..."
              />
            </div>
          </StrategyMainPanel>
        </>
      ) : (
        <div className="dashboard-layout-class flex flex-1 flex-col lg:flex-row">
          <StrategySidebar
            loading={false}
            documents={session.uploadedDocuments}
            strategyPhases={DUMMY_STRATEGY_PHASES}
          />

          <StrategyMainPanel className="min-h-0 min-w-0 flex-1 md:w-2/3">
            <div className="flex flex-col gap-6 p-default md:py-6">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm font-medium text-[#667085]">
                  <p>This week&apos;s focus</p>
                  <p>{DUMMY_STRATEGY_FOCUS.progress}</p>
                </div>
                <div className="space-y-2">
                  <p className="flex items-center gap-3 text-2xl font-semibold text-[#101828]">
                    <StrategyIcon />
                    {DUMMY_STRATEGY_FOCUS.phase}
                  </p>
                  <p className="text-sm leading-relaxed text-[#667085] md:text-[15px]">
                    {DUMMY_STRATEGY_FOCUS.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {DUMMY_STRATEGY_TASKS.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-[16px] border border-[#EAECF0] bg-white p-5 shadow-[0px_1px_2px_rgba(16,24,40,0.05)] md:p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="text-[17px] font-semibold text-[#101828]">
                        {task.title}
                      </h2>
                      <TaskCheckbox
                        checked={checkedTasks.includes(task.id)}
                        onClick={() => toggleTask(task.id)}
                      />
                    </div>
                    <div className="mt-3 space-y-3 text-sm leading-relaxed text-[#667085]">
                      <p>{task.description}</p>
                      {task.resources.length > 0 && (
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-[#667085]">
                            More Resources
                          </p>
                          <div className="mt-2 flex flex-col gap-2">
                            {task.resources.map((resource) => (
                              <div
                                key={resource.label}
                                className="flex items-center gap-1.5"
                              >
                                <LinkIcon />
                                <p className="text-sm text-[#326AD1]">
                                  {resource.label}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pb-4">
                <button
                  type="button"
                  className="rounded-[10px] bg-[#D9DEE8] px-10 py-3.5 text-sm font-semibold text-[#101828] transition-colors hover:bg-[#CED5E2]"
                >
                  Submit
                </button>
              </div>
            </div>
          </StrategyMainPanel>
        </div>
      )}
    </div>
  );
}
