"use server";

import * as z from "zod";
import { cookies } from "next/headers";
import { envConfig } from "~/config/env.config";
import { LoginSchema } from "@/schema/auth.schema";
import type { AuthResponse, ErrorResponse, User } from "@/types/auth";
import { HttpError, createFetchUtil } from "./fetchutil";

export interface LoginResponse {
  user: User;
  access_token: string;
}

const GENERIC_LOGIN_ERROR_MESSAGE = "Unable to sign in. Please try again.";

function extractHttpErrorMessage(
  responseBody: unknown,
  fallbackMessage: string,
) {
  if (typeof responseBody === "string" && responseBody.trim()) {
    return responseBody;
  }

  if (responseBody && typeof responseBody === "object") {
    const message = (responseBody as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return fallbackMessage;
}

function parseLoginPayload(body: unknown): LoginResponse | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const record = body as Record<string, unknown>;
  const nested =
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : null;

  const user = (nested?.user ?? record.user) as User | undefined;
  const access_token = (record.access_token ?? nested?.access_token) as
    | string
    | undefined;

  if (!user || !access_token) {
    return null;
  }

  return { user, access_token };
}

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
    const response = await api<unknown>("/auth/login", {
      method: "POST",
      body: values,
    });

    const parsed = parseLoginPayload(response);
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
    if (error instanceof HttpError) {
      return {
        success: false,
        message: extractHttpErrorMessage(
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

export const googleAuth = async (idToken: string) => {
  const res = await fetch(`${envConfig.APP_URL}/api/social/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id_token: idToken }),
  });

  if (!res.ok) {
    throw new Error(`Error: ${res.status}`);
  }

  const data: unknown = await res.json();
  const parsed = parseLoginPayload(data);
  if (!parsed) {
    throw new Error("Invalid Google auth response");
  }

  return {
    data: parsed.user,
    access_token: parsed.access_token,
    success: true,
  };
};

export const setBackend = async (backend?: string) => {
  const cookieStore = await cookies();
  if (backend) {
    cookieStore.set("backend", backend);
  }

  return {
    sucess: true,
  };
};
