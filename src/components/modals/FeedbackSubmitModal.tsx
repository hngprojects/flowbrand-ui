"use client";

import { useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { FeedbackSubmitIcon } from "@/components/ui/icons/feedback-submit-icon";

export function FeedbackSubmitModal({
  open,
  submitting,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  submitting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}) {
  const [confirming, setConfirming] = useState(false);
  const busy = submitting || confirming;

  const handleConfirm = async () => {
    if (busy) return;
    setConfirming(true);
    try {
      await onConfirm();
    } finally {
      setConfirming(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (busy && !nextOpen) return;
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="w-[85%] rounded-[24px] border border-primary-80 bg-white p-5 sm:max-w-[480px] sm:p-7"
        overlayClassName="bg-[#030D1F]/80"
        onEscapeKeyDown={(event) => {
          if (!busy) return;
          event.preventDefault();
        }}
        onPointerDownOutside={(event) => {
          if (!busy) return;
          event.preventDefault();
        }}
      >
        <VisuallyHidden>
          <DialogTitle>Submit feedback confirmation</DialogTitle>
        </VisuallyHidden>

        <div className="flex flex-col items-center text-center">
          <div
            className="mb-4 flex h-[140px] w-[140px] items-center justify-center rounded-full border border-[#BFD1F1] bg-[#EBF0FA]"
            style={{
              boxShadow:
                "0 0 0 7px rgba(50,106,209,0.3), 0 0 5.5px rgba(50,106,209,1)",
            }}
          >
            <FeedbackSubmitIcon
              aria-hidden="true"
              className="h-[78px] w-[78px]"
            />
          </div>
          <h3 className="text-[34px] font-medium leading-[1.1] text-neutral-900">
            Submit feedback
          </h3>
          <DialogDescription className="mt-2 max-w-[365px] text-sm font-bold leading-5 text-neutral-500">
            Are you sure you want to submit your feedback to the marketing
            strategy you just completed?
          </DialogDescription>

          <div className="mt-5 w-full space-y-2">
            <button
              type="button"
              onClick={() => void handleConfirm()}
              disabled={busy}
              className={cn(
                "h-12 w-full cursor-pointer rounded-[10px] text-sm font-semibold transition-colors",
                busy
                  ? "cursor-not-allowed bg-primary-150 text-neutral-900"
                  : "cursor-pointer bg-primary text-white hover:bg-primary-500",
              )}
            >
              {busy ? "Submitting..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={busy}
              className="h-12 w-full cursor-pointer rounded-[10px] border border-primary bg-white 
              text-sm font-medium text-primary-500 transition-colors 
              hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Cancel
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
