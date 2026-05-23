import axios from "axios";
import { envConfig } from "@/config/env.config";
import { fetchAuthMe, type AuthMeProfile } from "@/lib/auth-api";
import { parseFunnelList } from "@/lib/funnel-api-types";
import {
  STRATEGY_ROUTE,
  mapApiRedirectToAppPath,
  ONBOARDING_UPLOAD_ROUTE,
} from "@/routes";
import { flowLog } from "@/lib/flow-debug-log";

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

/** Resolve strategy vs onboarding using /me, onboarding session, and existing funnels. */
export async function resolveDashboardEntryPathWithToken(
  accessToken: string,
  apiRedirectUrl?: string,
): Promise<string> {
  const me = await fetchAuthMe(envConfig.BASEURL, accessToken);

  const fromApi = mapApiRedirectToAppPath(apiRedirectUrl);
  if (fromApi === STRATEGY_ROUTE) {
    return STRATEGY_ROUTE;
  }

  const funnelsListData = await fetchFunnelsListRaw(accessToken);

  const path = resolveDashboardEntryPath({
    me,
    funnelsListData: funnelsListData ?? undefined,
    apiRedirectUrl,
  });
  const funnelCount = funnelsListData
    ? parseFunnelList(funnelsListData).length
    : 0;
  flowLog("entry", "resolveDashboardEntryPathWithToken → result", {
    path,
    has_strategy: me?.has_strategy,
    funnelCount,
    usedHasStrategyFlag: false,
    reason:
      path === STRATEGY_ROUTE
        ? "funnels_list_non_empty"
        : funnelCount === 0 && me?.has_strategy
          ? "has_strategy_but_no_funnels → upload"
          : "no_funnels",
    apiRedirectUrl,
  });
  return path;
}
