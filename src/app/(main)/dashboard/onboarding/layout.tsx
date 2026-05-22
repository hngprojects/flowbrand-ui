import { DashboardOnboardingLayout } from "@/components/dashboard/onboarding/onboarding-layout";

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardOnboardingLayout>{children}</DashboardOnboardingLayout>;
}
