import OnboardingNavbar from "@/components/navigation/onboarding-navbar";
import { MeshBackground } from "@/components/dashboard/mesh-background";

export function DashboardOnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <MeshBackground fullViewport />
      <div className="relative z-10 flex min-h-screen w-full flex-col">
        <OnboardingNavbar />
        <div className="flex flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}
