"use server";

import * as z from "zod";
import { cookies } from "next/headers";
import { envConfig } from "~/config/env.config";
import { LoginSchema } from "@/schema/auth.schema";
import type { AuthResponse, ErrorResponse, User } from "@/types/auth";
import {
  AUTH_API_PREFIX,
  messageFromApiBody,
  parseLoginEnvelope,
} from "~/lib/auth-api";
import { FetchTimeoutError, HttpError, createFetchUtil } from "./fetchutil";

export interface LoginResponse {
  user: User;
  access_token: string;
}

const GENERIC_LOGIN_ERROR_MESSAGE = "Unable to sign in. Please try again.";

export const nextLogin = async (
  values: z.infer<typeof LoginSchema>,
): Promise<AuthResponse | ErrorResponse> => {
  const baseURL = envConfig.BASEURL;

  if (!baseURL) {
    return {
      status_code: 500,
      message: GENERIC_LOGIN_ERROR_MESSAGE,
      success: false,
    };
  }
  const api = createFetchUtil({ baseUrl: baseURL });

  try {
    const response = await api<unknown>(`${AUTH_API_PREFIX}/login`, {
      method: "POST",
      body: { email: values.email, password: values.password },
    });

    const parsed = parseLoginEnvelope(response);
    if (!parsed) {
      return {
        success: false,
        message: GENERIC_LOGIN_ERROR_MESSAGE,
        status_code: 502,
      };
    }

    return {
      data: parsed.user,
      access_token: parsed.access_token,
      success: true,
      message: "login success",
    };
  } catch (error) {
    if (error instanceof FetchTimeoutError) {
      return {
        success: false,
        message: GENERIC_LOGIN_ERROR_MESSAGE,
        status_code: 504,
      };
    }

    if (error instanceof HttpError) {
      return {
        success: false,
        message: messageFromApiBody(
          error.responseBody,
          error.statusCode >= 500
            ? GENERIC_LOGIN_ERROR_MESSAGE
            : "Invalid email or password.",
        ),
        status_code: error.statusCode,
      };
    }

    return {
      success: false,
      message: GENERIC_LOGIN_ERROR_MESSAGE,
      status_code: 500,
    };
  }
};

export const setBackend = async (backend?: string) => {
  const cookieStore = await cookies();
  if (backend) {
    cookieStore.set("backend", backend, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  }

  return {
    success: true,
  };
};
