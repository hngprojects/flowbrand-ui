"use server";

import axios from "axios";
import * as z from "zod";
import { auth } from "@/auth";
import { envConfig } from "~/config/env.config";
import { resolveDashboardEntryPathWithToken } from "@/lib/dashboard-entry";
import type {
  RegisterUserResult,
  RequestPasswordResetResult,
  ResendOtpResult,
  ResetPasswordResult,
  VerifyOtpResult,
  VerifyOtpSuccess,
} from "~/lib/auth-action-results";
import {
  authApiUrl,
  formatAuthApiError,
  messageFromApiBody,
  parseLoginEnvelope,
  readOtpCooldownSeconds,
} from "@/lib/auth-api";
import { credentialsAuth } from "@/lib/credentials-auth";
import {
  registerFullNameField,
  registrationPasswordField,
  VerifyOtpCodeSchema,
} from "@/schema/auth.schema";
import { googleOAuthStartUrl } from "@/lib/google-oauth";
import { mapApiRedirectToAppPath } from "@/routes";

function validateAuthEmail(
  email: string,
): { email: string } | { error: string } {
  const trimmed = email.trim();
  if (!trimmed) {
    return { error: "Email is required." };
  }
  if (!z.string().email().safeParse(trimmed).success) {
    return { error: "Enter a valid email address." };
  }
  return { email: trimmed };
}

function validateOtpCode(code: string): { code: string } | { error: string } {
  const result = VerifyOtpCodeSchema.safeParse(code);
  if (!result.success) {
    return {
      error:
        result.error.issues[0]?.message ?? "Verification code is required.",
    };
  }
  return { code: result.data };
}

export async function getGoogleOAuthUrl(): Promise<string> {
  return googleOAuthStartUrl(envConfig.BASEURL);
}

/** Where to send the user after login/register (uses GET /api/auth/me when possible). */
export async function getPostAuthRedirect(): Promise<string> {
  const session = await auth();
  const accessToken = session?.access_token;
  const isValid =
    !!session?.user?.id &&
    session.invalid !== true &&
    typeof accessToken === "string";

  if (!isValid) {
    return "/login";
  }

  return resolveDashboardEntryPathWithToken(accessToken);
}

export type RegisterUserInput = {
  email: string;
  full_name: string;
  country: string;
  password: string;
  terms_accepted?: boolean;
};

const registerUser = async (
  values: RegisterUserInput,
): Promise<RegisterUserResult> => {
  const baseURL = envConfig.BASEURL;

  const registrationBodySchema = z.object({
    email: z.string().email(),
    fullName: registerFullNameField,
    password: registrationPasswordField,
    termsAccepted: z.literal(true),
  });

  const validated = registrationBodySchema.safeParse({
    email: values.email.trim(),
    fullName: values.full_name.trim(),
    password: values.password,
    termsAccepted: values.terms_accepted ?? true,
  });

  if (!validated.success) {
    const messages = validated.error.issues
      .map((issue) => issue.message)
      .filter(Boolean);
    return {
      ok: false,
      error:
        messages.length > 0
          ? messages.join(" ")
          : "Registration failed. Please check your inputs.",
    };
  }

  const registerUrl = authApiUrl(baseURL, "/register");

  try {
    const response = await axios.post(registerUrl, validated.data, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
      timeout: 30_000,
    });

    return {
      ok: true,
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;

      if (process.env.NODE_ENV === "development") {
        console.error("[auth] register failed", {
          url: registerUrl,
          status,
          body: data,
          sent: validated.data,
        });
      }

      return {
        ok: false,
        error: formatAuthApiError(status, data, "Registration failed."),
        status,
      };
    }

    if (process.env.NODE_ENV === "development") {
      console.error("[auth] register network error", {
        url: registerUrl,
        error,
      });
    }

    return {
      ok: false,
      error: "Could not reach the server. Check your connection and BASE_URL.",
    };
  }
};

const sendOtp = async (email: string): Promise<ResendOtpResult> => {
  const validated = validateAuthEmail(email);
  if ("error" in validated) {
    return { error: validated.error };
  }

  const baseURL = envConfig.BASEURL;
  try {
    const response = await axios.post(
      authApiUrl(baseURL, "/send-otp"),
      { email: validated.email },
      { withCredentials: true },
    );

    return {
      status: response.status,
      message: messageFromApiBody(response.data, "OTP sent successfully"),
      cooldownSeconds: readOtpCooldownSeconds(response.data),
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        error: messageFromApiBody(error.response.data, "Could not send OTP."),
        status: error.response.status,
        cooldownSeconds: readOtpCooldownSeconds(error.response.data),
      };
    }
    return { error: "An unexpected error occurred." };
  }
};

const resendOtp = async (email: string): Promise<ResendOtpResult> => {
  const validated = validateAuthEmail(email);
  if ("error" in validated) {
    return { error: validated.error };
  }

  const baseURL = envConfig.BASEURL;
  try {
    const response = await axios.post(
      authApiUrl(baseURL, "/resend-otp"),
      { email: validated.email },
      { withCredentials: true },
    );

    return {
      status: response.status,
      message: messageFromApiBody(response.data, "OTP sent successfully"),
      cooldownSeconds: readOtpCooldownSeconds(response.data),
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        error: messageFromApiBody(error.response.data, "Resend OTP failed."),
        status: error.response.status,
        cooldownSeconds: readOtpCooldownSeconds(error.response.data),
      };
    }
    return { error: "An unexpected error occurred." };
  }
};

