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
  explanation?: string;
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
    explanation: stage.explanation ?? stage.actionPrompt ?? undefined,
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

export type UploadedDocDisplay = {
  id: string;
  name: string;
  size: string;
  type: "DOC" | "DOCX" | "PDF" | "PPT" | "PPTX";
};

export function funnelSidebarSummary(funnel: FunnelDetailApi | null): string {
  if (funnel?.businessName?.trim()) {
    return `Strategy for ${funnel.businessName.trim()}.`;
  }
  return "Your generated marketing strategy.";
}

export type FunnelListItemDisplay = {
  funnelId: string;
  label: string;
  subtitle: string;
  status?: string;
};

function formatFunnelCreatedAt(createdAt: string | undefined): string {
  if (!createdAt) return "";
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Human-readable creation path; replaces all underscores for unknown values. */
export function formatCreationPathLabel(creationPath?: string): string {
  if (!creationPath) return "";
  if (creationPath === "document_upload") return "From documents";
  if (creationPath === "voice") return "From voice";
  if (creationPath === "wizard") return "From questions";
  return creationPath.replace(/_/g, " ");
}

function funnelCreationPathLabel(creationPath: string | undefined): string {
  const label = formatCreationPathLabel(creationPath);
  return label || "Strategy";
}

export function mapFunnelToListItem(
  funnel: FunnelDetailApi,
): FunnelListItemDisplay {
  const label = funnel.businessName?.trim() || "Untitled strategy";
  const subtitleParts = [
    funnelCreationPathLabel(funnel.creationPath),
    formatFunnelCreatedAt(funnel.createdAt),
  ].filter(Boolean);

  return {
    funnelId: funnel.funnelId,
    label,
    subtitle: subtitleParts.join(" · "),
    status: funnel.status,
  };
}

export function sortFunnelsByRecency(
  funnels: FunnelDetailApi[],
): FunnelDetailApi[] {
  return [...funnels].sort((a, b) => {
    const aTime = Date.parse(a.createdAt ?? "");
    const bTime = Date.parse(b.createdAt ?? "");
    const aValid = Number.isFinite(aTime) ? aTime : 0;
    const bValid = Number.isFinite(bTime) ? bTime : 0;
    return bValid - aValid;
  });
}

export function mapFunnelsToListItems(
  funnels: FunnelDetailApi[],
): FunnelListItemDisplay[] {
  return sortFunnelsByRecency(funnels).map((funnel) =>
    mapFunnelToListItem(funnel),
  );
}
