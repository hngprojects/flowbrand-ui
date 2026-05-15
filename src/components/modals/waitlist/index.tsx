"use client";

import BaseModal from "@/components/modals/BaseModal";
import ModalSuccessIcon from "@/components/icons/modals/success";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WaitlistModal = ({ isOpen, onClose }: WaitlistModalProps) => {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Seil",
          text: "Join the Seil waitlist!",
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      icon={<ModalSuccessIcon />}
      title="Yippee! You are in"
      subtitle="We have saved your spot, you will be informed once we are live. Know someone who is interested, share with them."
      confirmText="Done"
      cancelText="Share with Friends"
      onConfirm={onClose}
      onCancel={handleShare}
    />
  );
};

export default WaitlistModal;
