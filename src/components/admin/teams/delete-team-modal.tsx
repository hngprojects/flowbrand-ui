"use client";

import { UserX } from "lucide-react";
import BaseModal from "@/components/modals/BaseModal";
import { Button } from "@/components/ui/button";
import type { TeamMember } from "@/types/admin";

interface DeleteTeamModalProps {
  member: TeamMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

/** Red "remove member" icon matching the Figma delete dialog. */
function DeleteMemberIcon() {
  return (
    <div className="flex size-[88px] items-center justify-center rounded-full border border-red-100 bg-red-25">
      <UserX className="size-10 text-red-500" strokeWidth={2} />
    </div>
  );
}

/**
 * Confirmation modal for removing a team member. Uses the shared `BaseModal`
 * shell (same navy overlay + white card + a11y as every other modal) with
 * custom content to match the Figma: red remove-member icon and a destructive
 * (soft red) confirm button.
 */
export function DeleteTeamModal({
  member,
  open,
  onOpenChange,
  onConfirm,
  isDeleting = false,
}: DeleteTeamModalProps) {
  const close = () => onOpenChange(false);

  return (
    <BaseModal isOpen={open} onClose={close} title="Delete team">
      <div className="flex flex-col items-center gap-6 text-center">
        <DeleteMemberIcon />

        <div className="flex flex-col gap-2">
          <h2 className="text-black-500 text-2xl leading-[120%] font-medium">
            Delete team
          </h2>
          <p className="text-black-300 text-sm md:text-base">
            {member
              ? `Are you sure you want to delete ${member.fullName}?`
              : "Are you sure you want to delete this team member?"}
          </p>
        </div>

        <div className="flex w-full flex-col gap-3">
          <Button
            variant="destructive"
            className="h-12 w-full rounded-[10px] font-semibold"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete team"}
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
