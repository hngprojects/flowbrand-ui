"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";

interface RenameStrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
  currentName?: string;
  isPending?: boolean;
}

export function RenameStrategyModal({
  isOpen,
  onClose,
  onConfirm,
  currentName = "",
  isPending = false,
}: RenameStrategyModalProps) {
  const [value, setValue] = useState(currentName);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync name when modal opens
  useEffect(() => {
    if (isOpen) {
      setValue(currentName);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen, currentName]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || isPending) return;
    onConfirm(trimmed);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-[85%] rounded-[32px] border-[0.5px] bg-white p-10 md:w-[483px]"
        overlayClassName="bg-[#030D1F]/80"
      >
        <VisuallyHidden>
          <DialogTitle>Rename strategy</DialogTitle>
        </VisuallyHidden>

        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-1">
            <h2 className="text-[24px] font-medium leading-[120%] text-black-500">
              Rename strategy
            </h2>
            <p className="text-sm text-black-300">
              Rename your strategy, to easily identify it.
            </p>
          </div>

          {/* Input */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="strategy-name"
              className="text-sm font-medium text-neutral-900"
            >
              Strategy Name
            </label>
            <input
              ref={inputRef}
              id="strategy-name"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
                if (e.key === "Escape") onClose();
              }}
              placeholder="Enter the strategy name"
              className="h-12 w-full rounded-[10px] border border-neutral-200 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              type="button"
              disabled={!value.trim() || isPending}
              onClick={handleSubmit}
              className={cn(
                "h-12 w-full rounded-[10px] px-6 py-3 text-base font-semibold transition-opacity",
                value.trim() && !isPending
                  ? "bg-primary text-primary-foreground hover:opacity-90 cursor-pointer"
                  : "cursor-not-allowed bg-primary-150 text-neutral-400",
              )}
            >
              {isPending ? "Saving..." : "Save changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="border-primary text-primary h-12 w-full rounded-[10px] border px-6 py-3 text-base font-semibold transition-opacity hover:opacity-90"
            >
              Cancel
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}