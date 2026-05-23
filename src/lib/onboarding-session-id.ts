import { parseOnboardingSessionId } from "@/lib/onboarding-api";
import type { OnboardingSessionPayload } from "@/lib/onboarding-query-fns";

export function resolveOnboardingSessionId(
  storeSessionId: string | null | undefined,
  queryPayload: OnboardingSessionPayload | undefined,
): string | null {
  if (storeSessionId?.trim()) {
    return storeSessionId.trim();
  }
  if (!queryPayload) {
    return null;
  }
  return parseOnboardingSessionId(queryPayload.raw);
}
