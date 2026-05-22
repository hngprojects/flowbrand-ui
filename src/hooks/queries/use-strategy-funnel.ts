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
  loadActiveFunnelGeneration,
  saveActiveFunnelGeneration,
} from "@/lib/funnel-generation-storage";

const POLL_MS = 2500;
const MAX_WALL_MS = 8 * 60 * 1000;
const AGGRESSIVE_PROBE_AFTER_MS = 15 * 1000;
const TICK_MS = 1000;

function formatElapsed(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function readInitialFunnelId(): string | null {
  return loadActiveFunnelGeneration()?.funnelId ?? null;
}

export function useStrategyFunnel() {
  const queryClient = useQueryClient();
  const [funnelId, setFunnelId] = useState<string | null>(readInitialFunnelId);
  const [resolvedId, setResolvedId] = useState(
    () => readInitialFunnelId() !== null,
  );
  const [pollStartedAt, setPollStartedAt] = useState<number | null>(() =>
    readInitialFunnelId() ? Date.now() : null,
  );
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (funnelId) return;

    let cancelled = false;

    void fetchFunnelList(1)
      .then((funnels) => {
        if (cancelled) return;
        const latest = funnels[0]?.funnelId ?? null;
        if (latest) {
          saveActiveFunnelGeneration({
            funnelId: latest,
            idempotencyKey: crypto.randomUUID(),
            source: "wizard",
          });
          setFunnelId(latest);
          setPollStartedAt(Date.now());
        }
        setResolvedId(true);
      })
      .catch(() => {
        if (!cancelled) setResolvedId(true);
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
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "active" || status === "failed") return false;
      if (pollStartedAt !== null && Date.now() - pollStartedAt > MAX_WALL_MS) {
        return false;
      }
      return POLL_MS;
    },
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
    (aggressiveProbe || status === "active" || timedOut);

  const displayQuery = useQuery({
    queryKey: funnelId
      ? queryKeys.funnels.display(funnelId)
      : ["funnels", "display", "none"],
    queryFn: () => fetchFunnelDisplay(funnelId!, timedOut),
    enabled: shouldPollDisplay,
    retry: false,
    refetchInterval: (query) => {
      if (query.state.data) return false;
      if (status === "active") return POLL_MS;
      if (aggressiveProbe && !timedOut) return POLL_MS;
      return false;
    },
  });

  const funnel = displayQuery.data ?? null;

  useEffect(() => {
    if (!pollStartedAt || funnel) return;

    const id = window.setInterval(() => setNow(Date.now()), TICK_MS);
    return () => window.clearInterval(id);
  }, [pollStartedAt, funnel]);

  const strategyPhases = useMemo(
    () => mapStagesToStrategyPhases(funnel?.stages),
    [funnel],
  );
  const focus = useMemo(() => mapFunnelToFocus(funnel), [funnel]);
  const tasks = useMemo(
    () => mapStageTasksToDisplay(getFocusStage(funnel)),
    [funnel],
  );

  const loading = useMemo(() => {
    if (!resolvedId) return true;
    if (!funnelId) return false;
    if (funnel) return false;
    if (generationFailed) return false;
    if (timedOut && displayQuery.isFetched && !displayQuery.data) return false;
    return (
      statusQuery.isPending ||
      statusQuery.isFetching ||
      displayQuery.isFetching ||
      (!timedOut && (status === "generating" || !status))
    );
  }, [
    resolvedId,
    funnelId,
    funnel,
    generationFailed,
    timedOut,
    displayQuery.isFetched,
    displayQuery.data,
    displayQuery.isFetching,
    statusQuery.isPending,
    statusQuery.isFetching,
    status,
  ]);

  const loadingMessage = useMemo(() => {
    if (!funnelId) return "Building your marketing strategy...";
    if (elapsedSec >= 120) {
      return `Still building your strategy… (${formatElapsed(elapsedSec)}). Checking for ready content…`;
    }
    return `Building your marketing strategy… (${formatElapsed(elapsedSec)})`;
  }, [funnelId, elapsedSec]);

  const error = useMemo(() => {
    if (generationFailed) return generationFailed;
    if (!resolvedId) return null;
    if (!funnelId) {
      return "No strategy found. Complete onboarding to create one.";
    }
    if (statusQuery.error instanceof Error) return statusQuery.error.message;
    if (displayQuery.error instanceof Error) return displayQuery.error.message;
    if (timedOut && displayQuery.isFetched && !funnel) {
      return "Strategy generation is taking longer than expected on the server. Click Try again in a minute, or refresh this page.";
    }
    return null;
  }, [
    generationFailed,
    resolvedId,
    funnelId,
    statusQuery.error,
    displayQuery.error,
    timedOut,
    displayQuery.isFetched,
    funnel,
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

  return {
    loading,
    loadingMessage,
    error,
    funnel,
    strategyPhases,
    focus,
    tasks,
    retry,
  };
}
