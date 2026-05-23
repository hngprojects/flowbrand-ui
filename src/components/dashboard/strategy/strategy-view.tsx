"use client";

import StrategySidebar from "@/components/dashboard/strategy/strategy-sidebar";
import { StrategyMainPanel } from "@/components/dashboard/mesh-background";
import Loader from "@/components/ui/loader";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { StrategyIcon } from "@/components/icons/strategy";
import { LinkIcon } from "@/components/icons/link";
import OnboardingNavbar from "@/components/navigation/onboarding-navbar";
import { beginNewStrategyFlow } from "@/lib/begin-new-strategy";
import { loadDashboardMockSession } from "@/lib/dashboard-mock-session";
import type { DashboardMockSession } from "@/lib/dashboard-mock-data";
import {
  funnelSidebarSummary,
  type FunnelTaskDisplay,
} from "@/lib/funnel-display";
import {
  NO_STRATEGY_ERROR,
  useStrategyFunnel,
} from "@/hooks/queries/use-strategy-funnel";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { isNewStrategyFlow } from "@/lib/new-strategy";
import { ONBOARDING_UPLOAD_ROUTE } from "@/routes";
import { cn } from "@/lib/utils";

function StrategyGenerationLoading({
  message,
  hint,
  onCancel,
}: {
  message: string;
  hint?: string;
  onCancel: () => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-8 overflow-y-auto px-4 py-8">
      <Loader text={message} hint={hint} />
      <button
        type="button"
        onClick={onCancel}
        className="shrink-0 rounded-xl border border-[#EAECF0] px-4 py-2 text-sm font-medium text-[#667085] hover:bg-[#FAFBFC] hover:text-[#101828]"
      >
        Cancel
      </button>
    </div>
  );
}

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

function StrategyStageTasks({
  tasks,
  isCurrentStageComplete,
  onCompleteStage,
}: {
  tasks: FunnelTaskDisplay[];
  isCurrentStageComplete: boolean;
  onCompleteStage: () => void;
}) {
  const [checkedTasks, setCheckedTasks] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const allTasksComplete =
    tasks.length > 0 &&
    tasks.every(
      (task) => task.status === "complete" || checkedTasks.includes(task.id),
    );

  const handleSubmit = () => {
    if (!allTasksComplete || submitted || isCurrentStageComplete) return;
    onCompleteStage();
    setSubmitted(true);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task.id}
              className="rounded-[16px] border border-[#EAECF0] bg-white p-5 shadow-[0px_1px_2px_rgba(16,24,40,0.05)] md:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-[17px] font-semibold text-[#101828]">
                  {task.title}
                </h2>
                <TaskCheckbox
                  checked={
                    checkedTasks.includes(task.id) ||
                    task.status === "complete" ||
                    isCurrentStageComplete
                  }
                  onClick={() => {
                    if (submitted || isCurrentStageComplete) return;
                    setCheckedTasks((prev) =>
                      prev.includes(task.id)
                        ? prev.filter((id) => id !== task.id)
                        : [...prev, task.id],
                    );
                  }}
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
          ))
        ) : (
          <p className="rounded-[16px] border border-[#EAECF0] bg-white p-5 text-sm text-[#667085]">
            No tasks for the current stage yet. Try refreshing in a moment.
          </p>
        )}
      </div>

      <div className="flex justify-end pb-4">
        <button
          type="button"
          disabled={!allTasksComplete || submitted || isCurrentStageComplete}
          onClick={handleSubmit}
          className={cn(
            "rounded-[10px] px-10 py-3.5 text-sm font-semibold transition-colors",
            allTasksComplete && !submitted && !isCurrentStageComplete
              ? "cursor-pointer bg-[#326AD1] text-white hover:bg-[#2859B8]"
              : "cursor-not-allowed bg-[#D9DEE8] text-[#101828]",
          )}
        >
          {submitted || isCurrentStageComplete ? "Stage Complete ✓" : "Submit"}
        </button>
      </div>
    </>
  );
}

