"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import {
  isNewStrategyFlow,
  isNewStrategySearchParam,
  markNewStrategyFlow,
} from "@/lib/new-strategy";

/**
 * SSR-safe new-strategy detection: URL param on first paint, then session flag via snapshot.
 */
export function useNewStrategyFlow(): boolean {
  const searchParams = useSearchParams();
  const fromUrl = isNewStrategySearchParam(searchParams.get("newStrategy"));
  const fromSession = useSyncExternalStore(
    () => () => {},
    isNewStrategyFlow,
    () => false,
  );

  useEffect(() => {
    if (fromUrl || fromSession) {
      markNewStrategyFlow();
    }
  }, [fromUrl, fromSession]);

  return fromUrl || fromSession;
}
