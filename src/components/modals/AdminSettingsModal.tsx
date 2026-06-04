"use client";

import { useState } from "react";
import FunnelModal from "@/components/modals/FunnelModal";
import AdminProfileTab from "@/components/admin/settings/AdminProfileTab";
import AdminPasswordSecurityTab from "@/components/admin/settings/AdminPasswordSecurityTab";
import AdminNotificationPreferencesTab from "@/components/admin/settings/AdminNotificationPreferencesTab";

interface AdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSettingsModal({
  isOpen,
  onClose,
}: AdminSettingsModalProps) {
  return (
    <FunnelModal
      isOpen={isOpen}
      onClose={onClose}
      defaultTab="profile"
      title="Settings"
      variant="center"
      tabs={[
        {
          id: "profile",
          label: "My Profile",
          content: <AdminProfileTab onClose={onClose} />,
        },
        {
          id: "password",
          label: "Password & Security",
          content: <AdminPasswordSecurityTab />,
        },
        {
          id: "notifications",
          label: "Notification Preferences",
          content: <AdminNotificationPreferencesTab />,
        },
      ]}
    />
  );
}
