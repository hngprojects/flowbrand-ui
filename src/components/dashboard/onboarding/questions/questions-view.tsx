"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { onboardingSchema } from "@/schema/onboarding";
import { Button } from "@/components/ui/button";
import { showFunnelPreviewToast } from "@/lib/funnel-preview-toast";
import {
  buildSessionFromOnboarding,
  saveDashboardMockSession,
} from "@/lib/dashboard-mock-session";
import { FUNNEL_ROUTE, ONBOARDING_UPLOAD_ROUTE } from "@/routes";

import ProgressBar from "./ProgressBar";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";

export function QuestionsView() {
  const router = useRouter();
  const store = useOnboardingStore();
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const handleBackClick = () => {
    setErrorText(null);
    if (store.step === 1) {
      router.push(ONBOARDING_UPLOAD_ROUTE);
    } else {
      store.prevStep();
    }
  };

  const handleCreateStrategy = async () => {
    if (isLoading) return;

    setErrorText(null);

    const payload = {
      businessDescription: store.businessDescription,
      idealCustomer: {
        theyAre: store.theyAre,
        whoWantTo: store.whoWantTo,
        locatedIn: store.locatedIn,
        customInput: store.customCustomerInput,
      },
      trafficChannel: store.trafficChannel,
    };

    const validation = onboardingSchema.safeParse(payload);
    if (!validation.success) {
      const firstErrorMessage =
        validation.error.issues?.[0]?.message || "Validation Error";
      setErrorText(firstErrorMessage);
      return;
    }

    setIsLoading(true);
    // Local-only flow: persist answers for funnel dummy UI (no API).
    await new Promise((resolve) => setTimeout(resolve, 600));

    saveDashboardMockSession(
      buildSessionFromOnboarding({
        businessDescription: store.businessDescription,
        theyAre: store.theyAre,
        whoWantTo: store.whoWantTo,
        locatedIn: store.locatedIn,
        customCustomerInput: store.customCustomerInput,
        trafficChannel: store.trafficChannel,
        uploadedDocuments: store.uploadedDocuments,
      }),
    );

    showFunnelPreviewToast();
    router.push(FUNNEL_ROUTE);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-default">
      <div className="w-full max-w-[560px] space-y-small">
        <div className="flex items-center mb-default">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackClick}
            className="px-2 text-label bg-card border border-border hover:bg-card/50 font-medium text-sm transition-opacity hover:opacity-80"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.35"
              className="h-4 w-7 text-label"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M22 12H2M9.5 7.5L2 12l7.5 4.5"
              />
            </svg>
            Back
          </Button>
        </div>

        <div className="bg-card p-section rounded-2xl border border-border shadow-sm space-y-default">
          <ProgressBar currentStep={store.step} />

          {store.step === 1 && (
            <StepOne
              value={store.businessDescription}
              onChange={(val) => {
                setErrorText(null);
                store.setBusinessDescription(val);
              }}
              onNext={() => {
                setErrorText(null);
                store.nextStep();
              }}
            />
          )}

          {store.step === 2 && (
            <StepTwo
              theyAre={store.theyAre}
              toggleTheyAre={(val) => {
                setErrorText(null);
                store.toggleTheyAre(val);
              }}
              whoWantTo={store.whoWantTo}
              toggleWhoWantTo={(val) => {
                setErrorText(null);
                store.toggleWhoWantTo(val);
              }}
              locatedIn={store.locatedIn}
              toggleLocatedIn={(val) => {
                setErrorText(null);
                store.toggleLocatedIn(val);
              }}
              customInput={store.customCustomerInput}
              setCustomInput={(val) => {
                setErrorText(null);
                store.setCustomCustomerInput(val);
              }}
              onNext={() => {
                setErrorText(null);
                store.nextStep();
              }}
            />
          )}

          {store.step === 3 && (
            <StepThree
              selected={store.trafficChannel}
              onSelect={(val) => {
                setErrorText(null);
                if (store.trafficChannel === val) {
                  store.setTrafficChannel("");
                } else {
                  store.setTrafficChannel(val);
                }
              }}
              onSubmit={handleCreateStrategy}
              isLoading={isLoading}
            />
          )}

          {errorText && (
            <div
              role="alert"
              className="text-2sm font-medium text-destructive bg-destructive/10 p-small rounded-sm transition-all"
            >
              {errorText}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
