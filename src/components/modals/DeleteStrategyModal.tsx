"use client";

import BaseModal from "@/components/modals/BaseModal";
import ModalTrashIcon from "@/components/icons/modals/trash";

interface DeleteStrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
}

export function DeleteStrategyModal({
  isOpen,
  onClose,
  onConfirm,
  isPending = false,
}: DeleteStrategyModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      icon={<ModalTrashIcon />}
      title="Delete strategy"
      subtitle="Are you sure you want to delete this marketing strategy?"
      confirmText={isPending ? "Deleting..." : "Delete strategy"}
      cancelText="Cancel"
      onConfirm={isPending ? undefined : onConfirm}
      onCancel={onClose}
    />
  );
}
