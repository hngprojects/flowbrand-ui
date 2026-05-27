"use client";

import StrategySidebar from "@/components/dashboard/strategy/strategy-sidebar";
import { StrategyMainPanel } from "@/components/dashboard/mesh-background";
import Loader from "@/components/ui/loader";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { StrategyIcon } from "@/components/icons/strategy";
import { LinkIcon } from "@/components/icons/link";
import OnboardingNavbar from "@/components/navigation/onboarding-navbar";
import { beginNewStrategyFlow } from "@/lib/begin-new-strategy";
import { useDashboardMockSession } from "@/hooks/use-dashboard-mock-session";
import {
  funnelSidebarSummary,
  type FunnelTaskDisplay,
} from "@/lib/funnel-display";
import {
  NO_STRATEGY_AVAILABLE_MESSAGE,
  STRATEGY_NOT_VIEWABLE_MESSAGE,
  useStrategyFunnel,
} from "@/hooks/queries/use-strategy-funnel";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { cn } from "@/lib/utils";

function StrategyGenerationLoading({
  message,
  onCancel,
}: {
  message: string;
  onCancel: () => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-8 overflow-y-auto px-4 py-8">
      <Loader text={message} />
      <button
        type="button"
        onClick={onCancel}
        className="shrink-0 rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-600"
      >
        Cancel
      </button>
    </div>
  );
}

function StrategyActionPanel({
  message,
  onTryAgain,
  onBackToOnboarding,
}: {
  message: string;
  onTryAgain?: () => void;
  onBackToOnboarding: () => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 overflow-y-auto px-4 py-8">
      <p className="max-w-md text-center text-sm text-gray-subtle">{message}</p>
      <div className="flex flex-wrap justify-center gap-3">
        {onTryAgain ? (
          <button
            type="button"
            onClick={onTryAgain}
            className="rounded-xl border border-black-25 bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-600 cursor-pointer"
          >
            Try again
          </button>
        ) : null}
        <button
          type="button"
          onClick={onBackToOnboarding}
          className="rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-650"
        >
          Back to onboarding
        </button>
      </div>
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
        checked
          ? "border-primary-500 bg-primary-500"
          : "border-black-35 bg-white",
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
              className="rounded-[16px] border border-black-25 bg-white p-5 shadow-[0px_1px_2px_rgba(16,24,40,0.05)] md:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-[17px] font-semibold text-main">
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
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-subtle">
                <p>{task.description}</p>
                {task.resources.length > 0 && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-subtle">
                      More Resources
                    </p>
                    <div className="mt-2 flex flex-col gap-2">
                      {task.resources.map((resource) => (
                        <div
                          key={resource.label}
                          className="flex items-center gap-1.5"
                        >
                          <LinkIcon />
                          <p className="text-sm text-primary-500">
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
          <p className="rounded-[16px] border border-black-25 bg-white p-5 text-sm text-gray-subtle">
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
              ? "cursor-pointer bg-primary-500 text-white hover:bg-primary-650"
              : "cursor-not-allowed bg-slate-50 text-main",
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
  const queryClient = useQueryClient();
  const uploadedFromStore = useOnboardingStore((s) => s.uploadedDocuments);
  const session = useDashboardMockSession();
  const {
    loading,
    loadingMessage,
    error,
    displayReady,
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
    generationAborted,
    hydratedFromStorage,
  } = useStrategyFunnel();

  const documents = useMemo(() => {
    const fromSession = session?.uploadedDocuments ?? [];
    if (fromSession.length > 0) return fromSession;
    return uploadedFromStore;
  }, [session, uploadedFromStore]);

  const strategySummary = funnelSidebarSummary(funnel);

  const handleCreateNewStrategy = useCallback(() => {
    router.push(beginNewStrategyFlow(queryClient));
  }, [queryClient, router]);

  const handleCancelGeneration = useCallback(() => {
    abortActiveGeneration();
  }, [abortActiveGeneration]);

  const goBackToOnboarding = useCallback(() => {
    router.replace(beginNewStrategyFlow(queryClient));
  }, [queryClient, router]);

  const showCancelledPanel = generationAborted && !loading && !funnelId;

  const showRecoveryPanel =
    hydratedFromStorage &&
    !loading &&
    !generationAborted &&
    !showCancelledPanel &&
    !displayReady;

  const recoveryMessage = !funnelId
    ? NO_STRATEGY_AVAILABLE_MESSAGE
    : (error ?? STRATEGY_NOT_VIEWABLE_MESSAGE);

  const mainPanelContent = showCancelledPanel ? (
    <StrategyActionPanel
      message="Strategy generation was cancelled."
      onTryAgain={() => retry()}
      onBackToOnboarding={goBackToOnboarding}
    />
  ) : showRecoveryPanel ? (
    <StrategyActionPanel
      message={recoveryMessage}
      onBackToOnboarding={goBackToOnboarding}
    />
  ) : null;

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <OnboardingNavbar
        loading={loading}
        documents={documents}
        strategyPhases={strategyPhases}
        strategySummary={loading ? undefined : strategySummary}
        onCreateNewStrategy={loading ? undefined : handleCreateNewStrategy}
      />

      {loading ? (
        <>
          <div className="hidden w-full flex-1 lg:flex">
            <StrategySidebar
              loading
              documents={documents}
              strategyPhases={strategyPhases}
            />
            <StrategyMainPanel className="min-h-[calc(100vh-83px)] w-full">
              <StrategyGenerationLoading
                message={loadingMessage}
                onCancel={handleCancelGeneration}
              />
            </StrategyMainPanel>
          </div>

          <StrategyMainPanel className="min-h-[calc(100vh-72px)] flex-1 lg:hidden">
            <StrategyGenerationLoading
              message={loadingMessage}
              onCancel={handleCancelGeneration}
            />
          </StrategyMainPanel>
        </>
      ) : mainPanelContent ? (
        <div className="dashboard-layout-class flex flex-1 flex-col lg:flex-row">
          <StrategySidebar
            loading={false}
            documents={documents}
            strategyPhases={strategyPhases}
            strategySummary={strategySummary}
            onCreateNewStrategy={handleCreateNewStrategy}
          />
          <StrategyMainPanel className="min-h-0 min-w-0 flex-1 md:w-2/3">
            {mainPanelContent}
          </StrategyMainPanel>
        </div>
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
                  <div className="mb-2 flex items-center justify-between text-sm font-medium text-gray-subtle">
                    <p>This week&apos;s focus</p>
                    <p>{focus.progress}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="flex items-center gap-3 text-2xl font-semibold text-main">
                      <StrategyIcon />
                      {focus.phase}
                    </p>
                    <p className="text-sm leading-relaxed text-gray-subtle md:text-md-accent">
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
