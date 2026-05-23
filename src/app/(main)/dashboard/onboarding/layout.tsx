import { Suspense } from "react";
import { DashboardOnboardingLayout } from "@/components/dashboard/onboarding/onboarding-layout";
import { OnboardingAccessGuard } from "@/components/dashboard/onboarding/onboarding-access-guard";

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardOnboardingLayout>
      <Suspense
        fallback={
          <div className="flex flex-1 items-center justify-center py-24">
            Loading...
          </div>
        }
      >
        <OnboardingAccessGuard>{children}</OnboardingAccessGuard>
      </Suspense>
    </DashboardOnboardingLayout>
  );
}
