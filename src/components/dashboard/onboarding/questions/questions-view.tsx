"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { onboardingSchema } from "@/schema/onboarding";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  buildSessionFromOnboarding,
  saveDashboardMockSession,
} from "@/lib/dashboard-mock-session";
import { FUNNEL_ROUTE, ONBOARDING_UPLOAD_ROUTE } from "@/routes";
import { clearNewStrategyFlow, isNewStrategyFlow } from "@/lib/new-strategy";
import {
  buildStep1Answer,
  buildStep2Answer,
  buildStep3Answer,
  customerTagsFromAnswers,
  isOnboardingSessionComplete,
  stepNumberFromSession,
} from "@/lib/onboarding-api";
import { parseOnboardingSessionId } from "@/lib/onboarding-query-fns";
import {
  useCompleteOnboardingMutation,
  useOnboardingSessionQuery,
  useSaveOnboardingStepMutation,
} from "@/hooks/queries/use-onboarding-queries";
import { useStartFunnelGenerationMutation } from "@/hooks/mutations/use-funnel-mutations";
import { redirectToExistingFunnelIfAny } from "@/lib/onboarding-client-recovery";
import ProgressBar from "./ProgressBar";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";

const step1Schema = onboardingSchema.pick({ businessDescription: true });
const step2Schema = onboardingSchema.pick({ idealCustomer: true });

export function QuestionsView() {
  const router = useRouter();
  const store = useOnboardingStore();
  const saveStep = useSaveOnboardingStepMutation();
  const completeOnboarding = useCompleteOnboardingMutation();
  const startGeneration = useStartFunnelGenerationMutation();

  const sessionQuery = useOnboardingSessionQuery(true);

  useEffect(() => {
    if (!sessionQuery.isSuccess || !sessionQuery.data) return;

    const { session, raw } = sessionQuery.data;

    if (!isNewStrategyFlow() && isOnboardingSessionComplete(session)) {
      void redirectToExistingFunnelIfAny(router, "wizard").then(
        (redirected) => {
          if (!redirected) router.replace(FUNNEL_ROUTE);
        },
      );
      return;
    }

    const id = parseOnboardingSessionId(raw);
    if (id) store.setSessionId(id);

    const tags = customerTagsFromAnswers(session.answers);
    store.hydrateFromApiSession({
      businessDescription: session.answers.step_1?.business_description,
      customerTags: tags.length > 0 ? tags : undefined,
      trafficChannel: session.answers.step_3?.discovery_channel,
      step: stepNumberFromSession(session),
    });
  }, [sessionQuery.isSuccess, sessionQuery.data, router, store]);

  useEffect(() => {
    if (sessionQuery.isError) {
      toast.error(
        sessionQuery.error instanceof Error
          ? sessionQuery.error.message
          : "Could not start onboarding. Please refresh and try again.",
      );
    }
  }, [sessionQuery.isError, sessionQuery.error]);

  const isBootstrapping = sessionQuery.isPending;
  const isLoading =
    saveStep.isPending ||
    completeOnboarding.isPending ||
    startGeneration.isPending;

  const ensureSessionId = (): string | null => {
    const id = useOnboardingStore.getState().sessionId;
    if (!id) {
      toast.error("Session not ready. Please wait a moment and try again.");
    }
    return id;
  };

  const handleStep1Next = async () => {
    const result = step1Schema.safeParse({
      businessDescription: store.businessDescription,
    });
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Validation error");
      return;
    }

    const sessionId = ensureSessionId();
    if (!sessionId) return;

    try {
      await saveStep.mutateAsync({
        session_id: sessionId,
        step: 1,
        answer: buildStep1Answer(store.businessDescription),
      });
      store.nextStep();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save your answer.",
      );
    }
  };

  const handleStep2Next = async () => {
    const result = step2Schema.safeParse({
      idealCustomer: {
        theyAre: store.theyAre,
        whoWantTo: store.whoWantTo,
        locatedIn: store.locatedIn,
        customInput: store.customCustomerInput,
      },
    });
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Validation error");
      return;
    }

    const sessionId = ensureSessionId();
    if (!sessionId) return;

    try {
      await saveStep.mutateAsync({
        session_id: sessionId,
        step: 2,
        answer: buildStep2Answer({
          theyAre: store.theyAre,
          whoWantTo: store.whoWantTo,
          locatedIn: store.locatedIn,
          customCustomerInput: store.customCustomerInput,
        }),
      });
      store.nextStep();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save your answer.",
      );
    }
  };

  const handleBackClick = () => {
    if (store.step === 1) {
      router.push(ONBOARDING_UPLOAD_ROUTE);
    } else {
      store.prevStep();
    }
  };

  const handleCreateStrategy = async () => {
    if (isLoading || isBootstrapping) return;

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

    const sessionId = ensureSessionId();
    if (!sessionId) return;

    try {
      await saveStep.mutateAsync({
        session_id: sessionId,
        step: 3,
        answer: buildStep3Answer(store.trafficChannel),
      });

      await completeOnboarding.mutateAsync(sessionId);
      store.setSessionId(null);

      if (!isNewStrategyFlow()) {
        if (await redirectToExistingFunnelIfAny(router, "wizard")) {
          clearNewStrategyFlow();
          return;
        }
      }

      const uploadIds = store.uploadedDocuments.map((doc) => doc.id);
      await startGeneration.mutateAsync({
        source: uploadIds.length > 0 ? "document_upload" : "wizard",
        idempotencyKey: crypto.randomUUID(),
        uploadIds: uploadIds.length > 0 ? uploadIds : undefined,
      });

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

      clearNewStrategyFlow();
      toast.success("Building your marketing strategy…");
      router.push(FUNNEL_ROUTE);
    } catch (error) {
      if (await redirectToExistingFunnelIfAny(router, "wizard")) {
        clearNewStrategyFlow();
        return;
      }
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not start strategy generation",
      );
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
            disabled={isLoading || isBootstrapping}
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
              onNext={handleStep1Next}
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
              onNext={handleStep2Next}
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
              isLoading={isLoading || isBootstrapping}
            />
          )}
        </div>
      </div>
    </div>
  );
}
