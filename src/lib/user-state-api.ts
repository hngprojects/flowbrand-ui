import axios from "axios";

export type UserStateOnboardingStatus =
  | "not_started"
  | "in_progress"
  | "complete"
  | (string & {});

export type UserStateFunnel = {
  funnelId?: string;
  id?: string;
  status?: string;
  [key: string]: unknown;
};

export type UserState = {
  onboarding: { status: UserStateOnboardingStatus };
  activeFunnel: UserStateFunnel | null;
};

function unwrapEnvelope(body: unknown): Record<string, unknown> | null {
  if (!body || typeof body !== "object") return null;
  const root = body as Record<string, unknown>;
  if (root.data && typeof root.data === "object") {
    return root.data as Record<string, unknown>;
  }
  return root;
}

function parseUserState(body: unknown): UserState | null {
  const data = unwrapEnvelope(body);
  if (!data) return null;

  const onboardingRaw = data.onboarding;
  const onboardingStatus =
    onboardingRaw &&
    typeof onboardingRaw === "object" &&
    typeof (onboardingRaw as Record<string, unknown>).status === "string"
      ? ((onboardingRaw as Record<string, unknown>)
          .status as UserStateOnboardingStatus)
      : "not_started";

  const funnelRaw = data.activeFunnel;
  const activeFunnel =
    funnelRaw && typeof funnelRaw === "object"
      ? (funnelRaw as UserStateFunnel)
      : null;

  return {
    onboarding: { status: onboardingStatus },
    activeFunnel,
  };
}

function userStateUrl(baseUrl: string): string {
  const base = baseUrl.replace(/\/$/, "");
  return `${base}/api/users/me/state`;
}

export async function fetchUserState(
  baseUrl: string,
  accessToken: string,
): Promise<UserState | null> {
  try {
    const response = await axios.get(userStateUrl(baseUrl), {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true,
      timeout: 30000,
    });
    return parseUserState(response.data);
  } catch {
    return null;
  }
}
