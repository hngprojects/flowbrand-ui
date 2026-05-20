import axios from "axios";
import type { z } from "zod";
import { envConfig } from "@/config/env.config";
import {
  authApiUrl,
  messageFromApiBody,
  parseLoginEnvelope,
} from "@/lib/auth-api";
import { LoginSchema } from "@/schema/auth.schema";
import type { AuthResponse, ErrorResponse } from "@/types/auth";

/** Password login against the backend API (used by NextAuth authorize, not a server action). */
export async function credentialsAuth(
  values: z.infer<typeof LoginSchema>,
): Promise<AuthResponse | ErrorResponse> {
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
      authApiUrl(envConfig.BASEURL, "/login"),
      { email, password },
      { withCredentials: true },
    );
    const parsed = parseLoginEnvelope(response.data);
    if (!parsed) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[auth] Unrecognized login response shape", response.data);
      }
      return {
        success: false,
        message:
          "Login succeeded but the server response was invalid. Contact support.",
        status_code: 502,
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
}
