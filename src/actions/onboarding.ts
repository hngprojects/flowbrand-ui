"use server";

import axios from "axios";
import { auth } from "@/auth";
import { envConfig } from "@/config/env.config";
import { formatAuthApiError } from "@/lib/auth-api";

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
  const token = await getAccessToken();
  if (!token)
    return {
      ok: false,
      error: "Session expired. Please sign in again.",
      status: 401,
    };

  try {
    const res = await axios.post(onboardingUrl("/start"), null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { ok: true, status: res.status, data: res.data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      return {
        ok: false,
        error: formatAuthApiError(status, data, "Could not start onboarding."),
        status,
      };
    }
    return { ok: false, error: "Could not reach the server." };
  }
}

export async function saveOnboardingStep(input: {
  session_id: string;
  step: number;
  answer: Record<string, unknown>;
}): Promise<OnboardingActionResult> {
  const token = await getAccessToken();
  if (!token)
    return {
      ok: false,
      error: "Session expired. Please sign in again.",
      status: 401,
    };

  try {
    const res = await axios.post(onboardingUrl("/step"), input, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { ok: true, status: res.status, data: res.data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      return {
        ok: false,
        error: formatAuthApiError(status, data, "Could not save your answer."),
        status,
      };
    }
    return { ok: false, error: "Could not reach the server." };
  }
}

export async function completeOnboarding(
  session_id: string,
): Promise<OnboardingActionResult<{ redirect?: { to?: string } }>> {
  const token = await getAccessToken();
  if (!token)
    return {
      ok: false,
      error: "Session expired. Please sign in again.",
      status: 401,
    };

  try {
    const res = await axios.post(
      onboardingUrl("/complete"),
      { session_id },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return { ok: true, status: res.status, data: res.data?.data ?? res.data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      return {
        ok: false,
        error: formatAuthApiError(
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

export async function getOnboardingSession(): Promise<OnboardingActionResult> {
  const token = await getAccessToken();
  if (!token)
    return {
      ok: false,
      error: "Session expired. Please sign in again.",
      status: 401,
    };

  try {
    const res = await axios.get(onboardingUrl("/session"), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { ok: true, status: res.status, data: res.data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      return {
        ok: false,
        error: formatAuthApiError(status, data, "Could not load your session."),
        status,
      };
    }
    return { ok: false, error: "Could not reach the server." };
  }
}
