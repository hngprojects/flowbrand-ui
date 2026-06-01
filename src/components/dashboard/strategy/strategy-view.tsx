"use client";

import StrategySidebar from "@/components/dashboard/strategy/strategy-sidebar";
import { StrategyMainPanel } from "@/components/dashboard/mesh-background";
import Loader from "@/components/ui/loader";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { StrategyIcon } from "@/components/icons/strategy";
import { LinkIcon } from "@/components/icons/link";
import OnboardingNavbar from "@/components/navigation/onboarding-navbar";
import { beginNewStrategyFlow } from "@/lib/begin-new-strategy";
import {
  funnelSidebarSummary,
  type FunnelTaskDisplay,
} from "@/lib/funnel-display";
import { resolveFunnelDocuments } from "@/lib/funnel-documents-storage";
import {
  NO_STRATEGY_AVAILABLE_MESSAGE,
  STRATEGY_NOT_VIEWABLE_MESSAGE,
  useStrategyFunnel,
} from "@/hooks/queries/use-strategy-funnel";
import { cn } from "@/lib/utils";
import { ClampableText } from "@/components/ui/clampable-text";
import { useUpdateTaskStatusMutation } from "@/hooks/mutations/use-task-mutations";
import { StageFeedback } from "@/components/dashboard/strategy/stage-feedback";
import { submitStageFeedback } from "@/actions/funnels";

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
      <p className="max-w-md text-center text-sm text-neutral-500">{message}</p>
      <div className="flex flex-wrap justify-center gap-3">
        {onTryAgain ? (
          <button
            type="button"
            onClick={onTryAgain}
            className="rounded-xl border border-primary-80 bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-600 cursor-pointer"
          >
            Try again
          </button>
        ) : null}
        <button
          type="button"
          onClick={onBackToOnboarding}
          className="rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-625"
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
          : "border-gray-650 bg-white",
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
  funnelId,
  activeStageId,
}: {
  tasks: FunnelTaskDisplay[];
  isCurrentStageComplete: boolean;
  onCompleteStage: () => Promise<void>;
  funnelId: string;
  activeStageId: string;
}) {
  const updateTask = useUpdateTaskStatusMutation(funnelId);
  const [checkedTasks, setCheckedTasks] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const allTasksComplete =
    tasks.length > 0 &&
    tasks.every(
      (task) => task.status === "complete" || checkedTasks.includes(task.id),
    );

  const isDone = submitted || isCurrentStageComplete;
  const canSubmit =
    allTasksComplete && comment.trim().length > 15 && !submitting && !isDone;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const trimmed = comment.trim();
      if (trimmed) {
        const res = await submitStageFeedback(funnelId, activeStageId, trimmed);
        if (!res.ok && res.status !== 409) {
          toast.error(
            res.error ?? "Could not submit feedback. Please try again.",
          );
          return;
        }
      }
      await onCompleteStage();
      setSubmitted(true);
    } catch {
      toast.error("Could not submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task.id}
              className="rounded-[16px] border border-primary-80 bg-white p-4 shadow-[0px_1px_2px_rgba(16,24,40,0.05)] md:p-5 lg:p-6"
            >
              <div className="flex items-start justify-between gap-3 md:gap-4">
                <h2 className="min-w-0 text-base font-semibold text-neutral-900 md:text-[17px]">
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
                    const isChecked =
                      checkedTasks.includes(task.id) ||
                      task.status === "complete";
                    const newStatus = isChecked ? "pending" : "complete";
                    setCheckedTasks((prev) =>
                      isChecked
                        ? prev.filter((id) => id !== task.id)
                        : [...prev, task.id],
                    );
                    updateTask.mutate({
                      stageId: activeStageId,
                      taskId: task.id,
                      status: newStatus,
                    });
                  }}
                />
              </div>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-neutral-500">
                <ClampableText
                  lines={5}
                  className="text-sm leading-relaxed text-neutral-500"
                >
                  {task.description}
                </ClampableText>
                {task.resources.length > 0 && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
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
          <p className="rounded-[16px] border border-primary-80 bg-white p-5 text-sm text-neutral-500">
            No tasks for the current stage yet. Try refreshing in a moment.
          </p>
        )}
      </div>

      <StageFeedback value={comment} onChange={setComment} disabled={isDone} />

      <div className="flex justify-end pb-2 md:pb-4">
        <button
          type="button"
          disabled={!canSubmit}
          onClick={handleSubmit}
          className={cn(
            "rounded-[10px] px-6 py-3 text-sm font-semibold transition-colors md:px-10 md:py-3.5",
            canSubmit
              ? "cursor-pointer bg-primary-500 text-white hover:bg-primary-625"
              : "cursor-not-allowed bg-primary-150 text-neutral-900",
          )}
        >
          {isDone ? "Stage Complete ✓" : submitting ? "Submitting…" : "Submit"}
        </button>
      </div>
    </>
  );
}

