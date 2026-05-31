"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from "@/actions/user";

interface NotificationSetting {
  id: string;
  label: string;
  apiKey: string;
  enabled: boolean;
}

const DEFAULT_SETTINGS: NotificationSetting[] = [
  {
    id: "emailFunnelReady",
    label: "Email when funnel is ready",
    apiKey: "email_funnel_ready",
    enabled: true,
  },
  {
    id: "emailStageUnlocked",
    label: "Email when stage is unlocked",
    apiKey: "email_stage_unlocked",
    enabled: true,
  },
  {
    id: "emailStageCompleted",
    label: "Email when stage is completed",
    apiKey: "email_stage_completed",
    enabled: false,
  },
  {
    id: "emailWeeklyDigest",
    label: "Weekly digest email",
    apiKey: "email_weekly_digest",
    enabled: true,
  },
  {
    id: "inappTaskCompleted",
    label: "In-app notification when task is completed",
    apiKey: "inapp_task_completed",
    enabled: true,
  },
  {
    id: "inappStageUnlocked",
    label: "In-app notification when stage is unlocked",
    apiKey: "inapp_stage_unlocked",
    enabled: true,
  },
];

export default function NotificationPreferencesTab() {
  const [notifications, setNotifications] =
    useState<NotificationSetting[]>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const result = await getNotificationPreferences();
      if (!result.ok) {
        setIsLoading(false);
        return;
      }
      const data = result.data;
      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          enabled: (data[n.id as keyof typeof data] as boolean) ?? n.enabled,
        })),
      );
      setIsLoading(false);
    };
    void load();
  }, []);

  const toggle = async (id: string) => {
    if (savingId) return;

    const setting = notifications.find((n) => n.id === id);
    if (!setting) return;

    const newEnabled = !setting.enabled;

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: newEnabled } : n)),
    );

    setSavingId(id);
    const result = await updateNotificationPreferences({
      [setting.apiKey]: newEnabled,
    });

    if (!result.ok) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, enabled: !newEnabled } : n)),
      );
      toast.error(result.error ?? "Failed to update notification preference.");
    }

    setSavingId(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-[20px] font-medium text-black-300">Notifications</h3>

      <div className="flex flex-col rounded-[12px] border border-gray-200">
        {notifications.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between px-5 py-4"
          >
            <span className="text-base text-[#1A1A1A]">{item.label}</span>
            <button
              type="button"
              role="switch"
              aria-checked={item.enabled}
              aria-label={item.label}
              disabled={isLoading || savingId === item.id}
              onClick={() => toggle(item.id)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
                ${item.enabled ? "bg-primary" : "bg-gray-200"}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                  item.enabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
