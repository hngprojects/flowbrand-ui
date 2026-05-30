"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import BaseModal from "@/components/modals/BaseModal";
import ModalTrashIcon from "@/components/icons/modals/trash";
import { deleteUserAccount } from "@/actions/user";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

interface DeleteAccountTabProps {
  onClose: () => void;
}

export default function DeleteAccountTab({ onClose }: DeleteAccountTabProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const isConfirmed = confirmText === "DELETE";

  const handleDelete = async () => {
    if (!isConfirmed) return;

    const result = await deleteUserAccount();

    if (!result.ok) {
      toast.error(
        result.error ?? "Could not delete account. Please try again.",
      );
      return;
    }

    toast.success("Account deleted successfully.");
    await signOut({ callbackUrl: "/" });
  };

  const consequences = [
    "Your account and profile information will be permanently deleted.",
    "All your funnels, saved data, and progress will be removed from the platform.",
    "You will be signed out and lose access to all features immediately.",
    "Any ongoing activities or drafts will be cancelled and cannot be recovered.",
  ];

  return (
    <>
      <div className="flex flex-col gap-6">
        <h3 className="text-[20px] font-medium text-black-300">
          Delete Account
        </h3>

        <div className="flex items-center gap-3 rounded-[12px] border border-red-500/30 bg-red-25 px-4 py-3">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
          <p className="text-base font-medium text-red-500">
            Note that this action cannot be undone. Your data, funnels, and
            progress will be permanently deleted.
          </p>
        </div>

        <h4 className="text-base font-medium text-primary-900">
          What will happen:
        </h4>
        <div className="flex flex-col gap-4 rounded-[12px] border border-gray-200 px-4 py-6">
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {consequences.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-primary-900"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center md:justify-end pt-2">
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="rounded-[10px] bg-red-600 px-10 py-3 text-sm md:text-base font-medium text-white
            hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete Account
          </button>
        </div>
      </div>

      <BaseModal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <div className="flex flex-col items-center gap-6 text-center">
          <div
            className="flex items-center justify-center rounded-full border border-red-500/20 bg-red-25"
            style={{
              width: "182px",
              height: "182px",
              boxShadow: "0px 0px 0px 7px #D1323226, 0px 0px 5.5px 0px #D13232",
            }}
          >
            <ModalTrashIcon />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-[32px] font-medium text-foreground leading-[120%]">
              Delete account
            </h2>
            <p className="text-sm text-black-300">
              Are you sure you want to delete your account?
            </p>
            <p className="text-sm text-black-300">
              Type &apos;DELETE&apos; to confirm:
            </p>
          </div>

          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
            className="w-full rounded-[8px] border border-gray-300 px-3 py-2.5 text-center text-sm text-foreground outline-none focus:border-red-500 transition-colors"
          />

          <div className="flex w-full flex-col gap-3">
            <button
              type="button"
              onClick={handleDelete}
              disabled={!isConfirmed}
              className="h-12 w-full rounded-[10px] bg-red-500 px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Delete Account
            </button>
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              className="h-12 w-full rounded-[10px] border border-gray-300 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </BaseModal>
    </>
  );
}
