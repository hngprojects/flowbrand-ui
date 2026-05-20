"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { onboardingSchema } from "@/schema/onboarding";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  startOnboarding,
  saveOnboardingStep,
  completeOnboarding,
} from "@/actions/onboarding";

import ProgressBar from "@/components/onboarding/ProgressBar";
import StepOne from "@/components/onboarding/StepOne";
import StepTwo from "@/components/onboarding/StepTwo";
import StepThree from "@/components/onboarding/StepThree";

export default function OnboardingPage() {
  const router = useRouter();
  const store = useOnboardingStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (store.sessionId) return;
    (async () => {
      const res = await startOnboarding();
      if (res.ok) {
        const data = res.data as { data?: { session_id?: string } };
        const id = data?.data?.session_id;
        if (id) store.setSessionId(id);
      } else if (res.status === 409) {
        router.push("/funnel");
      } else {
        toast.error(res.error);
      }
    })();
  }, []);

  const handleBackClick = () => {
    if (store.step === 1) {
      router.push("/login");
    } else {
      store.prevStep();
    }
  };

  const handleCreateStrategy = async () => {
    if (isLoading) return;

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
      toast.error(validation.error.issues?.[0]?.message || "Invalid input");
      return;
    }

    try {
      setIsLoading(true);

      const start = await startOnboarding();
      if (!start.ok) {
        if (start.status === 409) {
          router.push("/funnel");
          return;
        }
        toast.error(start.error);
        return;
      }

      const startData = start.data as { data?: { session_id?: string } };
      const sessionId = startData?.data?.session_id;
      if (!sessionId) {
        toast.error("Session not ready. Please try again.");
        return;
      }
      store.setSessionId(sessionId);

      const steps = [
        {
          step: 1,
          answer: { business_description: store.businessDescription },
        },
        {
          step: 2,
          answer: {
            customer_tags: {
              type: [
                ...store.theyAre,
                ...store.whoWantTo,
                ...store.locatedIn,
                ...(store.customCustomerInput.trim()
                  ? [store.customCustomerInput.trim()]
                  : []),
              ],
            },
          },
        },
        {
          step: 3,
          answer: { discovery_channel: store.trafficChannel },
        },
      ];

      for (const s of steps) {
        const res = await saveOnboardingStep({
          session_id: sessionId,
          step: s.step,
          answer: s.answer,
        });
        if (!res.ok) {
          toast.error(res.error);
          return;
        }
      }

      const done = await completeOnboarding(sessionId);
      if (!done.ok) {
        toast.error(done.error);
        return;
      }

      store.setSessionId(null);
      toast.success("Strategy created successfully!");
      router.push("/funnel");
    } catch {
      toast.error("Something went wrong.");
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
