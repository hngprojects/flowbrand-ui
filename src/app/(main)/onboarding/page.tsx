"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import ProgressBar from "@/components/onboarding/ProgressBar";
import StepOne from "@/components/onboarding/StepOne";
import StepTwo from "@/components/onboarding/StepTwo";
import StepThree from "@/components/onboarding/StepThree";

export default function OnboardingPage() {
  const router = useRouter();
  const store = useOnboardingStore();
  const [isLoading] = useState(false);

  const handleBackClick = () => {
    if (store.step === 1) {
      router.push("/login");
    } else {
      store.prevStep();
    }
  };

  const handleCreateStrategy = () => {
    toast.info("Strategy submission coming soon.");
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
                store.setBusinessDescription(val);
              }}
              onNext={() => {
                store.nextStep();
              }}
            />
          )}

          {store.step === 2 && (
            <StepTwo
              theyAre={store.theyAre}
              toggleTheyAre={(val) => {
                store.toggleTheyAre(val);
              }}
              whoWantTo={store.whoWantTo}
              toggleWhoWantTo={(val) => {
                store.toggleWhoWantTo(val);
              }}
              locatedIn={store.locatedIn}
              toggleLocatedIn={(val) => {
                store.toggleLocatedIn(val);
              }}
              customInput={store.customCustomerInput}
              setCustomInput={(val) => {
                store.setCustomCustomerInput(val);
              }}
              onNext={() => {
                store.nextStep();
              }}
            />
          )}

          {store.step === 3 && (
            <StepThree
              selected={store.trafficChannel}
              onSelect={(val) => {
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
        </div>
      </div>
    </div>
  );
}
