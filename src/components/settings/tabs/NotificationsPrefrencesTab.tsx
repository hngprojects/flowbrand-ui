"use client";

import { useState } from "react";

interface NotificationSetting {
  id: string;
  label: string;
  enabled: boolean;
}

export default function NotificationPreferencesTab() {
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    { id: "general", label: "General notification", enabled: true },
    { id: "push_email", label: "Push Email", enabled: false },
  ]);

  const toggle = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n)),
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-xl font-medium text-black-300 ">Notifications</h3>

      <div className="flex flex-col  rounded-[12px] border border-gray-200">
        {notifications.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between px-5 py-4"
          >
            <span className="text-base  text-gray-deep">{item.label}</span>
            <button
              type="button"
              role="switch"
              aria-checked={item.enabled}
              aria-label={item.label}
              onClick={() => toggle(item.id)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus-visible:outline-none
                 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                   item.enabled ? "bg-primary" : "bg-gray-200"
                 }`}
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
