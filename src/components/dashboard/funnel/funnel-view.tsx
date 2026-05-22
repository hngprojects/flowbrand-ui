"use client";

import FunnelSidebar from "@/components/dashboard/funnel/funnel-sidebar";
import Loader from "@/components/ui/loader";
import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { beginNewStrategyFlow } from "@/lib/begin-new-strategy";
import { StrategyIcon } from "@/components/icons/strategy";
import OnboardingNavbar from "@/components/navigation/onboarding-navbar";
import { loadDashboardMockSession } from "@/lib/dashboard-mock-session";
import { funnelSidebarSummary } from "@/lib/funnel-display";
import { useStrategyFunnel } from "@/hooks/queries/use-strategy-funnel";
import { ONBOARDING_UPLOAD_ROUTE } from "@/routes";
import { cn } from "@/lib/utils";

export function FunnelView() {
  const router = useRouter();
  const session = useMemo(() => loadDashboardMockSession(), []);
  const {
    loading,
    loadingMessage,
    error,
    funnel,
    strategyPhases,
    focus,
    tasks,
    retry,
  } = useStrategyFunnel();

  const documents = session?.uploadedDocuments ?? [];

  const loadingSteps = useMemo(
    () => [
      <div key="step-1" className="flex flex-col gap-4">
        <h3 className="text-[16px] text-black-300">Information Provided</h3>
        {session?.businessDescription ? (
          <p className="text-[18px] text-gray-900 p-3">
            {session.businessDescription}
          </p>
        ) : null}
        {session?.idealCustomerSummary ? (
          <p className="text-[16px] text-black-300 px-3">
            Ideal customer: {session.idealCustomerSummary}
          </p>
        ) : null}
        {session?.trafficChannel ? (
          <p className="text-[16px] text-black-300 px-3">
            Main channel: {session.trafficChannel}
          </p>
        ) : null}
        <div className="mt-2 p-3">
          <p className="text-[16px] text-foreground">
            We are building a tailored marketing strategy for your business.
          </p>
        </div>
      </div>,
    ],
    [session],
  );

  const sidebarSteps = loadingSteps[0] ?? null;
  const strategySummary = funnelSidebarSummary(funnel);

  const handleCreateNewStrategy = useCallback(() => {
    router.push(beginNewStrategyFlow());
  }, [router]);

  if (error && !loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-default">
        <p className="max-w-md text-center text-sm text-destructive">{error}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button type="button" variant="outline" onClick={() => retry()}>
            Try again
          </Button>
          <Button
            type="button"
            onClick={() => router.push(ONBOARDING_UPLOAD_ROUTE)}
          >
            Back to onboarding
          </Button>
        </div>
      </main>
    );
  }

  return (
    <>
      <OnboardingNavbar
        steps={sidebarSteps}
        loading={loading}
        documents={documents}
        strategyPhases={strategyPhases}
        strategySummary={loading ? undefined : strategySummary}
        onCreateNewStrategy={loading ? undefined : handleCreateNewStrategy}
      />
      <div className="flex">
        <FunnelSidebar
          steps={sidebarSteps}
          loading={loading}
          documents={documents}
          strategyPhases={strategyPhases}
          strategySummary={strategySummary}
          onCreateNewStrategy={handleCreateNewStrategy}
        />
        <div className="w-full p-default md:w-2/3">
          {loading ? (
            <Loader className="h-screen w-full" text={loadingMessage} />
          ) : (
            <div className="flex w-full flex-col items-end space-y-large">
              {focus ? (
                <div className="w-full">
                  <div className="flex justify-between text-[16px] text-black-300">
                    <p>This week&apos;s focus</p>
                    <p>{focus.progress}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="flex items-center gap-[12px] text-[24px] text-foreground">
                      <StrategyIcon /> {focus.phase}
                    </p>
                    <p className="text-[14px] text-black-300 md:text-[16px]">
                      {focus.subtitle}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-full space-y-3 rounded-[18px] border border-gray-500 bg-white p-section">
                  <p className="text-sm text-black-300">
                    Your strategy was created, but stage details are still
                    loading. Wait a moment, then try again.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-fit"
                    onClick={() => retry()}
                  >
                    Refresh strategy
                  </Button>
                </div>
              )}

              <div className="w-full space-y-default">
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <div
                      key={task.id}
                      className="w-full space-y-2 rounded-[18px] border border-gray-500 bg-[#FFFFFF] p-section"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h2 className="text-lg font-medium">{task.title}</h2>
                        <span
                          className={cn(
                            "shrink-0 rounded-full px-2 py-0.5 text-xs capitalize",
                            task.status === "complete"
                              ? "bg-primary/10 text-primary"
                              : "bg-gray-100 text-black-300",
                          )}
                        >
                          {task.status ?? "pending"}
                        </span>
                      </div>
                      <p className="text-sm text-black-300">
                        {task.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="rounded-[18px] border border-gray-500 bg-white p-section text-sm text-black-300">
                    No tasks for the current stage yet. Try refreshing in a
                    moment.
                  </p>
                )}
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
