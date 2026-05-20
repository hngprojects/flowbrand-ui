"use server";

import axios from "axios";
import { envConfig } from "@/config/env.config";
import {
  extractApiErrorMessages,
  formatHttpApiError,
  readSuccessMessage,
} from "@/lib/api-errors";
import {
  ContactFormSchema,
  type ContactFormValues,
} from "@/schema/contact.schema";

function publicApiUrl(baseUrl: string, path: string): string {
  const base = baseUrl.replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}

export type SubmitContactResult =
  | { ok: true; message: string }
  | { ok: false; message: string; status?: number };

export async function submitContact(
  input: ContactFormValues,
): Promise<SubmitContactResult> {
  const parsed = ContactFormSchema.safeParse(input);
  if (!parsed.success) {
    const first =
      parsed.error.issues[0]?.message ?? "Please check your details.";
    return { ok: false, message: first, status: 400 };
  }

  const { fullName, email, businessName, message } = parsed.data;
  const url = publicApiUrl(envConfig.BASEURL, "/api/contact");

  try {
    const response = await axios.post(
      url,
      {
        fullName,
        email,
        businessName,
        message,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        validateStatus: () => true,
        timeout: 60_000,
      },
    );

    if (response.status >= 200 && response.status < 300) {
      return {
        ok: true,
        message: readSuccessMessage(response.data, "Message sent successfully"),
      };
    }

    if (response.status === 429) {
      return {
        ok: false,
        message: formatHttpApiError(
          429,
          response.data,
          "Too many requests. Please try again later.",
        ),
        status: 429,
      };
    }

    if (response.status >= 400) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[contact] API error", {
          status: response.status,
          body: response.data,
          url,
        });
      }
      const detail = extractApiErrorMessages(response.data);
      const fallback =
        response.status === 400 || response.status === 422
          ? formatHttpApiError(
              response.status,
              response.data,
              "Please check your details and try again.",
            )
          : readSuccessMessage(
              response.data,
              "Could not send your message. Please try again.",
            );
      return {
        ok: false,
        message: detail || fallback,
        status: response.status,
      };
    }

    return {
      ok: false,
      message: "Unexpected response from server. Please try again.",
      status: response.status,
    };
  } catch {
    return {
      ok: false,
      message: "Network error. Please check your connection and try again.",
    };
  }
}
