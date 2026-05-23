"use client";

import { useState, useMemo } from "react";
import { X, CheckCheck } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import NotificationTabs, { type NotificationTab } from "./notification-tabs";
import NotificationItem from "./notification-item";
import { mockNotifications } from "./mock-data";
import type { Notification } from "@/types/notification";

type NotificationsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function NotificationsModal({
  isOpen,
  onClose,
}: NotificationsModalProps) {
  // Phase 1: state held locally; in later phases this moves to a hook + API
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState<NotificationTab>("all");

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications],
  );
  const readCount = useMemo(
    () => notifications.filter((n) => n.isRead).length,
    [notifications],
  );

  const filteredNotifications = useMemo(() => {
    if (activeTab === "unread") return notifications.filter((n) => !n.isRead);
    if (activeTab === "read") return notifications.filter((n) => n.isRead);
    return notifications;
  }, [notifications, activeTab]);

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const handleDelete = (id: string) => {
    // Phase 4 will replace this with a confirmation modal
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAllRead = () => {
    // Phase 5 will trigger the "All caught up" success modal instead
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[600px] gap-0 p-0 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <DialogTitle className="text-foreground text-lg font-semibold">
            Notifications
          </DialogTitle>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors"
          >
            <X className="h-4 w-4" />
            Close
          </button>
        </div>

        <div className="flex items-center justify-between gap-3 px-6 py-3">
          <NotificationTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            unreadCount={unreadCount}
            readCount={readCount}
          />
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="text-primary border-primary hover:bg-primary/5 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="text-muted-foreground flex flex-col items-center justify-center px-6 py-12 text-center">
              <p className="text-sm">No notifications to show</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkRead={handleMarkRead}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
