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
import { flowLog, flowLogError } from "@/lib/flow-debug-log";

export type OnboardingSessionPayload = {
  session: ParsedOnboardingSession;
  raw: unknown;
};

export class OnboardingAlreadyCompleteError extends Error {
  constructor() {
    super("Onboarding already complete.");
    this.name = "OnboardingAlreadyCompleteError";
  }
}

function payloadFromApiData(data: unknown): OnboardingSessionPayload {
  return {
    session: parseOnboardingSession(data),
    raw: data,
  };
}

/**
 * GET /api/onboarding/session when one exists; otherwise POST /api/onboarding/start.
 * Throws {@link OnboardingAlreadyCompleteError} when start returns 409.
 */
export async function getOrCreateOnboardingSession(): Promise<OnboardingSessionPayload> {
  flowLog("onboarding", "getOrCreateOnboardingSession → start");
  const existing = await getOnboardingSession();

  if (existing.ok) {
    const payload = payloadFromApiData(existing.data);
    flowLog(
      "onboarding",
      "getOrCreateOnboardingSession → use existing session",
      {
        sessionId: payload.session.sessionId,
        stepsCompleted: payload.session.stepsCompleted,
        status: payload.session.status,
      },
    );
    return payload;
  }

  flowLog("onboarding", "getOrCreateOnboardingSession → no session, starting");
  const started = await startOnboarding();

  if (started.status === 409) {
    flowLog("onboarding", "getOrCreateOnboardingSession → start returned 409");
    throw new OnboardingAlreadyCompleteError();
  }

  if (started.ok) {
    const payload = payloadFromApiData(started.data);
    flowLog(
      "onboarding",
      "getOrCreateOnboardingSession → started new session",
      {
        sessionId: payload.session.sessionId,
        stepsCompleted: payload.session.stepsCompleted,
      },
    );
    return payload;
  }

  flowLogError("onboarding", "getOrCreateOnboardingSession", started.error);
  throw new Error(started.error || "Failed to start onboarding session.");
}

/** @deprecated Use {@link getOrCreateOnboardingSession}. */
export async function fetchOnboardingSessionResolved(): Promise<OnboardingSessionPayload> {
  return getOrCreateOnboardingSession();
}

export async function saveOnboardingStepMutation(input: {
  session_id: string;
  step: number;
  answer: Record<string, unknown>;
}): Promise<OnboardingSessionPayload> {
  flowLog("onboarding", "saveOnboardingStepMutation → request", {
    step: input.step,
    session_id: input.session_id,
  });
  const res = await saveOnboardingStep(input);
  if (!res.ok) {
    if (res.status === 409) {
      const existing = await getOnboardingSession();
      if (existing.ok) {
        return payloadFromApiData(existing.data);
      }
      throw new OnboardingAlreadyCompleteError();
    }
    flowLogError("onboarding", "saveOnboardingStepMutation", res.error, {
      step: input.step,
      status: res.status,
    });
    throw new Error(res.error || "Could not save your onboarding answer.");
  }
  const payload = payloadFromApiData(res.data);
  flowLog("onboarding", "saveOnboardingStepMutation → ok", {
    step: input.step,
    stepsCompleted: payload.session.stepsCompleted,
  });
  return payload;
}

export async function completeOnboardingMutation(
  session_id: string,
): Promise<void> {
  flowLog("onboarding", "completeOnboardingMutation → request", { session_id });
  const res = await completeOnboarding(session_id);
  if (!res.ok && res.status !== 409) {
    flowLogError("onboarding", "completeOnboardingMutation", res.error, {
      status: res.status,
    });
    throw new Error(res.error || "Could not complete onboarding.");
  }
  flowLog("onboarding", "completeOnboardingMutation → ok", {
    status: res.status,
  });
}

export function canStartFunnelGeneration(
  session: ParsedOnboardingSession,
): boolean {
  return isOnboardingSessionComplete(session);
}

export { isOnboardingSessionComplete, parseOnboardingSessionId };
