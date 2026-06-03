"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { PaymentModalClose } from "@/components/modals/payment/payment-modal-close";
import { PaymentDetailsBox } from "@/components/modals/payment/payment-details-box";
import type { PaymentDetails } from "@/components/modals/payment/payment-types";

type PaymentFailedModalProps = {
  isOpen: boolean;
  onClose: () => void;
  details: PaymentDetails;
  onTryAgain: () => void;
  onChooseAnotherMethod: () => void;
};

export function PaymentFailedModal({
  isOpen,
  onClose,
  details,
  onTryAgain,
  onChooseAnotherMethod,
}: PaymentFailedModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100%-1.5rem)] rounded-[24px] border border-primary-80 bg-white p-6 sm:max-w-[480px] sm:p-8"
        overlayClassName="bg-[#030D1F]/80"
      >
        <VisuallyHidden>
          <DialogTitle>Payment Failed</DialogTitle>
        </VisuallyHidden>

        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex w-full justify-end">
            <PaymentModalClose onClose={onClose} />
          </div>

          <div
            className="flex size-[140px] items-center justify-center rounded-full border border-red-200 bg-red-50"
            style={{
              boxShadow:
                "0 0 0 7px rgba(239,68,68,0.15), 0 0 5.5px rgba(239,68,68,0.35)",
            }}
          >
            <span className="flex size-[72px] items-center justify-center rounded-full bg-red-500">
              <X className="size-10 text-white stroke-[3]" aria-hidden />
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-[28px] font-medium leading-tight text-black-500 sm:text-[32px]">
              Payment Failed
            </h2>
            <p className="max-w-sm text-sm font-medium text-black-300">
              We couldn&apos;t complete your payment. Please check your details
              and try again.
            </p>
          </div>

          <PaymentDetailsBox details={details} />

          <div className="flex w-full flex-col gap-2.5">
            <button
              type="button"
              onClick={onTryAgain}
              className="h-12 w-full rounded-[10px] bg-primary-500 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Try Again
            </button>
            <button
              type="button"
              onClick={onChooseAnotherMethod}
              className="h-12 w-full rounded-[10px] border border-primary-500 bg-white text-sm font-semibold text-primary-500 transition-colors hover:bg-primary-50"
            >
              Choose Another Payment Method
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
