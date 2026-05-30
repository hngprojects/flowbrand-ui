"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchFunnelDisplay,
  fetchFunnelList,
  fetchGenerationStatus,
} from "@/lib/funnel-query-fns";
import {
  getFocusStage,
  mapFunnelToFocus,
  mapFunnelsToListItems,
  mapStageTasksToDisplay,
  mapStagesToStrategyPhases,
  type FunnelListItemDisplay,
} from "@/lib/funnel-display";
import { queryKeys } from "@/lib/query-keys";
import {
  clearActiveFunnelGeneration,
  clearStrategyAutoResolveSkipped,
  loadActiveFunnelGeneration,
  markStrategyAutoResolveSkipped,
  saveActiveFunnelGeneration,
  shouldSkipStrategyAutoResolve,
} from "@/lib/funnel-generation-storage";
import {
  getCompletedStages,
  markStageComplete,
} from "@/lib/stage-progress-storage";
import { funnelHasDisplayContent } from "@/lib/funnel-api-types";
import type { FunnelDetailApi } from "@/lib/funnel-api-types";
import { STRATEGY_GENERATION_FAILED_MESSAGE } from "@/lib/funnel-generation-errors";
import { flowLog } from "@/lib/flow-debug-log";
import { completeStage } from "@/lib/complete-state";

/** Poll every ~3s after the first 30s; faster early when jobs often finish. */
const POLL_MS = 3000;
const FAST_POLL_MS = 1500;
const FAST_POLL_WINDOW_MS = 30_000;
const MAX_WALL_MS = 8 * 60 * 1000;
const AGGRESSIVE_PROBE_AFTER_MS = 15 * 1000;
const TICK_MS = 1000;

export const STRATEGY_LOADING_MESSAGE = "Building your marketing strategy...";

export const NO_STRATEGY_ERROR =
  "No strategy found. Complete onboarding to create one.";

export const NO_STRATEGY_AVAILABLE_MESSAGE =
  "You don't have a strategy yet. Create one through onboarding to get started.";

export const STRATEGY_NOT_VIEWABLE_MESSAGE =
  "We couldn't load your strategy. It may still be generating or is no longer available.";

function generationPollIntervalMs(
  pollStartedAt: number | null,
  status: string | undefined,
): number | false {
  if (status === "active" || status === "failed") return false;
  if (pollStartedAt !== null && Date.now() - pollStartedAt > MAX_WALL_MS) {
    return false;
  }
  const elapsed = pollStartedAt ? Date.now() - pollStartedAt : 0;
  return elapsed < FAST_POLL_WINDOW_MS ? FAST_POLL_MS : POLL_MS;
}

/** Poll funnel detail until stages have tasks/explanations (independent of status=active). */
function displayContentPollIntervalMs(
  pollStartedAt: number | null,
): number | false {
  if (pollStartedAt !== null && Date.now() - pollStartedAt > MAX_WALL_MS) {
    return false;
  }
  const elapsed = pollStartedAt ? Date.now() - pollStartedAt : 0;
  return elapsed < FAST_POLL_WINDOW_MS ? FAST_POLL_MS : POLL_MS;
}

/** SSR-safe defaults — sessionStorage is hydrated in useEffect after mount. */
function readInitialStrategyState() {
  return {
    funnelId: null as string | null,
    resolvedId: false,
    pollStartedAt: null as number | null,
    hydratedFromStorage: false,
  };
}

function readFunnelStartedAt(createdAt: string | undefined): number | null {
  if (!createdAt) return null;
  const timestamp = Date.parse(createdAt);
  return Number.isFinite(timestamp) ? timestamp : null;
}

function pickDisplayFunnel(funnels: FunnelDetailApi[]): FunnelDetailApi | null {
  return (
    funnels.find((funnel) => funnel.status?.toLowerCase() === "active") ??
    funnels.find((funnel) => funnel.status?.toLowerCase() !== "failed") ??
    null
  );
}

