import axios from "axios";
import { envConfig } from "@/config/env.config";
import { fetchAuthMe, type AuthMeProfile } from "@/lib/auth-api";
import { parseFunnelList } from "@/lib/funnel-api-types";
import {
  isOnboardingSessionComplete,
  parseOnboardingSession,
} from "@/lib/onboarding-api";
import { isOnboardingComplete } from "@/lib/new-strategy";
import {
  FUNNEL_ROUTE,
  mapApiRedirectToAppPath,
  ONBOARDING_UPLOAD_ROUTE,
} from "@/routes";

function onboardingSessionUrl(): string {
  const base = envConfig.BASEURL.replace(/\/$/, "");
  return `${base}/api/onboarding/session`;
}

function funnelsListUrl(): string {
  const base = envConfig.BASEURL.replace(/\/$/, "");
  return `${base}/api/funnels`;
}

async function fetchOnboardingSessionRaw(
  accessToken: string,
): Promise<unknown | null> {
  try {
    const res = await axios.get(onboardingSessionUrl(), {
      headers: { Authorization: `Bearer ${accessToken}` },
      timeout: 30000,
    });
    return res.data;
  } catch {
    return null;
  }
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

/** True when profile, onboarding session, or an existing funnel indicates the user is past onboarding. */
export function shouldUseStrategyHome(input: {
  me?: AuthMeProfile | null;
  onboardingSessionData?: unknown;
  funnelsListData?: unknown;
  apiRedirectUrl?: string;
}): boolean {
  const fromApi = mapApiRedirectToAppPath(input.apiRedirectUrl);
  if (fromApi === FUNNEL_ROUTE) {
    return true;
  }

  if (isOnboardingComplete(input.me ?? null)) {
    return true;
  }

  if (input.onboardingSessionData) {
    const session = parseOnboardingSession(input.onboardingSessionData);
    if (isOnboardingSessionComplete(session)) {
      return true;
    }
  }

  if (input.funnelsListData) {
    const funnels = parseFunnelList(input.funnelsListData);
    if (funnels.length > 0) {
      return true;
    }
  }

  return false;
}

export function resolveDashboardEntryPath(input: {
  me?: AuthMeProfile | null;
  onboardingSessionData?: unknown;
  funnelsListData?: unknown;
  apiRedirectUrl?: string;
}): string {
  if (shouldUseStrategyHome(input)) {
    return FUNNEL_ROUTE;
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

  if (isOnboardingComplete(me)) {
    return FUNNEL_ROUTE;
  }

  const fromApi = mapApiRedirectToAppPath(apiRedirectUrl);
  if (fromApi === FUNNEL_ROUTE) {
    return FUNNEL_ROUTE;
  }

  const [onboardingSessionData, funnelsListData] = await Promise.all([
    fetchOnboardingSessionRaw(accessToken),
    fetchFunnelsListRaw(accessToken),
  ]);

  return resolveDashboardEntryPath({
    me,
    onboardingSessionData: onboardingSessionData ?? undefined,
    funnelsListData: funnelsListData ?? undefined,
    apiRedirectUrl,
  });
}
