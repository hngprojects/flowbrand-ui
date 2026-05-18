"use client";

import { useState } from "react";
import OnboardingQuestions from "@/components/onboarding/questions/page";
import UploadPage from "@/components/onboarding/upload/page";

type OnboardingView = "upload" | "questions";

export default function Onboarding() {
  const [view, setView] = useState<OnboardingView>("upload");

  if (view === "questions") {
    return <OnboardingQuestions onBackToUpload={() => setView("upload")} />;
  }

  return <UploadPage onSwitchToQuestions={() => setView("questions")} />;
}