export function useStrategyFunnel() {
  const queryClient = useQueryClient();
  const initial = readInitialStrategyState();
  const [funnelId, setFunnelId] = useState<string | null>(initial.funnelId);
  const [resolvedId, setResolvedId] = useState(initial.resolvedId);
  const [pollStartedAt, setPollStartedAt] = useState<number | null>(
    initial.pollStartedAt,
  );
  const [now, setNow] = useState(() => Date.now());
  const [stageProgressVersion, setStageProgressVersion] = useState(0);
  const [hydratedFromStorage, setHydratedFromStorage] = useState(
    initial.hydratedFromStorage,
  );
  const [generationAborted, setGenerationAborted] = useState(false);

  const completedStageIds = useMemo(() => {
    void stageProgressVersion;
    if (!funnelId) return [];
    return getCompletedStages(funnelId);
  }, [funnelId, stageProgressVersion]);

  const funnelListQuery = useQuery({
    queryKey: queryKeys.funnels.list(1),
    queryFn: () => fetchFunnelList(1),
    staleTime: 30_000,
  });

  const resolveFunnelId = useCallback(
    async (isActive: () => boolean = () => true): Promise<string | null> => {
      if (!isActive()) return null;

      if (shouldSkipStrategyAutoResolve()) {
        if (!isActive()) return null;
        setResolvedId(true);
        setHydratedFromStorage(true);
        return null;
      }

      const stored = loadActiveFunnelGeneration();
      if (stored?.funnelId) {
        if (!isActive()) return null;
        setFunnelId(stored.funnelId);
        setPollStartedAt(stored.startedAt ?? Date.now());
        setGenerationAborted(false);
        setResolvedId(true);
        setHydratedFromStorage(true);
        return stored.funnelId;
      }

      try {
        const funnels = await fetchFunnelList(1);
        if (!isActive()) return null;
        const displayFunnel = pickDisplayFunnel(funnels);
        const latest = displayFunnel?.funnelId ?? null;
        if (latest) {
          flowLog("strategy", "resolve funnelId → latest from list", {
            funnelId: latest,
          });
          const startedAt =
            readFunnelStartedAt(displayFunnel?.createdAt) ?? Date.now();
          saveActiveFunnelGeneration({
            funnelId: latest,
            idempotencyKey: crypto.randomUUID(),
            source: "wizard",
            startedAt,
          });
          setFunnelId(latest);
          setPollStartedAt(startedAt);
          setGenerationAborted(false);
        } else {
          flowLog("strategy", "resolve funnelId → list empty");
        }
        setResolvedId(true);
        setHydratedFromStorage(true);
        return latest;
      } catch {
        if (!isActive()) return null;
        setResolvedId(true);
        setHydratedFromStorage(true);
        return null;
      }
    },
    [],
  );

  useEffect(() => {
    if (funnelId) return;
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      void resolveFunnelId(() => active);
    });
    return () => {
      active = false;
    };
  }, [funnelId, resolveFunnelId]);

  const timedOut = pollStartedAt !== null && now - pollStartedAt > MAX_WALL_MS;

  const aggressiveProbe =
    pollStartedAt !== null && now - pollStartedAt >= AGGRESSIVE_PROBE_AFTER_MS;

  const statusQuery = useQuery({
    queryKey: funnelId
      ? queryKeys.funnels.generationStatus(funnelId)
      : ["funnels", "generation-status", "none"],
    queryFn: () => fetchGenerationStatus(funnelId!),
    enabled: Boolean(funnelId) && resolvedId && !timedOut,
    refetchInterval: (query) =>
      generationPollIntervalMs(pollStartedAt, query.state.data?.status),
  });

  const status = statusQuery.data?.status;

  const generationFailed =
    status === "failed"
      ? (statusQuery.data?.error?.message ??
        "Strategy generation failed. Please try again.")
      : null;

  const statusSettled = statusQuery.isFetched || statusQuery.isError;

  const shouldPollDisplay =
    Boolean(funnelId) &&
    resolvedId &&
    !generationFailed &&
    (aggressiveProbe ||
      status === "active" ||
      status === "generating" ||
      timedOut ||
      statusSettled);

  const displayQuery = useQuery({
    queryKey: funnelId
      ? queryKeys.funnels.display(funnelId)
      : ["funnels", "display", "none"],
    queryFn: () => fetchFunnelDisplay(funnelId!, true),
    enabled: shouldPollDisplay,
    retry: false,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data && funnelHasDisplayContent(data)) return false;
      if (timedOut) return false;
      if (!shouldPollDisplay) return false;
      return displayContentPollIntervalMs(pollStartedAt);
    },
  });

  const funnel = displayQuery.data ?? null;

  const funnelListItems = useMemo((): FunnelListItemDisplay[] => {
    const items = mapFunnelsToListItems(funnelListQuery.data ?? []);
    if (!funnelId) return items;
    if (items.some((item) => item.funnelId === funnelId)) return items;

    const active =
      funnel ?? funnelListQuery.data?.find((f) => f.funnelId === funnelId);
    if (!active) return items;

    return mapFunnelsToListItems([active, ...(funnelListQuery.data ?? [])]);
  }, [funnelListQuery.data, funnelId, funnel]);

  const hasRealContent = useMemo(
    () => (funnel ? funnelHasDisplayContent(funnel) : false),
    [funnel],
  );

  useEffect(() => {
    if (!pollStartedAt || hasRealContent) return;

    const id = window.setInterval(() => setNow(Date.now()), TICK_MS);
    return () => window.clearInterval(id);
  }, [pollStartedAt, hasRealContent]);

  const activeStage = useMemo(() => {
    return getFocusStage(funnel, completedStageIds);
  }, [funnel, completedStageIds]);

  const activeStageId = activeStage?.stageId ?? null;

  const isCurrentStageComplete = useMemo(() => {
    if (!funnelId || !activeStageId) return false;
    return completedStageIds.includes(activeStageId);
  }, [funnelId, activeStageId, completedStageIds]);

  const completeCurrentStage = useCallback(
    async (taskIds: string[] = []) => {
      if (!funnelId || !activeStageId) return;
      await completeStage(funnelId, activeStageId, taskIds);
      markStageComplete(funnelId, activeStageId);
      setStageProgressVersion((version) => version + 1);
      void queryClient.invalidateQueries({ queryKey: queryKeys.funnels.all() });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.funnels.display(funnelId),
      });
    },
    [funnelId, activeStageId, queryClient],
  );

  const strategyPhases = useMemo(
    () => mapStagesToStrategyPhases(funnel?.stages, completedStageIds),
    [funnel, completedStageIds],
  );
  const focus = useMemo(
    () => mapFunnelToFocus(funnel, completedStageIds),
    [funnel, completedStageIds],
  );
  const tasks = useMemo(
    () => mapStageTasksToDisplay(activeStage),
    [activeStage],
  );

  const loading = useMemo(() => {
    if (!resolvedId) return true;
    if (!funnelId) return false;
    if (hasRealContent) return false;
    if (generationFailed) return false;
    if (timedOut && displayQuery.isFetched && !hasRealContent) return false;
    if (funnel && !hasRealContent) {
      return (
        status === "generating" ||
        status === "active" ||
        !status ||
        displayQuery.isFetching ||
        statusQuery.isFetching ||
        !timedOut
      );
    }
    return (
      statusQuery.isPending ||
      statusQuery.isFetching ||
      displayQuery.isFetching ||
      (!timedOut && (status === "generating" || !status))
    );
  }, [
    resolvedId,
    funnelId,
    hasRealContent,
    funnel,
    generationFailed,
    timedOut,
    displayQuery.isFetched,
    displayQuery.isFetching,
    statusQuery.isPending,
    statusQuery.isFetching,
    status,
  ]);

  const displayReady = Boolean(
    hasRealContent && strategyPhases.length > 0 && focus,
  );

  const error = useMemo(() => {
    if (!resolvedId) return null;
    if (!funnelId) {
      if (generationAborted || shouldSkipStrategyAutoResolve()) {
        return null;
      }
      return NO_STRATEGY_ERROR;
    }
    if (generationFailed) {
      return STRATEGY_GENERATION_FAILED_MESSAGE;
    }
    if (
      statusQuery.error instanceof Error &&
      statusQuery.error.message.includes("Unauthenticated")
    ) {
      return "Your session expired. Please log in again.";
    }
    if (
      statusQuery.error &&
      !(
        statusQuery.error instanceof Error &&
        statusQuery.error.message.includes("Unauthenticated")
      )
    ) {
      return STRATEGY_GENERATION_FAILED_MESSAGE;
    }

    if (displayQuery.error) {
      const message =
        displayQuery.error instanceof Error ? displayQuery.error.message : "";

      /**
       * Ignore locked stage errors.
       * Backend uses 403 while stages are progressively unlocked.
       */
      const isLockedStageError =
        message.toLowerCase().includes("stage is locked") ||
        message.toLowerCase().includes("complete all tasks") ||
        message.toLowerCase().includes("unlock");

      if (!isLockedStageError) {
        return STRATEGY_GENERATION_FAILED_MESSAGE;
      }
    }
    if (timedOut && displayQuery.isFetched && !hasRealContent) {
      return STRATEGY_GENERATION_FAILED_MESSAGE;
    }
    if (!loading && displayQuery.isFetched && !displayReady) {
      return STRATEGY_GENERATION_FAILED_MESSAGE;
    }
    return null;
  }, [
    resolvedId,
    funnelId,
    generationAborted,
    generationFailed,
    statusQuery.error,
    displayQuery.error,
    timedOut,
    displayQuery.isFetched,
    hasRealContent,
    loading,
    displayReady,
  ]);

  useEffect(() => {
    flowLog("strategy", "poll state", {
      funnelId,
      resolvedId,
      hydratedFromStorage,
      loading,
      hasRealContent,
      displayReady,
      status: status ?? null,
      generationFailed: generationFailed ?? null,
      shouldPollDisplay,
      timedOut,
      error: error ?? null,
      stageCount: funnel?.stages?.length ?? 0,
    });
  }, [
    funnelId,
    resolvedId,
    hydratedFromStorage,
    loading,
    hasRealContent,
    displayReady,
    status,
    generationFailed,
    shouldPollDisplay,
    timedOut,
    error,
    funnel?.stages?.length,
  ]);

  const retry = useCallback(async () => {
    setGenerationAborted(false);
    clearStrategyAutoResolveSkipped();
    setPollStartedAt(Date.now());
    setNow(Date.now());

    void queryClient.invalidateQueries({ queryKey: queryKeys.funnels.all() });

    const id = funnelId;
    if (id) {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.funnels.generationStatus(id),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.funnels.display(id),
      });
      return;
    }

    setResolvedId(false);
    setHydratedFromStorage(false);
    await resolveFunnelId();
  }, [queryClient, funnelId, resolveFunnelId]);

  const abortActiveGeneration = useCallback(() => {
    const id = funnelId;
    clearActiveFunnelGeneration();
    markStrategyAutoResolveSkipped();
    setGenerationAborted(true);
    setFunnelId(null);
    setPollStartedAt(null);
    setResolvedId(true);
    if (!id) return;
    void queryClient.cancelQueries({
      queryKey: queryKeys.funnels.generationStatus(id),
    });
    void queryClient.cancelQueries({
      queryKey: queryKeys.funnels.display(id),
    });
    queryClient.removeQueries({
      queryKey: queryKeys.funnels.generationStatus(id),
    });
    queryClient.removeQueries({ queryKey: queryKeys.funnels.display(id) });
  }, [funnelId, queryClient]);

  const selectFunnel = useCallback(
    (nextFunnelId: string) => {
      if (!nextFunnelId || nextFunnelId === funnelId) return;

      const selected =
        funnelListQuery.data?.find((item) => item.funnelId === nextFunnelId) ??
        null;
      const startedAt = readFunnelStartedAt(selected?.createdAt) ?? Date.now();

      clearStrategyAutoResolveSkipped();
      setGenerationAborted(false);
      setFunnelId(nextFunnelId);
      setPollStartedAt(startedAt);
      setResolvedId(true);
      setStageProgressVersion((version) => version + 1);

      saveActiveFunnelGeneration({
        funnelId: nextFunnelId,
        idempotencyKey: crypto.randomUUID(),
        source:
          selected?.creationPath === "document_upload"
            ? "document_upload"
            : "wizard",
        startedAt,
      });

      void queryClient.invalidateQueries({
        queryKey: queryKeys.funnels.generationStatus(nextFunnelId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.funnels.display(nextFunnelId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.funnels.list(1),
      });
    },
    [funnelId, funnelListQuery.data, queryClient],
  );

  return {
    loading,
    loadingMessage: STRATEGY_LOADING_MESSAGE,
    error,
    displayReady,
    funnel,
    funnelId,
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
    funnels: funnelListItems,
    selectFunnel,
  };
}
