import type { FunnelDetailApi, FunnelStageApi } from "@/lib/funnel-api-types";

export type FunnelTaskDisplay = {
  id: string;
  title: string;
  description: string;
  status?: string;
  resources: { label: string; href: string }[];
};

export type StrategyPhaseDisplay = {
  title: string;
  tasks: string;
  status?: string;
};

export type FunnelFocusDisplay = {
  phase: string;
  progress: string;
  subtitle: string;
};

function stageTaskSummary(stage: FunnelStageApi): string {
  const complete = stage.tasksComplete ?? 0;
  const total = stage.tasksTotal ?? stage.tasks?.length ?? 0;
  return `${complete}/${total} tasks`;
}

export function mapStagesToStrategyPhases(
  stages: FunnelStageApi[] | undefined,
  completedStageIds: string[] = [],
): StrategyPhaseDisplay[] {
  if (!stages?.length) return [];

  return stages.map((stage) => ({
    title: stage.name,
    tasks: stageTaskSummary(stage),
    status:
      stage.stageId && completedStageIds.includes(stage.stageId)
        ? "complete"
        : stage.status,
  }));
}

function pickFocusStage(
  stages: FunnelStageApi[],
  completedStageIds: string[] = [],
): FunnelStageApi | undefined {
  if (!stages.length) return undefined;

  const ordered = [...stages].sort(
    (a, b) => (a.position ?? 0) - (b.position ?? 0),
  );

  const next = ordered.find(
    (stage) => stage.stageId && !completedStageIds.includes(stage.stageId),
  );
  if (next) return next;

  return ordered[ordered.length - 1];
}

export function mapFunnelToFocus(
  funnel: FunnelDetailApi | null,
  completedStageIds: string[] = [],
): FunnelFocusDisplay | null {
  const stages = funnel?.stages;
  if (!stages?.length) return null;

  const focus = pickFocusStage(stages, completedStageIds);
  if (!focus) return null;

  const index = stages.findIndex((s) => s.stageId === focus.stageId);
  const position = focus.position ?? (index >= 0 ? index + 1 : 1);

  return {
    phase: focus.name,
    progress: `${position} of ${stages.length}`,
    subtitle:
      focus.explanation ??
      focus.actionPrompt ??
      "Complete the tasks below for this stage.",
  };
}

export function mapStageTasksToDisplay(
  stage: FunnelStageApi | undefined,
): FunnelTaskDisplay[] {
  const tasks = stage?.tasks;
  if (!tasks?.length) return [];

  return tasks.map((task) => ({
    id: task.id,
    title: task.name,
    description:
      task.description ??
      stage?.explanation ??
      stage?.actionPrompt ??
      "Complete this task to move your strategy forward.",
    status: task.status,
    resources: [],
  }));
}

export function getFocusStage(
  funnel: FunnelDetailApi | null,
  completedStageIds: string[] = [],
): FunnelStageApi | undefined {
  if (!funnel?.stages?.length) return undefined;
  return pickFocusStage(funnel.stages, completedStageIds);
}

export function funnelSidebarSummary(funnel: FunnelDetailApi | null): string {
  if (funnel?.businessName?.trim()) {
    return `Strategy for ${funnel.businessName.trim()}.`;
  }
  return "Your generated marketing strategy.";
}
