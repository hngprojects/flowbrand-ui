import { readApiMessage } from "@/lib/api-envelope";
import type { FunnelSource } from "@/lib/funnel-api-types";

/** Shown when generation or loading the strategy dashboard fails (not while still generating). */
export const STRATEGY_GENERATION_FAILED_MESSAGE =
  "Error generating strategy. Try again.";

/** Map POST /api/funnels/generate errors to UI actions (per staging OpenAPI). */
export function classifyGenerateFunnelError(
  status: number | undefined,
  data: unknown,
  fallback: string,
  source?: FunnelSource,
): { message: string; needsOnboarding?: boolean; rateLimited?: boolean } {
  const apiMessage = readApiMessage(data);
  const text = (apiMessage ?? fallback).toLowerCase();

  if (status === 422) {
    const uploadsNotReady =
      text.includes("upload") &&
      (text.includes("not ready") ||
        text.includes("not owned") ||
        text.includes("upload_ids"));

    if (source === "document_upload") {
      if (uploadsNotReady) {
        return {
          message:
            "Documents are still processing or were not accepted. Wait until every file shows ready, then try again.",
        };
      }
      return {
        message:
          apiMessage ??
          "Could not start strategy generation from your documents. Ensure all files finished processing.",
      };
    }

    const needsOnboarding =
      text.includes("onboarding") ||
      text.includes("wizard") ||
      text.includes("session not complete");

    if (needsOnboarding) {
      return {
        message:
          "Complete the onboarding questions before creating your strategy.",
        needsOnboarding: true,
      };
    }
    if (uploadsNotReady) {
      return {
        message:
          "Documents are still processing. Wait until every file shows ready, then try again.",
      };
    }
    if (text.includes("upload_ids") || text.includes("document_upload")) {
      return {
        message:
          "Upload at least one document and wait until processing finishes.",
      };
    }
    return { message: apiMessage ?? fallback };
  }

  if (status === 409) {
    return {
      message:
        apiMessage ??
        "A strategy is already being generated. Opening your strategy page…",
    };
  }

  if (status === 429) {
    return {
      message:
        apiMessage ??
        "You have started too many strategies recently. Please wait and try again.",
      rateLimited: true,
    };
  }

  if (status === 503) {
    return {
      message:
        apiMessage ??
        "Strategy generation is temporarily unavailable. Please try again shortly.",
    };
  }

  return { message: apiMessage ?? fallback };
}
