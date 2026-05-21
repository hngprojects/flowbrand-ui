import { redirect } from "next/navigation";
import { ONBOARDING_UPLOAD_ROUTE } from "@/routes";

/** /dashboard/onboarding → document upload (default entry). */
export default function OnboardingIndexPage() {
  redirect(ONBOARDING_UPLOAD_ROUTE);
}
