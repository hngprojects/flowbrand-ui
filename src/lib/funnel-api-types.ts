export type FunnelSource = "wizard" | "document_upload";

export type FunnelGenerationStatus =
  | "generating"
  | "active"
  | "failed"
  | string;

export type FunnelTaskApi = {
  id: string;
  position?: number;
  name: string;
  status?: string;
  description?: string;
};

export type FunnelStageApi = {
  stageId?: string;
  position?: number;
  name: string;
  channel?: string;
  status?: string;
  explanation?: string;
  actionPrompt?: string;
  tasks?: FunnelTaskApi[];
  tasksTotal?: number;
  tasksComplete?: number;
};

export type FunnelDetailApi = {
  funnelId: string;
  /** Primary display name from GET /api/funnels list and detail. */
  funnelName?: string;
  /** Legacy / account business name when funnelName is absent. */
  businessName?: string;
  creationPath?: string;
  status?: string;
  createdAt?: string;
  stages?: FunnelStageApi[];
};

export type FunnelGenerationSnapshot = {
  funnelId: string;
  status: FunnelGenerationStatus;
  redirect?: { to?: string };
  error?: { code?: string; message?: string; retry_endpoint?: string };
};

import { collectApiRecords, readRecord } from "@/lib/api-envelope";

function unwrapData(data: unknown): Record<string, unknown> | null {
  const root = readRecord(data);
  if (!root) return null;
  const nested = readRecord(root.data);
  return nested ?? root;
}

function readFunnelIdFromRecord(
  record: Record<string, unknown>,
): string | null {
  for (const key of ["funnel_id", "funnelId", "funnelID"] as const) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return null;
}

function parseFunnelTask(raw: unknown): FunnelTaskApi | null {
  const record = readRecord(raw);
  if (!record) return null;

  const id = record.id ?? record.taskId ?? record.task_id;
  const name = record.name ?? record.title;
  if (typeof id !== "string" || typeof name !== "string") return null;

  return {
    id,
    name,
    position: typeof record.position === "number" ? record.position : undefined,
    status: typeof record.status === "string" ? record.status : undefined,
    description:
      typeof record.description === "string" ? record.description : undefined,
  };
}

export function parseFunnelStage(raw: unknown): FunnelStageApi | null {
  const record = readRecord(raw);
  if (!record) return null;

  const name = record.name;
  if (typeof name !== "string" || !name.trim()) return null;

  const tasks = Array.isArray(record.tasks)
    ? record.tasks
        .map((t) => parseFunnelTask(t))
        .filter((t): t is FunnelTaskApi => t !== null)
    : undefined;

  return {
    stageId:
      (typeof record.stageId === "string" && record.stageId) ||
      (typeof record.stage_id === "string" && record.stage_id) ||
      undefined,
    position: typeof record.position === "number" ? record.position : undefined,
    name: name.trim(),
    channel: typeof record.channel === "string" ? record.channel : undefined,
    status: typeof record.status === "string" ? record.status : undefined,
    explanation:
      typeof record.explanation === "string" ? record.explanation : undefined,
    actionPrompt:
      typeof record.actionPrompt === "string"
        ? record.actionPrompt
        : typeof record.action_prompt === "string"
          ? record.action_prompt
          : undefined,
    tasks,
    tasksTotal:
      typeof record.tasksTotal === "number"
        ? record.tasksTotal
        : typeof record.tasks_total === "number"
          ? record.tasks_total
          : tasks?.length,
    tasksComplete:
      typeof record.tasksComplete === "number"
        ? record.tasksComplete
        : typeof record.tasks_complete === "number"
          ? record.tasks_complete
          : undefined,
  };
}

export function parseFunnelIdFromGenerate(data: unknown): string | null {
  for (const record of collectApiRecords(data)) {
    const direct = readFunnelIdFromRecord(record);
    if (direct) return direct;

    const nestedFunnel = readRecord(record.funnel);
    if (nestedFunnel) {
      const fromFunnel = readFunnelIdFromRecord(nestedFunnel);
      if (fromFunnel) return fromFunnel;
    }
  }
  return null;
}

function normalizeGenerationStatus(
  raw: unknown,
): FunnelGenerationStatus | null {
  if (typeof raw !== "string") return null;
  const value = raw.toLowerCase();
  if (value === "active" || value === "completed" || value === "complete") {
    return "active";
  }
  if (value === "failed" || value === "error") {
    return "failed";
  }
  if (value === "generating" || value === "pending" || value === "processing") {
    return "generating";
  }
  return raw;
}

