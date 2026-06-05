"use client";

import BaseModal from "@/components/modals/BaseModal";
import ModalTrashIcon from "@/components/icons/modals/trash";

interface DeleteNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isBulk?: boolean;
  count?: number;
  isLoading?: boolean;
}

export default function DeleteNotificationModal({
  isOpen,
  onClose,
  onConfirm,
  isBulk = false,
  count = 1,
  isLoading = false,
}: DeleteNotificationModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center gap-6 text-center">
        <div
          className="flex items-center justify-center rounded-full border border-red-500/20 bg-red-25"
          style={{
            width: "120px",
            height: "120px",
            boxShadow: "0px 0px 0px 7px #D1323226, 0px 0px 5.5px 0px #D13232",
          }}
        >
          <ModalTrashIcon />
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-[24px] font-medium text-foreground leading-[120%]">
            Delete {isBulk ? `${count} notifications` : "notification"}
          </h2>
          <p className="text-sm text-black-300">
            {isBulk
              ? `Are you sure you want to delete ${count} selected notifications? This cannot be undone.`
              : "Are you sure you want to delete this notification? This cannot be undone."}
          </p>
        </div>

        <div className="flex w-full flex-col gap-3">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="h-12 w-full rounded-[10px] bg-red-500 px-6 py-3 text-sm font-semibold 
            text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="h-12 w-full rounded-[10px] border border-gray-300 px-6 py-3 text-sm 
            font-semibold text-foreground transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
