import { toast } from "sonner";

const SESSION_KEY = "flowbrand-funnel-preview-toast";

/** Once per browser session — funnel still uses placeholder strategy data. */
export function showFunnelPreviewToast(): void {
  if (typeof window === "undefined") return;
  if (sessionStorage.getItem(SESSION_KEY)) return;

  sessionStorage.setItem(SESSION_KEY, "1");
  toast.info("Preview with sample data", {
    description:
      "This strategy page is showing placeholder content until yours is ready.",
  });
}
