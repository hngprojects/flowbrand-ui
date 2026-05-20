import OnboardingNavbar from "@/components/navigation/onboarding-navbar";
import { PatternMesh } from "@/components/icons/patternSvg";

export function DashboardOnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-[#FCFCFD] to-[#F3F4F6]"
        aria-hidden
      />
      <PatternMesh
        className="pointer-events-none absolute inset-0 h-full w-full object-cover text-[#E8EAED] opacity-80"
        aria-hidden
      />
      <div className="relative z-10 flex min-h-screen flex-col">
        <OnboardingNavbar />
        <div className="flex flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}
