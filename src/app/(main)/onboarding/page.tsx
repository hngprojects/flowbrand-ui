"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { onboardingSchema } from "@/schema/onboarding";
import { Button } from "@/components/ui/button";

import ProgressBar from "@/components/onboarding/ProgressBar";
import StepOne from "@/components/onboarding/StepOne";
import StepTwo from "@/components/onboarding/StepTwo";
import StepThree from "@/components/onboarding/StepThree";

export default function OnboardingPage() {
  const router = useRouter();
  const store = useOnboardingStore();
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const handleBackClick = () => {
    setErrorText(null);
    if (store.step === 1) {
      router.push("/auth-routes");
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

    try {
      setIsLoading(true);
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorBodyMessage = "Submission pipeline failure.";
        try {
          const apiErrorData = await response.json();
          if (apiErrorData?.message) errorBodyMessage = apiErrorData.message;
        } catch {
          // Fallback if parsing fails
        }
        throw new Error(errorBodyMessage);
      }

      router.push("/dashboard");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong.";
      setErrorText(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-default">
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

        {/* Content Card Wrapper */}
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
