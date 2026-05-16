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
  authApiUrl,
  messageFromApiBody,
  parseLoginEnvelope,
} from "~/lib/auth-api";
import {
  LoginSchema,
  registrationPasswordField,
  VerifyOtpCodeSchema,
} from "@/schema/auth.schema";
import { AuthResponse, ErrorResponse } from "@/types/auth";

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
  return authApiUrl(envConfig.BASEURL, "/google");
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
  try {
    const response = await axios.post(
      authApiUrl(baseURL, "/login"),
      { email, password },
      { withCredentials: true },
    );
    const parsed = parseLoginEnvelope(response.data);
    if (!parsed) {
      return {
        success: false,
        message: "Something went wrong",
        status_code: response.status,
      };
    }
    return {
      data: parsed.user,
      access_token: parsed.access_token,
      success: true,
      message: messageFromApiBody(response.data, "Login successful"),
    };
  } catch (error) {
    return {
      success: false,
      message:
        axios.isAxiosError(error) && error.response
          ? messageFromApiBody(error.response.data, "Something went wrong")
          : "Something went wrong",
      status_code:
        axios.isAxiosError(error) && error.response
          ? error.response.status
          : undefined,
    };
  }
};

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
  const payload = {
    email: values.email.trim(),
    full_name: values.full_name.trim(),
    country: values.country.trim(),
    password: values.password,
    terms_accepted: values.terms_accepted ?? true,
  };

  const registrationBodySchema = z.object({
    email: z.string().email(),
    full_name: z.string().trim().min(1, { message: "Full name is required." }),
    country: z.string().trim().min(1, { message: "Country is required." }),
    password: registrationPasswordField,
    terms_accepted: z.literal(true),
  });

  const validated = registrationBodySchema.safeParse(payload);
  if (!validated.success) {
    return {
      ok: false,
      error:
        validated.error.issues[0]?.message ??
        "Registration failed. Please check your inputs.",
    };
  }

  try {
    const response = await axios.post(
      authApiUrl(baseURL, "/register"),
      validated.data,
      { withCredentials: true },
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
          error: messageFromApiBody(
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
    const response = await axios.post(
      authApiUrl(baseURL, "/resend-otp"),
      { email: validated.email },
      { withCredentials: true },
    );

    const success: ResendOtpSuccess = {
      status: response.status,
      message: messageFromApiBody(response.data, "OTP sent successfully"),
    };
    return success;
  } catch (error) {
    return axios.isAxiosError(error) && error.response
      ? {
          error: messageFromApiBody(error.response.data, "Resend OTP failed."),
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
    const response = await axios.post(
      authApiUrl(baseURL, "/verify-otp"),
      { email: validatedEmail.email, otp: validatedCode.code },
      { withCredentials: true },
    );
    const success: VerifyOtpSuccess = {
      status: response.status,
      message: messageFromApiBody(response.data, "Email verified successfully"),
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
): Promise<{ ok: true } | { ok: false; error: string }> => {
  const validated = validateAuthEmail(email);
  if ("error" in validated) {
    return { ok: false, error: validated.error };
  }

  const baseURL = envConfig.BASEURL;
  try {
    await axios.post(
      authApiUrl(baseURL, "/password/forgot"),
      { email: validated.email },
      { withCredentials: true },
    );
    return { ok: true };
  } catch (error) {
    return axios.isAxiosError(error) && error.response
      ? {
          ok: false,
          error: messageFromApiBody(
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
      authApiUrl(baseURL, "/password/reset"),
      {
        token: trimmed,
        password: input.password,
      },
      { withCredentials: true, timeout: 30_000 },
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
          error: messageFromApiBody(
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
