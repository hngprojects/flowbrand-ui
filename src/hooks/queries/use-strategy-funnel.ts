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
import { STRATEGY_GENERATION_FAILED_MESSAGE } from "@/lib/funnel-generation-errors";
import { flowLog } from "@/lib/flow-debug-log";

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

/** Shown as a tooltip on the forward arrow when the current stage isn't done. */
export const STAGE_LOCKED_MESSAGE =
  "Complete the tasks in this stage to unlock the next one.";

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

/**
 * Records that the user has explicitly chosen to view a particular stage via
 * the back/forward arrows. Tagged with the funnelId so it auto-invalidates
 * if the user generates a new strategy.
 */
type ViewingOverride = { funnelId: string; stageId: string } | null;

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

  /**
   * User-explicit selection from the back/forward arrows. We derive the
   * actual viewing stage from this + activeStageId (see useMemo below) so we
   * don't need useEffects to sync state, which would trip
   * react-hooks/set-state-in-effect.
   */
  const [viewingOverride, setViewingOverride] = useState<ViewingOverride>(null);

  const completedStageIds = useMemo(() => {
    void stageProgressVersion;
    if (!funnelId) return [];
    return getCompletedStages(funnelId);
  }, [funnelId, stageProgressVersion]);

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
        setPollStartedAt(Date.now());
        setGenerationAborted(false);
        setResolvedId(true);
        setHydratedFromStorage(true);
        return stored.funnelId;
      }

      try {
        const funnels = await fetchFunnelList(1);
        if (!isActive()) return null;
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

  const hasRealContent = useMemo(
    () => (funnel ? funnelHasDisplayContent(funnel) : false),
    [funnel],
  );

  useEffect(() => {
    if (!pollStartedAt || hasRealContent) return;

    const id = window.setInterval(() => setNow(Date.now()), TICK_MS);
    return () => window.clearInterval(id);
  }, [pollStartedAt, hasRealContent]);

  /** All stages in their canonical order, for navigation. */
  const sortedStages = useMemo(() => {
    const stages = funnel?.stages ?? [];
    return [...stages].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  }, [funnel?.stages]);

  /** The frontier: first stage that isn't completed yet. */
  const activeStageId = useMemo(() => {
    return getFocusStage(funnel, completedStageIds)?.stageId ?? null;
  }, [funnel, completedStageIds]);

  /**
   * The stage currently in view. Derived (not stored) so we don't need an
   * effect to sync. Falls back to activeStageId when the user hasn't
   * navigated yet, when the funnel has changed under us, or when the
   * previously-viewed stage no longer exists.
   */
  const viewingStageId = useMemo(() => {
    if (
      viewingOverride &&
      viewingOverride.funnelId === funnelId &&
      sortedStages.some((s) => s.stageId === viewingOverride.stageId)
    ) {
      return viewingOverride.stageId;
    }
    return activeStageId;
  }, [viewingOverride, funnelId, sortedStages, activeStageId]);

  const viewingIndex = useMemo(() => {
    if (!viewingStageId) return -1;
    return sortedStages.findIndex((s) => s.stageId === viewingStageId);
  }, [sortedStages, viewingStageId]);

  const frontierIndex = useMemo(() => {
    if (!activeStageId) return -1;
    return sortedStages.findIndex((s) => s.stageId === activeStageId);
  }, [sortedStages, activeStageId]);

  const viewingStage = useMemo(() => {
    if (viewingIndex < 0) return undefined;
    return sortedStages[viewingIndex];
  }, [sortedStages, viewingIndex]);

  /** True if the stage currently in view has already been submitted. */
  const isViewingStageComplete = useMemo(() => {
    if (!viewingStageId) return false;
    return completedStageIds.includes(viewingStageId);
  }, [completedStageIds, viewingStageId]);

  /** True if the user is currently looking at the frontier stage. */
  const isViewingActiveStage = useMemo(() => {
    return (
      !!viewingStageId && !!activeStageId && viewingStageId === activeStageId
    );
  }, [viewingStageId, activeStageId]);

  const canGoPrevious = viewingIndex > 0;

  /**
   * Forward is enabled when:
   *  - there IS a next stage, AND
   *  - the user has finished the one they're looking at.
   * Stages beyond the frontier stay locked.
   */
  const canGoNext =
    viewingIndex >= 0 &&
    viewingIndex < sortedStages.length - 1 &&
    isViewingStageComplete;

  const goToPreviousStage = useCallback(() => {
    if (!canGoPrevious || !funnelId) return;
    const prev = sortedStages[viewingIndex - 1];
    if (prev?.stageId) {
      setViewingOverride({ funnelId, stageId: prev.stageId });
    }
  }, [canGoPrevious, funnelId, sortedStages, viewingIndex]);

  const goToNextStage = useCallback(() => {
    if (!canGoNext || !funnelId) return;
    const next = sortedStages[viewingIndex + 1];
    if (next?.stageId) {
      setViewingOverride({ funnelId, stageId: next.stageId });
    }
  }, [canGoNext, funnelId, sortedStages, viewingIndex]);

  const isCurrentStageComplete = isViewingStageComplete;

  const completeCurrentStage = useCallback(() => {
    if (!funnelId || !viewingStageId) return;
    // Only the frontier can be completed. The arrow / submit flow shouldn't
    // ever call this for a non-frontier stage, but guard so re-entering an
    // older stage and clicking submit (if it ever surfaced) is a no-op.
    if (viewingStageId !== activeStageId) return;
    markStageComplete(funnelId, viewingStageId);
    setStageProgressVersion((v) => v + 1);

    // Auto-advance the user to the new frontier (the stage they just
    // unlocked). Mirrors the previous behavior where the focus moved on
    // completion.
    const nextIdx = viewingIndex + 1;
    if (nextIdx >= 0 && nextIdx < sortedStages.length) {
      const next = sortedStages[nextIdx];
      if (next?.stageId) {
        setViewingOverride({ funnelId, stageId: next.stageId });
      }
    }
  }, [funnelId, viewingStageId, activeStageId, viewingIndex, sortedStages]);

  const strategyPhases = useMemo(
    () => mapStagesToStrategyPhases(funnel?.stages, completedStageIds),
    [funnel, completedStageIds],
  );

  /**
   * The focus header shows whichever stage the user is viewing — not the
   * unchanged "earliest incomplete" stage. Without this, the header text
   * wouldn't update as the user clicked through the arrows.
   */
  const focus = useMemo(() => {
    if (!viewingStage) {
      // Fallback while loading: show the frontier the way the old code did.
      return mapFunnelToFocus(funnel, completedStageIds);
    }
    const position =
      viewingStage.position ?? (viewingIndex >= 0 ? viewingIndex + 1 : 1);
    return {
      phase: viewingStage.name,
      progress: `${position} of ${sortedStages.length}`,
      subtitle:
        viewingStage.explanation ??
        viewingStage.actionPrompt ??
        "Complete the tasks below for this stage.",
    };
  }, [
    viewingStage,
    viewingIndex,
    sortedStages.length,
    funnel,
    completedStageIds,
  ]);

  const tasks = useMemo(
    () => mapStageTasksToDisplay(viewingStage),
    [viewingStage],
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
    hasRealContent && sortedStages.length > 0 && focus,
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
      viewingStageId,
      activeStageId,
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
    viewingStageId,
    activeStageId,
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
    setViewingOverride(null);
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
    // --- stage navigation surface ---
    viewingStageId,
    isViewingActiveStage,
    canGoPrevious,
    canGoNext,
    goToPreviousStage,
    goToNextStage,
    stagePosition: viewingIndex >= 0 ? viewingIndex + 1 : 0,
    totalStages: sortedStages.length,
    /** Re-exported so the frontier index is available for tooling/logging. */
    frontierIndex,
  };
}
