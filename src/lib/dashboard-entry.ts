import axios from "axios";
import { envConfig } from "@/config/env.config";
import { type AuthMeProfile } from "@/lib/auth-api";
import { parseFunnelList } from "@/lib/funnel-api-types";
import {
  STRATEGY_ROUTE,
  mapApiRedirectToAppPath,
  ONBOARDING_UPLOAD_ROUTE,
} from "@/routes";
import { flowLog } from "@/lib/flow-debug-log";
import { fetchUserState, type UserState } from "@/lib/user-state-api";

function funnelsListUrl(): string {
  const base = envConfig.BASEURL.replace(/\/$/, "");
  return `${base}/api/funnels`;
}

async function fetchFunnelsListRaw(
  accessToken: string,
): Promise<unknown | null> {
  try {
    const res = await axios.get(funnelsListUrl(), {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { page: 1, per_page: 5 },
      timeout: 30000,
    });
    return res.data;
  } catch {
    return null;
  }
}

/**
 * True when the user has a funnel record to open on the strategy page.
 * We do not trust `has_strategy` on /me alone — the backend can set it while
 * GET /api/funnels is still empty (or the funnel was removed).
 */
export function hasStrategyToView(input: {
  funnelsListData?: unknown;
}): boolean {
  if (!input.funnelsListData) {
    return false;
  }

  const funnels = parseFunnelList(input.funnelsListData);
  return funnels.length > 0;
}

/** True when the user should land on the strategy page after login. */
export function shouldUseStrategyHome(input: {
  me?: AuthMeProfile | null;
  funnelsListData?: unknown;
  apiRedirectUrl?: string;
}): boolean {
  const fromApi = mapApiRedirectToAppPath(input.apiRedirectUrl);
  if (fromApi === STRATEGY_ROUTE) {
    return true;
  }

  return hasStrategyToView(input);
}

export function resolveDashboardEntryPath(input: {
  me?: AuthMeProfile | null;
  funnelsListData?: unknown;
  apiRedirectUrl?: string;
}): string {
  if (shouldUseStrategyHome(input)) {
    return STRATEGY_ROUTE;
  }

  const fromApi = mapApiRedirectToAppPath(input.apiRedirectUrl);
  if (fromApi) {
    return fromApi;
  }

  return ONBOARDING_UPLOAD_ROUTE;
}

/**
 * Map a backend user-state response to an in-app route. Returns `null` if
 * the state couldn't be parsed so the caller can fall back to defaults.
 *
 * Scenario coverage (from /api/users/me/state spec):
 *   1, 2, 3 — onboarding complete + activeFunnel present (active / done /
 *             still generating) → strategy page handles all three internally.
 *   4 — onboarding complete + no funnel → upload step to create one.
 *   5, 6 — onboarding not yet complete → upload step (questions view picks
 *          the right step from the session API).
 */
export function mapUserStateToRoute(state: UserState | null): string | null {
  if (!state) return null;

  const onboardingStatus = state.onboarding?.status;
  const funnel = state.activeFunnel;

  if (onboardingStatus !== "complete") {
    return ONBOARDING_UPLOAD_ROUTE;
  }

  if (funnel) {
    return STRATEGY_ROUTE;
  }

  return ONBOARDING_UPLOAD_ROUTE;
}

/**
 * Resolve where to send the user after login. Uses the backend's single
 * GET /api/users/me/state endpoint, which is the source of truth for
 * "where this user belongs right now" and replaces the previous
 * fetchAuthMe + fetchFunnelsList combo.
 *
 * The `apiRedirectUrl` (passed from the login response when present) still
 * takes precedence when it explicitly says "strategy" — that hint is already
 * server-resolved so we don't need to re-derive it.
 *
 * Falls back to the funnels-list-based legacy path if the new endpoint fails
 * (network error, rolling deploy, etc.) — so we never trap the user in a
 * broken state.
 */
export async function resolveDashboardEntryPathWithToken(
  accessToken: string,
  apiRedirectUrl?: string,
): Promise<string> {
  const fromApi = mapApiRedirectToAppPath(apiRedirectUrl);
  if (fromApi === STRATEGY_ROUTE) {
    return STRATEGY_ROUTE;
  }

  // Primary path: ask the backend.
  const state = await fetchUserState(envConfig.BASEURL, accessToken);
  const fromState = mapUserStateToRoute(state);

  if (fromState) {
    flowLog("entry", "resolveDashboardEntryPathWithToken result", {
      path: fromState,
      source: "user-state",
      onboardingStatus: state?.onboarding?.status ?? null,
      hasActiveFunnel: !!state?.activeFunnel,
      apiRedirectUrl,
    });
    return fromState;
  }

  // Fallback: legacy two-call resolution. Only fires when /me/state returned
  // null (network/error) — keeps the old behavior as a safety net.
  const funnelsListData = await fetchFunnelsListRaw(accessToken);
  const fallback = resolveDashboardEntryPath({
    funnelsListData: funnelsListData ?? undefined,
    apiRedirectUrl,
  });

  const path =
    fallback && typeof fallback === "string" && fallback.startsWith("/")
      ? fallback
      : ONBOARDING_UPLOAD_ROUTE;

  const funnelCount = funnelsListData
    ? parseFunnelList(funnelsListData).length
    : 0;

  flowLog("entry", "resolveDashboardEntryPathWithToken result", {
    path,
    source: "fallback-funnels-list",
    funnelCount,
    apiRedirectUrl,
  });
  return path;
}
