/** Helpers for /api/onboarding per staging OpenAPI. */

import {
  collectApiRecords,
  readApiMessage,
  readRecord,
} from "@/lib/api-envelope";

export type OnboardingSessionAnswers = {
  step_1?: { business_description?: string };
  step_2?: {
    customer_tags?: {
      type?: string[];
      wants?: string[];
      location?: string[];
    };
    additional_notes?: string;
  };
  step_3?: { discovery_channel?: string | string[] };
};

export type ParsedOnboardingSession = {
  sessionId: string | null;
  status?: string;
  stepsCompleted: number;
  answers: OnboardingSessionAnswers;
};

function readSessionIdFromRecord(
  record: Record<string, unknown>,
): string | null {
  const direct = record.session_id ?? record.sessionId ?? record.id;
  if (typeof direct === "string" && direct.trim()) {
    return direct.trim();
  }

  const nested = readRecord(record.session);
  if (nested) {
    const nestedId = nested.session_id ?? nested.sessionId ?? nested.id;
    if (typeof nestedId === "string" && nestedId.trim()) {
      return nestedId.trim();
    }
  }

  return null;
}

export function parseOnboardingSessionId(data: unknown): string | null {
  for (const record of collectApiRecords(data)) {
    const id = readSessionIdFromRecord(record);
    if (id) return id;
  }
  return null;
}

function parseAnswers(raw: unknown): OnboardingSessionAnswers {
  if (!raw || typeof raw !== "object") return {};
  return raw as OnboardingSessionAnswers;
}

export function parseOnboardingSession(data: unknown): ParsedOnboardingSession {
  for (const record of collectApiRecords(data)) {
    const sessionId = readSessionIdFromRecord(record);

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

  return hasDiscoveryChannel(session.answers.step_3);
}

export function hasDiscoveryChannel(
  step3?: OnboardingSessionAnswers["step_3"],
): boolean {
  const channel = step3?.discovery_channel;
  if (Array.isArray(channel)) {
    return channel.some((value) => typeof value === "string" && value.trim());
  }
  return typeof channel === "string" && channel.trim().length > 0;
}

export function discoveryChannelsFromAnswers(
  answers: OnboardingSessionAnswers,
): string[] {
  const channel = answers.step_3?.discovery_channel;
  if (Array.isArray(channel)) {
    return channel
      .filter((value): value is string => typeof value === "string")
      .map((value) => value.trim())
      .filter(Boolean);
  }
  if (typeof channel === "string" && channel.trim()) {
    return [channel.trim()];
  }
  return [];
}

/** @deprecated Use {@link discoveryChannelsFromAnswers}. */
export function discoveryChannelFromAnswers(
  answers: OnboardingSessionAnswers,
): string {
  return discoveryChannelsFromAnswers(answers)[0] ?? "";
}

export function isOnboardingConflictStatus(status?: number): boolean {
  return status === 409;
}

export function parseOnboardingRedirectTarget(data: unknown): string | null {
  for (const record of collectApiRecords(data)) {
    const redirect = readRecord(record.redirect);
    const to = redirect?.to;
    if (typeof to === "string" && to.trim()) {
      return to.trim();
    }
  }
  return null;
}

/** True when POST /onboarding/start or /onboarding/complete indicates onboarding is done. */
export function isOnboardingAlreadyCompleteResponse(data: unknown): boolean {
  const session = parseOnboardingSession(data);
  const status = session.status?.toLowerCase().trim();

  // Active wizard session — resume even when the message mentions redirect elsewhere.
  if (session.sessionId && status === "in_progress") {
    return false;
  }

  if (status && COMPLETED_SESSION_STATUSES.has(status)) {
    return true;
  }

  const message = readApiMessage(data)?.toLowerCase() ?? "";
  if (message.includes("already complete")) {
    return true;
  }

  if (parseOnboardingRedirectTarget(data) && !session.sessionId) {
    return true;
  }

  return false;
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
  const answer: {
    customer_tags: {
      type: string[];
      wants: string[];
      location: string[];
    };
    additional_notes?: string;
  } = {
    customer_tags: {
      type: input.theyAre,
      wants: input.whoWantTo,
      location: input.locatedIn,
    },
  };

  const notes = input.customCustomerInput.trim();
  if (notes) {
    answer.additional_notes = notes;
  }

  return answer;
}

export function buildStep3Answer(trafficChannels: string[]) {
  const channels = trafficChannels
    .map((channel) => channel.trim())
    .filter(Boolean);
  return { discovery_channel: channels };
}

export function customerTagsFromAnswers(
  answers: OnboardingSessionAnswers,
): string[] {
  const tags = answers.step_2?.customer_tags;
  return [
    ...(tags?.type ?? []),
    ...(tags?.wants ?? []),
    ...(tags?.location ?? []),
    ...(answers.step_2?.additional_notes
      ? [answers.step_2.additional_notes]
      : []),
  ];
}

export function customerProfileFromAnswers(answers: OnboardingSessionAnswers) {
  const tags = answers.step_2?.customer_tags;
  return {
    theyAre: tags?.type,
    whoWantTo: tags?.wants,
    locatedIn: tags?.location,
    customCustomerInput: answers.step_2?.additional_notes,
  };
}
