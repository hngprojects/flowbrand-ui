"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { onboardingSchema } from "@/schema/onboarding";
import { Button } from "@/components/ui/button";
import { showStrategyPreviewToast } from "@/lib/strategy-preview-toast";
import {
  buildSessionFromOnboarding,
  saveDashboardMockSession,
} from "@/lib/dashboard-mock-session";
import { STRATEGY_ROUTE, ONBOARDING_UPLOAD_ROUTE } from "@/routes";
import {
  startOnboarding,
  saveOnboardingStep,
  completeOnboarding,
} from "@/actions/onboarding";

import ProgressBar from "./ProgressBar";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";

export function QuestionsView() {
  const router = useRouter();
  const store = useOnboardingStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (store.sessionId) return;
    (async () => {
      try {
        const res = await startOnboarding();
        if (res.ok) {
          const body = res.data as {
            session_id?: string;
            data?: { session_id?: string };
          };
          const id = body?.data?.session_id ?? body?.session_id;
          if (id) store.setSessionId(id);
        } else if (res.status === 409) {
          router.push(STRATEGY_ROUTE);
        } else {
          toast.error(res.error);
        }
      } catch {
        toast.error(
          "Could not start onboarding. Please refresh and try again.",
        );
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBackClick = () => {
    if (store.step === 1) {
      router.push(ONBOARDING_UPLOAD_ROUTE);
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
      toast.error(validation.error.issues?.[0]?.message || "Validation Error");
      return;
    }

    if (!store.sessionId) {
      toast.error("Session not ready. Please try again.");
      return;
    }

    try {
      setIsLoading(true);

      const sessionId = store.sessionId;

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
      if (!done.ok && done.status !== 409) {
        toast.error(done.error);
        return;
      }

      store.setSessionId(null);

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

      showStrategyPreviewToast();
      router.push(STRATEGY_ROUTE);
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
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
