import {
  completeOnboarding,
  getOnboardingSession,
  saveOnboardingStep,
  startOnboarding,
} from "@/actions/onboarding";
import {
  isOnboardingSessionComplete,
  parseOnboardingSession,
  parseOnboardingSessionId,
  type ParsedOnboardingSession,
} from "@/lib/onboarding-api";

export type OnboardingSessionPayload = {
  session: ParsedOnboardingSession;
  raw: unknown;
};

export async function fetchOnboardingSessionResolved(): Promise<OnboardingSessionPayload> {
  const existing = await getOnboardingSession();
  if (existing.ok) {
    return {
      session: parseOnboardingSession(existing.data),
      raw: existing.data,
    };
  }

  const started = await startOnboarding();
  if (started.ok) {
    return {
      session: parseOnboardingSession(started.data),
      raw: started.data,
    };
  }

  if (started.status === 409) {
    const retry = await getOnboardingSession();
    if (retry.ok) {
      return {
        session: parseOnboardingSession(retry.data),
        raw: retry.data,
      };
    }
  }

  throw new Error(started.error || "Could not start onboarding.");
}

export async function saveOnboardingStepMutation(input: {
  session_id: string;
  step: number;
  answer: Record<string, unknown>;
}): Promise<OnboardingSessionPayload> {
  const res = await saveOnboardingStep(input);
  if (!res.ok) {
    if (res.status === 409) {
      const existing = await getOnboardingSession();
      if (existing.ok) {
        return {
          session: parseOnboardingSession(existing.data),
          raw: existing.data,
        };
      }
    }
    throw new Error(res.error);
  }
  return {
    session: parseOnboardingSession(res.data),
    raw: res.data,
  };
}

export async function completeOnboardingMutation(
  session_id: string,
): Promise<void> {
  const res = await completeOnboarding(session_id);
  if (!res.ok && res.status !== 409) {
    throw new Error(res.error);
  }
}

export { isOnboardingSessionComplete, parseOnboardingSessionId };
