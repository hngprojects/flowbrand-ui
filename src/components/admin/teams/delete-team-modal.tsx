"use client";

import { UserX } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TeamMember } from "@/types/admin";

interface DeleteTeamModalProps {
  member: TeamMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

/**
 * Confirmation modal for removing a team member. Matches the Figma "Delete
 * team" dialog: centred icon, title, supporting copy, destructive confirm,
 * outline cancel.
 */
export function DeleteTeamModal({
  member,
  open,
  onOpenChange,
  onConfirm,
  isDeleting = false,
}: DeleteTeamModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-sm gap-5 rounded-3xl text-center"
      >
        <div className="flex flex-col items-center gap-4">
          <span className="flex size-14 items-center justify-center rounded-full bg-red-50">
            <span className="flex size-9 items-center justify-center rounded-full bg-red-500 text-white">
              <UserX className="size-5" />
            </span>
          </span>
          <div className="flex flex-col gap-1.5">
            <DialogTitle className="text-lg font-semibold">
              Delete team
            </DialogTitle>
            <DialogDescription className="text-sm text-neutral-500">
              Are you sure you want to delete this team member?
              {member ? ` (${member.fullName})` : ""}
            </DialogDescription>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            variant="destructive"
            className={cn("h-11 w-full rounded-xl")}
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting…" : "Delete team"}
          </Button>
          <Button
            variant="outline"
            className="h-11 w-full rounded-xl"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