const verifyOtp = async (
  email: string,
  code: string,
): Promise<VerifyOtpResult> => {
  const trimmedEmail = email.trim();
  const trimmedCode = code.trim();
  if (!trimmedEmail && !trimmedCode) {
    return { error: "Email and verification code are required." };
  }

  const validatedEmail = validateAuthEmail(email);
  if ("error" in validatedEmail) {
    return { error: validatedEmail.error };
  }

  const validatedCode = validateOtpCode(code);
  if ("error" in validatedCode) {
    return { error: validatedCode.error };
  }

  const baseURL = envConfig.BASEURL;
  try {
    const response = await axios.post(
      authApiUrl(baseURL, "/verify-otp"),
      { email: validatedEmail.email, otp_code: validatedCode.code },
      { withCredentials: true },
    );
    const parsed = parseLoginEnvelope(response.data);
    if (!parsed?.access_token) {
      return {
        error:
          "Verification succeeded but the server response was invalid. Please try signing in.",
        status: 502,
      };
    }

    const success: VerifyOtpSuccess = {
      status: response.status,
      message: messageFromApiBody(response.data, "Email verified successfully"),
      accessToken: parsed.access_token,
    };
    return success;
  } catch (error) {
    return axios.isAxiosError(error) && error.response
      ? {
          error: messageFromApiBody(
            error.response.data,
            "Invalid or expired verification code.",
          ),
          status: error.response.status,
        }
      : {
          error: "An unexpected error occurred.",
        };
  }
};

const requestPasswordReset = async (
  email: string,
): Promise<RequestPasswordResetResult> => {
  const validated = validateAuthEmail(email);
  if ("error" in validated) {
    return { ok: false, error: validated.error };
  }

  const baseURL = envConfig.BASEURL;
  try {
    const url = authApiUrl(baseURL, "/forgot-password");
    const response = await axios.post(
      url,
      { email: validated.email },
      {
        withCredentials: true,
        timeout: 30_000,
        headers: { "Content-Type": "application/json" },
      },
    );

    if (process.env.NODE_ENV === "development") {
      console.info("[auth] forgot-password", {
        url,
        status: response.status,
        body: response.data,
      });
    }

    return {
      ok: true,
      message: messageFromApiBody(
        response.data,
        "If your email is registered, you will receive a password reset code.",
      ),
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (process.env.NODE_ENV === "development") {
        console.error("[auth] forgot-password failed", {
          status: error.response.status,
          body: error.response.data,
        });
      }
      return {
        ok: false,
        error: formatAuthApiError(
          error.response.status,
          error.response.data,
          "Could not send reset code.",
        ),
      };
    }
    return { ok: false, error: "An unexpected error occurred." };
  }
};

const resetPasswordWithOtp = async (input: {
  email: string;
  otp_code: string;
  password: string;
}): Promise<ResetPasswordResult> => {
  const validatedEmail = validateAuthEmail(input.email);
  if ("error" in validatedEmail) {
    return { ok: false, error: validatedEmail.error };
  }

  const validatedCode = validateOtpCode(input.otp_code);
  if ("error" in validatedCode) {
    return { ok: false, error: validatedCode.error };
  }

  const passwordResult = registrationPasswordField.safeParse(input.password);
  if (!passwordResult.success) {
    return {
      ok: false,
      error:
        passwordResult.error.issues[0]?.message ??
        "Password does not meet requirements.",
    };
  }

  const baseURL = envConfig.BASEURL;
  try {
    const response = await axios.post(
      authApiUrl(baseURL, "/reset-password"),
      {
        email: validatedEmail.email,
        otp_code: validatedCode.code,
        password: passwordResult.data,
      },
      { withCredentials: true, timeout: 30_000 },
    );

    const parsed = parseLoginEnvelope(response.data);
    if (!parsed?.access_token) {
      return {
        ok: false,
        error:
          "Password was reset but the server response was invalid. Please sign in.",
      };
    }

    const redirectUrl =
      mapApiRedirectToAppPath(parsed.redirect_url) ?? parsed.redirect_url;

    return {
      ok: true,
      accessToken: parsed.access_token,
      message: messageFromApiBody(
        response.data,
        "Password reset successful. You have been automatically logged in.",
      ),
      redirectUrl,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
      return {
        ok: false,
        error:
          "The password reset service did not respond in time. Please try again.",
      };
    }
    return axios.isAxiosError(error) && error.response
      ? {
          ok: false,
          error: formatAuthApiError(
            error.response.status,
            error.response.data,
            "Could not reset password. Please try again.",
          ),
        }
      : { ok: false, error: "An unexpected error occurred." };
  }
};

export {
  credentialsAuth,
  registerUser,
  requestPasswordReset,
  resendOtp,
  resetPasswordWithOtp,
  sendOtp,
  verifyOtp,
};