export function parseGenerationStatus(
  data: unknown,
  knownFunnelId?: string,
): FunnelGenerationSnapshot | null {
  for (const node of collectApiRecords(data)) {
    const status = normalizeGenerationStatus(node.status);
    if (!status) continue;

    const funnelId =
      readFunnelIdFromRecord(node) ?? knownFunnelId?.trim() ?? null;
    if (!funnelId) continue;

    const redirect = readRecord(node.redirect) as { to?: string } | undefined;
    const error = readRecord(node.error) as
      | { code?: string; message?: string; retry_endpoint?: string }
      | undefined;

    const redirectTo =
      typeof redirect?.to === "string" ? redirect.to.trim() : "";
    const resolvedStatus =
      redirectTo.length > 0 && status === "generating" ? "active" : status;

    return {
      funnelId,
      status: resolvedStatus,
      redirect: redirect ?? undefined,
      error: error ?? undefined,
    };
  }
  return null;
}

/** At least one named stage exists (sidebar + focus can render). */
export function funnelHasMinimalContent(detail: FunnelDetailApi): boolean {
  return (detail.stages ?? []).some((stage) => Boolean(stage.name?.trim()));
}

/** True when the dashboard has enough data to render (not just status=active). */
export function funnelHasDisplayContent(detail: FunnelDetailApi): boolean {
  const stages = detail.stages ?? [];
  if (stages.length === 0) return false;

  return stages.some(
    (stage) =>
      Boolean(stage.name?.trim()) &&
      ((stage.tasks?.length ?? 0) > 0 ||
        (stage.tasksTotal ?? 0) > 0 ||
        Boolean(stage.explanation?.trim()) ||
        Boolean(stage.actionPrompt?.trim())),
  );
}

export function funnelDetailIsReady(detail: FunnelDetailApi): boolean {
  return funnelHasDisplayContent(detail);
}

function buildFunnelDetailFromRecord(
  node: Record<string, unknown>,
  funnelId: string,
): FunnelDetailApi {
  const stages = Array.isArray(node.stages)
    ? node.stages
        .map((s) => parseFunnelStage(s))
        .filter((s): s is FunnelStageApi => s !== null)
    : undefined;

  return {
    funnelId,
    funnelName:
      typeof node.funnelName === "string"
        ? node.funnelName
        : typeof node.funnel_name === "string"
          ? node.funnel_name
          : undefined,
    businessName:
      typeof node.businessName === "string"
        ? node.businessName
        : typeof node.business_name === "string"
          ? node.business_name
          : undefined,
    creationPath:
      typeof node.creationPath === "string"
        ? node.creationPath
        : typeof node.creation_path === "string"
          ? node.creation_path
          : undefined,
    status: typeof node.status === "string" ? node.status : undefined,
    createdAt:
      typeof node.createdAt === "string"
        ? node.createdAt
        : typeof node.created_at === "string"
          ? node.created_at
          : undefined,
    stages,
  };
}

export function parseFunnelDetail(data: unknown): FunnelDetailApi | null {
  let fallback: FunnelDetailApi | null = null;

  for (const node of collectApiRecords(data)) {
    const funnelId = readFunnelIdFromRecord(node);
    if (!funnelId) continue;

    const parsed = buildFunnelDetailFromRecord(node, funnelId);
    if ((parsed.stages?.length ?? 0) > 0) {
      return parsed;
    }
    if (!fallback) fallback = parsed;
  }

  return fallback;
}

export function parseFunnelStagesList(data: unknown): FunnelStageApi[] {
  if (Array.isArray(data)) {
    return data
      .map((item) => parseFunnelStage(item))
      .filter((s): s is FunnelStageApi => s !== null);
  }

  for (const node of collectApiRecords(data)) {
    if (Array.isArray(node)) {
      return node
        .map((item) => parseFunnelStage(item))
        .filter((s): s is FunnelStageApi => s !== null);
    }

    for (const key of ["stages", "items", "data"] as const) {
      const value = node[key];
      if (Array.isArray(value)) {
        return value
          .map((item) => parseFunnelStage(item))
          .filter((s): s is FunnelStageApi => s !== null);
      }
    }
  }

  return [];
}

function parseFunnelListItem(raw: unknown): FunnelDetailApi | null {
  const record = readRecord(raw);
  if (!record) return null;

  const funnelId = readFunnelIdFromRecord(record);
  if (!funnelId) return null;

  return buildFunnelDetailFromRecord(record, funnelId);
}

export function parseFunnelList(data: unknown): FunnelDetailApi[] {
  const node = unwrapData(data);
  if (!node) return [];

  for (const key of ["funnels", "items", "results"] as const) {
    const list = node[key];
    if (Array.isArray(list)) {
      return list
        .map((item) => parseFunnelListItem(item))
        .filter((f): f is FunnelDetailApi => f !== null);
    }
  }

  return [];
}
