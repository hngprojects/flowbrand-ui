"use client";

import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  children?: React.ReactNode;
}

const BaseModal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  children,
}: BaseModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-black-500/60" />
      <DialogContent className="w-[85%] rounded-[32px] border-[0.5px] bg-[linear-gradient(116.82deg,#F4F8FF_0%,#E5EEFF_50%,#DFEAFF_100%)] p-10 md:w-[483px]">
        <VisuallyHidden>
          <DialogTitle>{title ?? "Modal"}</DialogTitle>
        </VisuallyHidden>

        {children ? (
          children
        ) : (
          <div className="flex flex-col items-center gap-6 text-center">
            {icon && (
              <div
                className="border-primary-100 bg-primary-50 flex items-center justify-center rounded-full border-[0.5px] p-10"
                style={{
                  width: "182px",
                  height: "182px",
                  boxShadow:
                    "0px 0px 0px 7px #326AD14D, 0px 0px 5.5px 0px #326AD1",
                }}
              >
                {icon}
              </div>
            )}

            {title && (
              <h2 className="text-black-500 text-[32px] font-medium leading-[120%]">
                {title}
              </h2>
            )}

            {subtitle && (
              <p className="text-black-300 text-sm leading-relaxed">
                {subtitle}
              </p>
            )}

            <div className="flex w-full flex-col gap-3">
              {onConfirm && confirmText && (
                <button
                  type="button"
                  onClick={onConfirm}
                  className="bg-primary text-primary-foreground h-12 w-full rounded-[10px] px-6 py-3 font-semibold transition-opacity hover:opacity-90"
                >
                  {confirmText}
                </button>
              )}
              {onCancel && cancelText && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="border-primary text-primary h-12 w-full rounded-[10px] border px-6 py-3 font-semibold transition-opacity hover:opacity-90"
                >
                  {cancelText}
                </button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BaseModal;
