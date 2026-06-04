"use client";

import BaseModal from "@/components/modals/BaseModal";
import ModalTrashIcon from "@/components/icons/modals/trash";

interface DeleteUserModalProps {
  isOpen: boolean;
  userName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteUserModal({
  isOpen,
  userName,
  onClose,
  onConfirm,
}: DeleteUserModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      icon={<ModalTrashIcon />}
      title="Delete user"
      subtitle={`Are you sure you want to delete ${userName || "this user"}? This action cannot be undone.`}
      confirmText="Delete user"
      cancelText="Cancel"
      onConfirm={onConfirm}
      onCancel={onClose}
    />
  );
}
