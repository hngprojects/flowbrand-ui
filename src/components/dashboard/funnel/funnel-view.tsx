"use client";

import FunnelSidebar from "@/components/dashboard/funnel/funnel-sidebar";
import Loader from "@/components/ui/loader";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { StrategyIcon } from "@/components/icons/strategy";
import { LinkIcon } from "@/components/icons/link";
import OnboardingNavbar from "@/components/navigation/onboarding-navbar";
import { showFunnelPreviewToast } from "@/lib/funnel-preview-toast";
import { getDashboardMockSessionOrDefaults } from "@/lib/dashboard-mock-session";
import {
  DUMMY_FUNNEL_FOCUS,
  DUMMY_FUNNEL_TASKS,
  DUMMY_STRATEGY_PHASES,
} from "@/lib/dashboard-mock-data";

const LOADING_MS = 4500;

export function FunnelView() {
  const [session] = useState(() => getDashboardMockSessionOrDefaults());
  const [loading, setLoading] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    showFunnelPreviewToast();
  }, []);

  const loadingSteps = useMemo(
    () => [
      <div key="step-1" className="flex flex-col gap-4">
        <h3 className="text-[16px] text-black-300">Information Provided</h3>
        <p className="text-[18px] text-gray-900 p-3">
          {session.businessDescription}
        </p>
        <p className="text-[16px] text-black-300 px-3">
          Ideal customer: {session.idealCustomerSummary}
        </p>
        <p className="text-[16px] text-black-300 px-3">
          Main channel: {session.trafficChannel}
        </p>
        <div className="mt-2 p-3">
          <p className="text-[16px] text-foreground">
            We have created a tailored marketing strategy for your unique use
            case and problem.
          </p>
        </div>
      </div>,
    ],
    [session],
  );

  const sidebarSteps = loadingSteps[stepIndex] ?? loadingSteps[0] ?? null;

  useEffect(() => {
    let currentStep = 0;

    const stepInterval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        setStepIndex(currentStep);
        currentStep++;
      }
    }, 2000);

    const timer = setTimeout(() => {
      clearInterval(stepInterval);
      setLoading(false);
    }, LOADING_MS);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(timer);
    };
  }, [loadingSteps.length]);

  return (
    <>
      <OnboardingNavbar
        steps={sidebarSteps}
        loading={loading}
        documents={session.uploadedDocuments}
        strategyPhases={DUMMY_STRATEGY_PHASES}
      />
      <div className="flex">
        <FunnelSidebar
          steps={sidebarSteps}
          loading={loading}
          documents={session.uploadedDocuments}
          strategyPhases={DUMMY_STRATEGY_PHASES}
        />
        <div className="w-full p-default md:w-2/3">
          {loading ? (
            <Loader
              className="h-screen w-full"
              text="Building your marketing strategy..."
            />
          ) : (
            <div className="flex w-full flex-col items-end space-y-large">
              <div className="w-full">
                <div className="flex justify-between text-[16px] text-black-300">
                  <p>This week&apos;s focus</p>
                  <p>{DUMMY_FUNNEL_FOCUS.progress}</p>
                </div>
                <div className="space-y-1">
                  <p className="flex items-center gap-[12px] text-[24px] text-foreground">
                    <StrategyIcon /> {DUMMY_FUNNEL_FOCUS.phase}
                  </p>
                  <p className="text-[14px] text-black-300 md:text-[16px]">
                    {DUMMY_FUNNEL_FOCUS.subtitle}
                  </p>
                </div>
              </div>

              <div className="w-full space-y-default">
                {DUMMY_FUNNEL_TASKS.map((task) => (
                  <div
                    key={task.id}
                    className="w-full space-y-2 rounded-[18px] border border-gray-500 bg-[#FFFFFF] p-section"
                  >
                    <div className="flex items-center justify-between">
                      <h2>{task.title}</h2>
                      <input
                        type="checkbox"
                        aria-label={`Mark ${task.title} complete`}
                      />
                    </div>
                    <div className="space-y-3 text-sm text-black-300">
                      <p>{task.description}</p>
                      {task.resources.length > 0 && (
                        <div>
                          <p className="text-[14px] capitalize text-black-300">
                            More Resources
                          </p>
                          <div className="mt-2 flex flex-col gap-2">
                            {task.resources.map((resource) => (
                              <div
                                key={resource.label}
                                className="flex items-center gap-[4px]"
                              >
                                <LinkIcon />
                                <p className="text-sm text-primary">
                                  {resource.label}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Button className="w-[310px] rounded-[10px] bg-primary-100">
                Submit
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
