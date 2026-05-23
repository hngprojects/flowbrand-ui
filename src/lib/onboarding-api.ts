/** Helpers for /api/onboarding per staging OpenAPI. */

import { collectApiRecords } from "@/lib/api-envelope";

export type OnboardingSessionAnswers = {
  step_1?: { business_description?: string };
  step_2?: { customer_tags?: { type?: string[] } };
  step_3?: { discovery_channel?: string };
};

export type ParsedOnboardingSession = {
  sessionId: string | null;
  status?: string;
  stepsCompleted: number;
  answers: OnboardingSessionAnswers;
};

export function parseOnboardingSessionId(data: unknown): string | null {
  for (const record of collectApiRecords(data)) {
    const id = record.session_id ?? record.sessionId;
    if (typeof id === "string" && id.trim()) return id.trim();
  }
  return null;
}

function parseAnswers(raw: unknown): OnboardingSessionAnswers {
  if (!raw || typeof raw !== "object") return {};
  return raw as OnboardingSessionAnswers;
}

export function parseOnboardingSession(data: unknown): ParsedOnboardingSession {
  for (const record of collectApiRecords(data)) {
    const sessionId =
      (typeof record.session_id === "string" && record.session_id) ||
      (typeof record.sessionId === "string" && record.sessionId) ||
      null;

    const stepsCompleted =
      typeof record.steps_completed === "number"
        ? record.steps_completed
        : typeof record.stepsCompleted === "number"
          ? record.stepsCompleted
          : 0;

    const answers = parseAnswers(record.answers);

    if (sessionId || Object.keys(answers).length > 0) {
      return {
        sessionId,
        status: typeof record.status === "string" ? record.status : undefined,
        stepsCompleted,
        answers,
      };
    }
  }

  return { sessionId: null, stepsCompleted: 0, answers: {} };
}

export function stepNumberFromSession(
  session: ParsedOnboardingSession,
): number {
  const completed = session.stepsCompleted;
  if (completed >= 3) return 3;
  if (completed >= 1) return Math.min(completed + 1, 3);
  return 1;
}

const COMPLETED_SESSION_STATUSES = new Set([
  "completed",
  "complete",
  "done",
  "finished",
]);

/** Backend may leave /me flags false while the onboarding session is already done. */
export function isOnboardingSessionComplete(
  session: ParsedOnboardingSession,
): boolean {
  const status = session.status?.toLowerCase().trim();
  if (status && COMPLETED_SESSION_STATUSES.has(status)) {
    return true;
  }

  if (session.stepsCompleted >= 3) {
    return true;
  }

  return Boolean(session.answers.step_3?.discovery_channel);
}

export function isOnboardingConflictStatus(status?: number): boolean {
  return status === 409;
}

export function buildStep1Answer(businessDescription: string) {
  return { business_description: businessDescription.trim() };
}

export function buildStep2Answer(input: {
  theyAre: string[];
  whoWantTo: string[];
  locatedIn: string[];
  customCustomerInput: string;
}) {
  const type = [
    ...input.theyAre,
    ...input.whoWantTo,
    ...input.locatedIn,
    ...(input.customCustomerInput.trim()
      ? [input.customCustomerInput.trim()]
      : []),
  ];
  return { customer_tags: { type } };
}

export function buildStep3Answer(trafficChannel: string) {
  return { discovery_channel: trafficChannel.trim() };
}

export function customerTagsFromAnswers(
  answers: OnboardingSessionAnswers,
): string[] {
  return answers.step_2?.customer_tags?.type ?? [];
}
