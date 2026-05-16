"use server";

import axios from "axios";
import * as z from "zod";
import { envConfig } from "~/config/env.config";
import type {
  RegisterUserResult,
  ResendOtpResult,
  ResendOtpSuccess,
  ResetPasswordResult,
  VerifyOtpResult,
  VerifyOtpSuccess,
} from "~/lib/auth-action-results";
import {
  LoginSchema,
  RegisterSchema,
  VerifyOtpCodeSchema,
} from "@/schema/auth.schema";
import { AuthResponse, ErrorResponse } from "@/types/auth";

/** Safe string from API error payloads; avoids showing objects in the UI. */
function messageFromAxiosData(data: unknown, fallback: string): string {
  if (
    data &&
    typeof data === "object" &&
    "message" in data &&
    typeof (data as { message: unknown }).message === "string"
  ) {
    const text = (data as { message: string }).message.trim();
    if (text.length > 0) {
      return text;
    }
  }
  return fallback;
}

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

const credentialsAuth = async (
  values: z.infer<typeof LoginSchema>,
): Promise<AuthResponse | ErrorResponse> => {
  const baseURL = envConfig.BASEURL;
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      message: "Something went wrong",
      status_code: 401,
      success: false,
    };
  }
  const { email, password } = validatedFields.data;
  const payload = { email, password };
  try {
    const response = await axios.post(`${baseURL}/auth/login`, payload);
    return {
      data: response.data.user,
      access_token: response.data.access_token,
      success: true,
      message: "login success",
    };
  } catch (error) {
    return {
      success: false,
      message:
        axios.isAxiosError(error) && error.response
          ? messageFromAxiosData(error.response.data, "Something went wrong")
          : "Something went wrong",
      status_code:
        axios.isAxiosError(error) && error.response
          ? error.response.status
          : undefined,
    };
  }
};

const registerUser = async (
  values: z.infer<typeof RegisterSchema>,
): Promise<RegisterUserResult> => {
  const validatedFields = RegisterSchema.safeParse(values);
  const baseURL = envConfig.BASEURL;
  if (!validatedFields.success) {
    return {
      ok: false,
      error: "registration  Failed. Please check your inputs.",
    };
  }
  try {
    const response = await axios.post(
      `${baseURL}/auth/register`,
      validatedFields.data,
    );

    return {
      ok: true,
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    return axios.isAxiosError(error) && error.response
      ? {
          ok: false,
          error: messageFromAxiosData(
            error.response.data,
            "Registration failed.",
          ),
          status: error.response.status,
        }
      : {
          ok: false,
          error: "An unexpected error occurred.",
        };
  }
};

const resendOtp = async (email: string): Promise<ResendOtpResult> => {
  const validated = validateAuthEmail(email);
  if ("error" in validated) {
    return { error: validated.error };
  }

  const baseURL = envConfig.BASEURL;
  try {
    const response = await axios.post(`${baseURL}/auth/request/token`, {
      email: validated.email,
    });

    const success: ResendOtpSuccess = {
      status: response.status,
      message: response.data?.message,
    };
    return success;
  } catch (error) {
    return axios.isAxiosError(error) && error.response
      ? {
          error: messageFromAxiosData(
            error.response.data,
            "Resend OTP failed.",
          ),
          status: error.response.status,
        }
      : {
          error: "An unexpected error occurred.",
        };
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
    const response = await axios.post(`${baseURL}/auth/verify/otp`, {
      email: validatedEmail.email,
      code: validatedCode.code,
    });
    const success: VerifyOtpSuccess = {
      status: response.status,
      message: response.data?.message,
    };
    return success;
  } catch (error) {
    return axios.isAxiosError(error) && error.response
      ? {
          error: messageFromAxiosData(
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
): Promise<{ ok: true } | { ok: false; error: string }> => {
  const validated = validateAuthEmail(email);
  if ("error" in validated) {
    return { ok: false, error: validated.error };
  }

  const baseURL = envConfig.BASEURL;
  if (!baseURL) {
    return {
      ok: false,
      error: "Password reset is unavailable until the API is configured.",
    };
  }

  try {
    await axios.post(`${baseURL}/auth/password/forgot`, {
      email: validated.email,
    });
    return { ok: true };
  } catch (error) {
    return axios.isAxiosError(error) && error.response
      ? {
          ok: false,
          error: messageFromAxiosData(
            error.response.data,
            "Could not send reset link.",
          ),
        }
      : { ok: false, error: "An unexpected error occurred." };
  }
};

const resetPasswordWithToken = async (input: {
  token: string;
  password: string;
}): Promise<ResetPasswordResult> => {
  if (typeof input.token !== "string" || typeof input.password !== "string") {
    return { ok: false, error: "Invalid request payload." };
  }

  const trimmed = input.token.trim();
  if (!trimmed) {
    return { ok: false, error: "Reset link is invalid or expired." };
  }
  if (input.password.trim().length === 0) {
    return { ok: false, error: "Password is required." };
  }

  const baseURL = envConfig.BASEURL;
  try {
    await axios.post(
      `${baseURL}/auth/password/reset`,
      {
        token: trimmed,
        password: input.password,
      },
      { timeout: 30_000 },
    );
    return { ok: true };
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
          error: messageFromAxiosData(
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
  resetPasswordWithToken,
  verifyOtp,
};
