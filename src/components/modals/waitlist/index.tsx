"use client";

import { useState } from "react";
import BaseModal from "@/components/modals/BaseModal";
import ModalSuccessIcon from "@/components/icons/modals/success";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WaitlistModal = ({ isOpen, onClose }: WaitlistModalProps) => {
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "error">(
    "idle",
  );

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Seil",
          text: "Join the Seil waitlist!",
          url: window.location.href,
        });
      } else {
        if (!navigator.clipboard) {
          setShareStatus("error");
          return;
        }
        await navigator.clipboard.writeText(window.location.href);
        setShareStatus("copied");

        setTimeout(() => setShareStatus("idle"), 2500);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error("Share failed:", error);
      setShareStatus("error");
      setTimeout(() => setShareStatus("idle"), 2500);
    }
  };

  const cancelLabel =
    shareStatus === "copied"
      ? "Link Copied!"
      : shareStatus === "error"
        ? "Could not share — try again"
        : "Share with Friends";

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      icon={<ModalSuccessIcon />}
      title="Yippee! You are in"
      subtitle="We have saved your spot, you will be informed once we are live. Know someone who is interested, share with them."
      confirmText="Done"
      cancelText={cancelLabel}
      onConfirm={onClose}
      onCancel={handleShare}
    />
  );
};

export default WaitlistModal;
