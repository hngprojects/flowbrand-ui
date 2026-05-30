import {
  completeOnboarding,
  saveOnboardingStep,
  startOnboarding,
} from "@/actions/onboarding";
import {
  isOnboardingAlreadyCompleteResponse,
  isOnboardingSessionComplete,
  parseOnboardingSession,
  parseOnboardingSessionId,
  type ParsedOnboardingSession,
} from "@/lib/onboarding-api";
import { flowLog, flowLogError } from "@/lib/flow-debug-log";

export type OnboardingSessionPayload = {
  session: ParsedOnboardingSession;
  raw: unknown;
  /** Set when POST /start reports onboarding is already finished (no active wizard). */
  alreadyComplete?: boolean;
};

export type GetOnboardingSessionOptions = {
  /** When true, already-complete users get a payload instead of an error (new-strategy flow). */
  allowAlreadyComplete?: boolean;
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
 * POST /api/onboarding/start — resume an active session, create a new one, or
 * detect that onboarding is already complete.
 * Throws {@link OnboardingAlreadyCompleteError} when the user has finished onboarding.
 */
function alreadyCompletePayload(data: unknown): OnboardingSessionPayload {
  return {
    session: parseOnboardingSession(data),
    raw: data,
    alreadyComplete: true,
  };
}

export async function getOrCreateOnboardingSession(
  options: GetOnboardingSessionOptions = {},
): Promise<OnboardingSessionPayload> {
  flowLog("onboarding", "getOrCreateOnboardingSession → POST /start");
  const started = await startOnboarding();

  if (started.ok) {
    if (isOnboardingAlreadyCompleteResponse(started.data)) {
      flowLog(
        "onboarding",
        "getOrCreateOnboardingSession → start returned already complete",
      );
      if (options.allowAlreadyComplete) {
        return alreadyCompletePayload(started.data);
      }
      throw new OnboardingAlreadyCompleteError();
    }

    const payload = payloadFromApiData(started.data);
    if (!payload.session.sessionId) {
      flowLogError(
        "onboarding",
        "getOrCreateOnboardingSession",
        "Missing sessionId in start response",
        { httpStatus: started.status, data: started.data },
      );
      throw new Error("Failed to start onboarding session.");
    }

    flowLog("onboarding", "getOrCreateOnboardingSession → session ready", {
      sessionId: payload.session.sessionId,
      stepsCompleted: payload.session.stepsCompleted,
      status: payload.session.status,
      httpStatus: started.status,
    });
    return payload;
  }

  if (started.status === 409) {
    flowLog("onboarding", "getOrCreateOnboardingSession → start returned 409");
    if (options.allowAlreadyComplete) {
      return alreadyCompletePayload(null);
    }
    throw new OnboardingAlreadyCompleteError();
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
      throw new OnboardingAlreadyCompleteError();
    }
    flowLogError("onboarding", "saveOnboardingStepMutation", res.error, {
      step: input.step,
      status: res.status,
    });
    throw new Error(res.error);
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
    throw new Error(res.error);
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
