"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import MyProfileTab from "./tabs/MyProfileTab";
import PasswordSecurityTab from "./tabs/PasswordSecurityTab";
import NotificationPreferencesTab from "./tabs/NotificationsPrefrencesTab";
import DeleteAccountTab from "./tabs/DeleteAccountTab";

type Tab = "profile" | "password" | "notifications" | "delete";

const tabs: { id: Tab; label: string }[] = [
  { id: "profile", label: "My Profile" },
  { id: "password", label: "Password & Security" },
  { id: "notifications", label: "Notification Preferences" },
  { id: "delete", label: "Delete Account" },
];

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="
          fixed
          inset-0
          z-50
          flex
          flex-col
          w-screen
          h-screen
          max-w-none
          bg-white
          border-0
          shadow-2xl
          p-8
          overflow-hidden
          translate-x-0
          translate-y-0
          left-0
          top-0
          md:left-auto
          md:right-5
          md:top-5
          md:bottom-5
          md:w-[50vw]
          md:max-w-[50vw]
          md:h-auto
          md:rounded-[24px]
          md:border
          md:border-[#E4E4E4]
        "
            overlayClassName="bg-[#030D1F]/80"
      >
        <VisuallyHidden>
          <DialogTitle>Settings</DialogTitle>
        </VisuallyHidden>

        <div className="flex items-center justify-between mb-6 shrink-0 border-b-3 border-[#E4E4E4] pb-4 mx-[-32px] px-8">
          <h2 className="text-[18px] font-medium text-foreground">Settings</h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="flex items-center gap-[7.08px] rounded-[25.47px] border-[0.35px] border-[#E4E4E4] px-[15px] py-[7.08px] text-sm text-[#030D1F] transition-colors pointer-events-auto hover:bg-gray-50 cursor-pointer"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="10"
                cy="10"
                r="9"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M7 7L13 13M13 7L7 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-base">Close</span>
          </button>
        </div>

        <div
          className="flex items-center w-full h-[38px] gap-[10px] mb-6 shrink-0 overflow-x-auto rounded-[12px] border border-[#E4E4E4] px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`h-full rounded-[10px] font-medium transition-all duration-200 whitespace-nowrap px-4 text-center text-[16px] leading-[150%] ${
                activeTab === tab.id
                  ? "bg-[#326AD1] text-white"
                  : "text-[#565D69]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          className="flex-1 overflow-y-auto min-h-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {activeTab === "profile" && <MyProfileTab onClose={onClose} />}
          {activeTab === "password" && <PasswordSecurityTab />}
          {activeTab === "notifications" && <NotificationPreferencesTab />}
          {activeTab === "delete" && <DeleteAccountTab onClose={onClose} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
