"use client";

import { UserX } from "lucide-react";
import BaseModal from "@/components/modals/BaseModal";
import { Button } from "@/components/ui/button";

interface DeleteMemberModalProps {
  memberName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeleteMemberModal({
  memberName,
  open,
  onOpenChange,
  onConfirm,
  isDeleting = false,
}: DeleteMemberModalProps) {
  const close = () => onOpenChange(false);

  return (
    <BaseModal isOpen={open} onClose={close} title="Delete team member">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex size-[88px] items-center justify-center rounded-full border border-red-100 bg-red-25">
          <UserX className="size-10 text-red-500" strokeWidth={1.8} />
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-medium leading-[120%] text-black-500">
            Delete team
          </h2>
          <p className="text-sm text-black-300 md:text-base">
            {memberName
              ? `Are you sure you want to delete ${memberName}? Their admin account will be removed.`
              : "Are you sure you want to delete this team member?"}
          </p>
        </div>

        <div className="flex w-full flex-col gap-3">
          <Button
            variant="destructive"
            className="h-12 w-full rounded-[10px] border border-red-200 bg-red-50 font-semibold text-red-500 hover:bg-red-100"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting…" : "Delete team"}
          </Button>
          <Button
            variant="outline"
            className="h-12 w-full rounded-[10px] font-semibold"
            onClick={close}
            disabled={isDeleting}
          >
            Cancel
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
