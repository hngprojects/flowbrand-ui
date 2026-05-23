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
  mapStageTasksToDisplay,
  mapStagesToStrategyPhases,
} from "@/lib/funnel-display";
import { queryKeys } from "@/lib/query-keys";
import {
  clearActiveFunnelGeneration,
  clearPendingGeneration,
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
import { STRATEGY_GENERATION_FAILED_MESSAGE } from "@/lib/funnel-generation-errors";
import { flowLog } from "@/lib/flow-debug-log";

/** Poll every ~3s after the first 30s; faster early when jobs often finish. */
const POLL_MS = 3000;
const FAST_POLL_MS = 1500;
const FAST_POLL_WINDOW_MS = 30_000;
const MAX_WALL_MS = 8 * 60 * 1000;
const AGGRESSIVE_PROBE_AFTER_MS = 15 * 1000;
const TICK_MS = 1000;

export const STRATEGY_GENERATION_HINT = "Usually takes 1–2 minutes.";

export const NO_STRATEGY_ERROR =
  "No strategy found. Complete onboarding to create one.";

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

function formatElapsed(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function readInitialStrategyState() {
  if (typeof window === "undefined") {
    return {
      funnelId: null as string | null,
      resolvedId: false,
      pollStartedAt: null as number | null,
      hydratedFromStorage: false,
    };
  }

  const skipResolve = shouldSkipStrategyAutoResolve();
  const stored = loadActiveFunnelGeneration();
  const funnelId = stored?.funnelId ?? null;

  return {
    funnelId,
    resolvedId: funnelId !== null || skipResolve,
    pollStartedAt: funnelId ? Date.now() : null,
    hydratedFromStorage: funnelId !== null || skipResolve,
  };
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

  const completedStageIds = useMemo(() => {
    void stageProgressVersion;
    if (!funnelId) return [];
    return getCompletedStages(funnelId);
  }, [funnelId, stageProgressVersion]);

  useEffect(() => {
    if (funnelId) return;
    if (shouldSkipStrategyAutoResolve()) return;

    let cancelled = false;

    void fetchFunnelList(1)
      .then((funnels) => {
        if (cancelled) return;
        const latest = funnels[0]?.funnelId ?? null;
        if (latest) {
          flowLog("strategy", "resolve funnelId → latest from list", {
            funnelId: latest,
          });
          saveActiveFunnelGeneration({
            funnelId: latest,
            idempotencyKey: crypto.randomUUID(),
            source: "wizard",
          });
          setFunnelId(latest);
          setPollStartedAt(Date.now());
        } else {
          flowLog("strategy", "resolve funnelId → list empty");
        }
        setResolvedId(true);
        setHydratedFromStorage(true);
      })
      .catch(() => {
        if (!cancelled) {
          setResolvedId(true);
          setHydratedFromStorage(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [funnelId]);

  const timedOut = pollStartedAt !== null && now - pollStartedAt > MAX_WALL_MS;

  const elapsedSec =
    pollStartedAt !== null
      ? Math.max(0, Math.round((now - pollStartedAt) / 1000))
      : 0;

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

  const shouldPollDisplay =
    Boolean(funnelId) &&
    resolvedId &&
    !generationFailed &&
    (aggressiveProbe ||
      status === "active" ||
      status === "generating" ||
      timedOut);

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

  const hasRealContent = useMemo(
    () => (funnel ? funnelHasDisplayContent(funnel) : false),
    [funnel],
  );

  useEffect(() => {
    if (!pollStartedAt || hasRealContent) return;

    const id = window.setInterval(() => setNow(Date.now()), TICK_MS);
    return () => window.clearInterval(id);
  }, [pollStartedAt, hasRealContent]);

  const activeStageId = useMemo(() => {
    return getFocusStage(funnel, completedStageIds)?.stageId ?? null;
  }, [funnel, completedStageIds]);

  const isCurrentStageComplete = useMemo(() => {
    if (!funnelId || !activeStageId) return false;
    return completedStageIds.includes(activeStageId);
  }, [funnelId, activeStageId, completedStageIds]);

  const completeCurrentStage = useCallback(() => {
    if (!funnelId || !activeStageId) return;
    markStageComplete(funnelId, activeStageId);
    setStageProgressVersion((version) => version + 1);
  }, [funnelId, activeStageId]);

  const strategyPhases = useMemo(
    () => mapStagesToStrategyPhases(funnel?.stages, completedStageIds),
    [funnel, completedStageIds],
  );
  const focus = useMemo(
    () => mapFunnelToFocus(funnel, completedStageIds),
    [funnel, completedStageIds],
  );
  const tasks = useMemo(
    () => mapStageTasksToDisplay(getFocusStage(funnel, completedStageIds)),
    [funnel, completedStageIds],
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

  const loadingMessage = useMemo(() => {
    const elapsed = formatElapsed(elapsedSec);
    if (!funnelId) return "Starting…";
    return `Building strategy… (${elapsed})`;
  }, [funnelId, elapsedSec]);

  const displayReady = Boolean(
    hasRealContent && strategyPhases.length > 0 && focus,
  );

  const error = useMemo(() => {
    if (!resolvedId) return null;
    if (!funnelId) {
      return NO_STRATEGY_ERROR;
    }
    if (generationFailed) {
      return STRATEGY_GENERATION_FAILED_MESSAGE;
    }
    if (statusQuery.error) {
      return STRATEGY_GENERATION_FAILED_MESSAGE;
    }
    if (displayQuery.error) {
      return STRATEGY_GENERATION_FAILED_MESSAGE;
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

  const retry = useCallback(() => {
    setPollStartedAt(Date.now());
    setNow(Date.now());
    setResolvedId(true);
    void queryClient.invalidateQueries({ queryKey: queryKeys.funnels.all() });
    if (funnelId) {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.funnels.generationStatus(funnelId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.funnels.display(funnelId),
      });
    }
  }, [queryClient, funnelId]);

  const abortActiveGeneration = useCallback(() => {
    const id = funnelId;
    clearActiveFunnelGeneration();
    clearPendingGeneration();
    markStrategyAutoResolveSkipped();
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

  return {
    loading,
    loadingMessage,
    loadingHint: STRATEGY_GENERATION_HINT,
    error,
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
    hydratedFromStorage,
  };
}