export function StrategyView() {
  const router = useRouter();
  const queryClient = useQueryClient();
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
    funnels,
    selectFunnel,
  } = useStrategyFunnel();

  const documents = useMemo(
    () =>
      funnelId ? resolveFunnelDocuments(funnelId, funnel?.creationPath) : [],
    [funnelId, funnel?.creationPath],
  );

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
    <div className="flex min-h-screen w-full flex-col bg-white md:h-[100dvh] md:overflow-hidden">
      <OnboardingNavbar
        loading={loading}
        documents={documents}
        strategyPhases={strategyPhases}
        strategySummary={loading ? undefined : strategySummary}
        funnels={funnels}
        activeFunnelId={funnelId}
        onSelectFunnel={selectFunnel}
        onCreateNewStrategy={loading ? undefined : handleCreateNewStrategy}
      />

      {loading ? (
        <>
          <div className="dashboard-layout-class hidden w-full flex-1 md:flex">
            <StrategySidebar
              loading
              documents={documents}
              strategyPhases={strategyPhases}
              funnels={funnels}
              activeFunnelId={funnelId}
              currentFunnelId={funnelId}
              onSelectFunnel={selectFunnel}
            />
            <StrategyMainPanel className="min-h-[calc(100vh-83px)] min-w-0 flex-1">
              <StrategyGenerationLoading
                message={loadingMessage}
                onCancel={handleCancelGeneration}
              />
            </StrategyMainPanel>
          </div>

          <StrategyMainPanel className="min-h-[calc(100vh-72px)] flex-1 md:hidden">
            <StrategyGenerationLoading
              message={loadingMessage}
              onCancel={handleCancelGeneration}
            />
          </StrategyMainPanel>
        </>
      ) : mainPanelContent ? (
        <div className="dashboard-layout-class flex min-h-0 flex-1 flex-col md:flex-row">
          <StrategySidebar
            loading={false}
            documents={documents}
            strategyPhases={strategyPhases}
            strategySummary={strategySummary}
            funnels={funnels}
            activeFunnelId={funnelId}
            currentFunnelId={funnelId}
            onSelectFunnel={selectFunnel}
            onCreateNewStrategy={handleCreateNewStrategy}
          />
          <StrategyMainPanel className="min-h-0 min-w-0 flex-1">
            {mainPanelContent}
          </StrategyMainPanel>
        </div>
      ) : (
        <div className="dashboard-layout-class flex min-h-0 flex-1 flex-col md:flex-row">
          <StrategySidebar
            loading={false}
            documents={documents}
            strategyPhases={strategyPhases}
            strategySummary={strategySummary}
            funnels={funnels}
            activeFunnelId={funnelId}
            currentFunnelId={funnelId}
            onSelectFunnel={selectFunnel}
            onCreateNewStrategy={handleCreateNewStrategy}
          />

          <StrategyMainPanel className="min-h-0 min-w-0 flex-1">
            <div className="flex flex-col gap-5 px-4 py-5 md:gap-6 md:px-5 md:py-6 lg:px-8">
              {focus ? (
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm font-medium text-neutral-500">
                    <p>This week&apos;s focus</p>
                    <p className="shrink-0">{focus.progress}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-xl font-semibold text-neutral-900 md:gap-3 md:text-2xl">
                      <StrategyIcon />
                      <span className="min-w-0">{focus.phase}</span>
                    </p>
                    <ClampableText
                      key={focus.subtitle}
                      lines={3}
                      className="text-sm leading-relaxed text-neutral-500 md:text-[15px]"
                    >
                      {focus.subtitle}
                    </ClampableText>
                  </div>
                </div>
              ) : null}

              <StrategyStageTasks
                key={activeStageId ?? "none"}
                tasks={tasks}
                isCurrentStageComplete={isCurrentStageComplete}
                onCompleteStage={completeCurrentStage}
                funnelId={funnelId ?? ""}
                activeStageId={activeStageId ?? ""}
              />
            </div>
          </StrategyMainPanel>
        </div>
      )}
    </div>
  );
}
