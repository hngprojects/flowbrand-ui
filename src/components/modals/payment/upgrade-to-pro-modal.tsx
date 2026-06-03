"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { BadgeCheck } from "lucide-react";
import { CancelAnytimeWalletIcon } from "@/components/icons/payment/cancel-anytime-wallet-icon";
import { SecureLockIcon } from "@/components/icons/payment/secure-lock-icon";
import { NoHiddenFeesIcon } from "@/components/icons/payment/no-hidden-fees-icon";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { PaymentModalClose } from "@/components/modals/payment/payment-modal-close";
import type { BillingCycle } from "@/components/modals/payment/payment-types";

const FREE_FEATURES = [
  "Intake Wizard",
  "Personalized Templates",
  "Built-In Checklist",
  "Save & Track your progress",
];

const PRO_FEATURES = [
  "Everything in free",
  "Multiple marketing plans",
  "Advanced stages",
  "Follow up templates & Prompts",
];

type UpgradeToProModalProps = {
  isOpen: boolean;
  onClose: () => void;
  billingCycle: BillingCycle;
  onBillingCycleChange: (cycle: BillingCycle) => void;
  onGetFullAccess: () => void;
  onSimSuccess: () => void;
  onSimFailed: () => void;
};

export function UpgradeToProModal({
  isOpen,
  onClose,
  billingCycle,
  onBillingCycleChange,
  onGetFullAccess,
  onSimSuccess,
  onSimFailed,
}: UpgradeToProModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "fixed inset-0 z-50 flex h-screen w-screen max-w-none flex-col overflow-hidden border-0 bg-white p-8 shadow-2xl translate-x-0 translate-y-0 left-0 top-0",
          "md:left-auto md:right-5 md:top-5 md:bottom-5 md:h-auto md:w-[50vw] md:max-w-[50vw] md:rounded-[24px] md:border md:border-gray-500 min-w-[320px] md:min-w-120",
        )}
        overlayClassName="bg-black-500/80"
      >
        <VisuallyHidden>
          <DialogTitle>Upgrade to Pro</DialogTitle>
        </VisuallyHidden>

        <div className="mx-[-32px] mb-6 flex shrink-0 items-center justify-between gap-4 border-b-[0.35px] border-gray-500 px-8 pb-4">
          <p className="text-[14px] font-[500] tracking-wide text-primary-800">
            UPGRADE TO PRO
          </p>
          <PaymentModalClose onClose={onClose} />
        </div>

        <div className="scrollbar-none flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto">
          <h2 className="text-center font-[500] text-[20px] md:text-[24px] leading-[120%] text-black-500">
            You have seen what Seil can do, now let&apos;s go further
          </h2>

          <div className="mx-auto flex rounded-md border border-gray-500 bg-gray-100 p-0.5">
            {(["monthly", "annual"] as const).map((cycle) => (
              <button
                key={cycle}
                type="button"
                onClick={() => onBillingCycleChange(cycle)}
                className={cn(
                  "rounded-md px-4 py-2 text-sm transition-colors",
                  billingCycle === cycle
                    ? "bg-primary-500 text-white"
                    : "text-black",
                )}
              >
                {cycle === "monthly" ? "Monthly Pricing" : "Annual Pricing"}
              </button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 md:bg-gray-50 md:p-8 md:rounded-xl">
            <PlanCard
              title="Free Plan"
              description="Perfect for one-person shops or small businesses"
              price="free"
              priceClassName="text-primary-500"
              features={FREE_FEATURES}
              ctaLabel="Continue For Free"
              ctaVariant="outline"
              onCta={onClose}
            />
            <PlanCard
              title="Pro Plan"
              description="For businesses ready to grow further and faster."
              price={
                billingCycle === "monthly"
                  ? "₦10,000/monthly"
                  : "₦100,000/yearly"
              }
              priceClassName="text-accent-700"
              features={PRO_FEATURES}
              ctaLabel="Get Full Access"
              ctaVariant="primary"
              recommended
              onCta={onGetFullAccess}
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-xs text-black-300 sm:gap-8">
            <span className="inline-flex items-center gap-2">
              <CancelAnytimeWalletIcon className="size-9 shrink-0" />
              Cancel anytime.
            </span>
            <span className="inline-flex items-center gap-2">
              <SecureLockIcon className="size-9 shrink-0" />
              Secure and reliable.
            </span>
            <span className="inline-flex items-center gap-2">
              <NoHiddenFeesIcon className="size-9 shrink-0" />
              No hidden fees.
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 pt-4">
            <span className="text-xs font-medium text-neutral-400">sim:</span>
            <button
              type="button"
              onClick={onSimSuccess}
              className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
            >
              success
            </button>
            <button
              type="button"
              onClick={onSimFailed}
              className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
            >
              failed
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PlanCard({
  title,
  description,
  price,
  priceClassName,
  features,
  ctaLabel,
  ctaVariant,
  recommended,
  onCta,
}: {
  title: string;
  description: string;
  price: string;
  priceClassName: string;
  features: string[];
  ctaLabel: string;
  ctaVariant: "primary" | "outline";
  recommended?: boolean;
  onCta: () => void;
}) {
  return (
    <div className="relative flex flex-col rounded-2xl border border-neutral-200 bg-white p-6">
      {recommended ? (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary-500 px-3 py-0.5 text-xs font-semibold text-white">
          Recommended
        </span>
      ) : null}
      <h3 className="text-lg font-bold text-black-500">{title}</h3>
      <p className="mt-1 text-sm text-black-300">{description}</p>
      <p className={cn("mt-4 text-lg font-bold", priceClassName)}>{price}</p>
      <ul className="my-5 flex-1 space-y-2.5">
        {features.map((item) => (
          <li
            key={item}
            className="flex items-center gap-2 text-sm text-black-500"
          >
            <BadgeCheck
              className="size-4 shrink-0 text-primary-500"
              aria-hidden
            />
            {item}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onCta}
        className={cn(
          "h-11 w-full rounded-[10px] text-sm font-semibold transition-opacity hover:opacity-90",
          ctaVariant === "primary"
            ? "bg-primary-500 text-white"
            : "border border-primary-500 bg-white text-primary-500",
        )}
      >
        {ctaLabel}
      </button>
    </div>
  );
}
