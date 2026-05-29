"use server";

import axios from "axios";
import { auth } from "@/auth";
import { envConfig } from "@/config/env.config";
import { formatHttpApiError } from "@/lib/api-errors";
import { flowLog, flowLogApiResult } from "@/lib/flow-debug-log";

function onboardingUrl(path: string): string {
  const base = envConfig.BASEURL.replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}/api/onboarding${suffix}`;
}

async function getAccessToken(): Promise<string | null> {
  const session = await auth();
  const token = session?.access_token;
  return session?.user?.id &&
    session.invalid !== true &&
    typeof token === "string"
    ? token
    : null;
}

export type OnboardingActionResult<T = unknown> =
  | { ok: true; status: number; data: T }
  | { ok: false; error: string; status?: number };

export async function startOnboarding(): Promise<OnboardingActionResult> {
  flowLog("onboarding", "POST /api/onboarding/start → request");
  const token = await getAccessToken();
  if (!token) {
    const result = {
      ok: false as const,
      error: "Session expired. Please sign in again.",
      status: 401,
    };
    flowLogApiResult("onboarding", "POST /api/onboarding/start", result);
    return result;
  }

  try {
    const res = await axios.post(onboardingUrl("/start"), null, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 30000,
      validateStatus: (status) => status === 200 || status === 201,
    });
    const result = { ok: true as const, status: res.status, data: res.data };
    flowLogApiResult("onboarding", "POST /api/onboarding/start", result);
    return result;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      if (status === 409) {
        const result = {
          ok: false as const,
          error: formatHttpApiError(
            status,
            data,
            "Onboarding already complete.",
          ),
          status,
        };
        flowLogApiResult("onboarding", "POST /api/onboarding/start", result);
        return result;
      }
      const result = {
        ok: false as const,
        error: formatHttpApiError(status, data, "Could not start onboarding."),
        status,
      };
      flowLogApiResult("onboarding", "POST /api/onboarding/start", result);
      return result;
    }
    const result = { ok: false as const, error: "Could not reach the server." };
    flowLogApiResult("onboarding", "POST /api/onboarding/start", result);
    return result;
  }
}

export async function saveOnboardingStep(input: {
  session_id: string;
  step: number;
  answer: Record<string, unknown>;
}): Promise<OnboardingActionResult> {
  flowLog("onboarding", "POST /api/onboarding/step → request", {
    step: input.step,
    session_id: input.session_id,
  });
  const token = await getAccessToken();
  if (!token) {
    const result = {
      ok: false as const,
      error: "Session expired. Please sign in again.",
      status: 401,
    };
    flowLogApiResult("onboarding", "POST /api/onboarding/step", result, {
      step: input.step,
    });
    return result;
  }

  try {
    const res = await axios.post(onboardingUrl("/step"), input, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 30000,
    });
    const result = { ok: true as const, status: res.status, data: res.data };
    flowLogApiResult("onboarding", "POST /api/onboarding/step", result, {
      step: input.step,
    });
    return result;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      const result = {
        ok: false as const,
        error: formatHttpApiError(status, data, "Could not save your answer."),
        status,
      };
      flowLogApiResult("onboarding", "POST /api/onboarding/step", result, {
        step: input.step,
      });
      return result;
    }
    const result = { ok: false as const, error: "Could not reach the server." };
    flowLogApiResult("onboarding", "POST /api/onboarding/step", result, {
      step: input.step,
    });
    return result;
  }
}

export async function completeOnboarding(
  session_id: string,
): Promise<OnboardingActionResult<{ redirect?: { to?: string } }>> {
  flowLog("onboarding", "POST /api/onboarding/complete → request", {
    session_id,
  });
  const token = await getAccessToken();
  if (!token) {
    const result = {
      ok: false as const,
      error: "Session expired. Please sign in again.",
      status: 401,
    };
    flowLogApiResult("onboarding", "POST /api/onboarding/complete", result);
    return result;
  }

  try {
    const res = await axios.post(
      onboardingUrl("/complete"),
      { session_id },
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 30000,
        validateStatus: (status) => status === 200 || status === 409,
      },
    );
    return { ok: true, status: res.status, data: res.data?.data ?? res.data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      return {
        ok: false,
        error: formatHttpApiError(
          status,
          data,
          "Could not complete onboarding.",
        ),
        status,
      };
    }
    return { ok: false, error: "Could not reach the server." };
  }
}

// export async function getOnboardingSession(): Promise<OnboardingActionResult> {
//   const token = await getAccessToken();
//   if (!token)
//     return {
//       ok: false,
//       error: "Session expired. Please sign in again.",
//       status: 401,
//     };

//   try {
//     const res = await axios.get(onboardingUrl("/start"), {
//       headers: { Authorization: `Bearer ${token}` },
//       timeout: 30000,
//     });
//     const result = { ok: true as const, status: res.status, data: res.data };
//     flowLogApiResult("onboarding", "GET /api/onboarding/start", result);
//     return result;
//   } catch (error) {
//     if (axios.isAxiosError(error) && error.response) {
//       const { status, data } = error.response;
//       const result = {
//         ok: false as const,
//         error: formatHttpApiError(status, data, "Could not load your session."),
//         status,
//       };
//       flowLogApiResult("onboarding", "GET /api/onboarding/start", result);
//       return result;
//     }
//     const result = { ok: false as const, error: "Could not reach the server." };
//     flowLogApiResult("onboarding", "GET /api/onboarding/start", result);
//     return result;
//   }
// }
