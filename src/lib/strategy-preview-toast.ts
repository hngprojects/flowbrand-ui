import { toast } from "sonner";

const SESSION_KEY = "flowbrand-strategy-preview-toast";

/** Once per browser session — strategy view still uses placeholder data. */
export function showStrategyPreviewToast(): void {
  if (typeof window === "undefined") return;
  if (sessionStorage.getItem(SESSION_KEY)) return;

  sessionStorage.setItem(SESSION_KEY, "1");
  toast.info("Preview mode", {
    description:
      "Using sample data from your onboarding answers — no API calls in this flow.",
  });
}
