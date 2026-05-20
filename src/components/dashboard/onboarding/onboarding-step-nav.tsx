"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ONBOARDING_QUESTIONS_ROUTE, ONBOARDING_UPLOAD_ROUTE } from "@/routes";

const steps = [
  { label: "Upload documents", href: ONBOARDING_UPLOAD_ROUTE },
  { label: "Answer questions", href: ONBOARDING_QUESTIONS_ROUTE },
] as const;

export function OnboardingStepNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Onboarding steps"
      className="border-b border-gray-200/80 bg-white/60 backdrop-blur-sm"
    >
      <div className="layout-components-class flex gap-1 py-3">
        {steps.map((step) => {
          const active = pathname.startsWith(step.href);
          return (
            <Link
              key={step.href}
              href={step.href}
              className={[
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-[#2D4EAB] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              ].join(" ")}
            >
              {step.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