export function StrategyView() {
  const router = useRouter();
  const uploadedFromStore = useOnboardingStore((s) => s.uploadedDocuments);
  const [session] = useState<DashboardMockSession | null>(() =>
    typeof window !== "undefined" ? loadDashboardMockSession() : null,
  );
  const {
    loading,
    loadingMessage,
    loadingHint,
    error,
    funnelId,
    funnel,
    activeStageId,
    isCurrentStageComplete,
    completeCurrentStage,
    strategyPhases,
    focus,
    tasks,
    retry,
    abortActiveGeneration,
    hydratedFromStorage,
  } = useStrategyFunnel();

  const shouldRedirectToOnboarding =
    hydratedFromStorage &&
    !loading &&
    !funnelId &&
    !isNewStrategyFlow() &&
    error === NO_STRATEGY_ERROR;

  useEffect(() => {
    if (!shouldRedirectToOnboarding) return;
    router.replace(ONBOARDING_UPLOAD_ROUTE);
  }, [shouldRedirectToOnboarding, router]);

  const documents = useMemo(() => {
    const fromSession = session?.uploadedDocuments ?? [];
    if (fromSession.length > 0) return fromSession;
    return uploadedFromStore;
  }, [session, uploadedFromStore]);

  const strategySummary = funnelSidebarSummary(funnel);

  const handleCreateNewStrategy = useCallback(() => {
    router.push(beginNewStrategyFlow());
  }, [router]);

  const goBackToDocumentUpload = useCallback(() => {
    const uploadPath = beginNewStrategyFlow();
    abortActiveGeneration();
    router.replace(uploadPath);
  }, [abortActiveGeneration, router]);

  if (shouldRedirectToOnboarding) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <Loader text="Loading..." />
      </main>
    );
  }

  if (error && !loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 py-16">
        <p className="max-w-md text-center text-sm text-red-600">{error}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => retry()}
            className="rounded-xl border border-[#EAECF0] px-4 py-2 text-sm font-medium text-[#101828] hover:bg-[#FAFBFC]"
          >
            Try again
          </button>
          <button
            type="button"
            onClick={goBackToDocumentUpload}
            className="rounded-xl bg-[#326AD1] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2859B8]"
          >
            Back to document upload
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <OnboardingNavbar
        loading={loading}
        documents={documents}
        strategyPhases={strategyPhases}
        strategySummary={loading ? undefined : strategySummary}
        onCreateNewStrategy={loading ? undefined : handleCreateNewStrategy}
        onCancelGeneration={loading ? goBackToDocumentUpload : undefined}
      />

      {loading ? (
        <>
          <div className="hidden w-full flex-1 lg:flex">
            <StrategySidebar
              loading
              documents={documents}
              strategyPhases={strategyPhases}
              onCancelGeneration={goBackToDocumentUpload}
            />
            <StrategyMainPanel className="min-h-[calc(100vh-83px)] w-full">
              <StrategyGenerationLoading
                message={loadingMessage}
                hint={loadingHint}
                onCancel={goBackToDocumentUpload}
              />
            </StrategyMainPanel>
          </div>

          <StrategyMainPanel className="min-h-[calc(100vh-72px)] flex-1 lg:hidden">
            <StrategyGenerationLoading
              message={loadingMessage}
              hint={loadingHint}
              onCancel={goBackToDocumentUpload}
            />
          </StrategyMainPanel>
        </>
      ) : (
        <div className="dashboard-layout-class flex flex-1 flex-col lg:flex-row">
          <StrategySidebar
            loading={false}
            documents={documents}
            strategyPhases={strategyPhases}
            strategySummary={strategySummary}
            onCreateNewStrategy={handleCreateNewStrategy}
          />

          <StrategyMainPanel className="min-h-0 min-w-0 flex-1 md:w-2/3">
            <div className="flex flex-col gap-6 p-default md:py-6">
              {focus ? (
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm font-medium text-[#667085]">
                    <p>This week&apos;s focus</p>
                    <p>{focus.progress}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="flex items-center gap-3 text-2xl font-semibold text-[#101828]">
                      <StrategyIcon />
                      {focus.phase}
                    </p>
                    <p className="text-sm leading-relaxed text-[#667085] md:text-[15px]">
                      {focus.subtitle}
                    </p>
                  </div>
                </div>
              ) : null}

              <StrategyStageTasks
                key={activeStageId ?? "none"}
                tasks={tasks}
                isCurrentStageComplete={isCurrentStageComplete}
                onCompleteStage={completeCurrentStage}
              />
            </div>
          </StrategyMainPanel>
        </div>
      )}
    </div>
  );
}
