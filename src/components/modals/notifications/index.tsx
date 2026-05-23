"use client";

import { useState, useMemo } from "react";
import { X, CheckCheck, Trash2, PartyPopper } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import BaseModal from "@/components/modals/BaseModal";
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
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState<NotificationTab>("all");

  // Modal state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isAllReadModalOpen, setIsAllReadModalOpen] = useState(false);
  // Snapshot used to power "Undo" after marking all as read
  const [snapshot, setSnapshot] = useState<Notification[] | null>(null);

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

  // Delete: open confirm modal instead of deleting immediately
  const requestDelete = (id: string) => setDeleteTargetId(id);

  const confirmDelete = () => {
    if (deleteTargetId) {
      setNotifications((prev) => prev.filter((n) => n.id !== deleteTargetId));
    }
    setDeleteTargetId(null);
  };

  // Mark all read: snapshot first, then open success modal
  const handleMarkAllRead = () => {
    setSnapshot(notifications);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setIsAllReadModalOpen(true);
  };

  const undoMarkAllRead = () => {
    if (snapshot) setNotifications(snapshot);
    setSnapshot(null);
    setIsAllReadModalOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent
          showCloseButton={false}
          className="fixed lg:top-3 lg:right-4 top-0 right-0 left-auto h-screen w-full lg:w-1/2 lg:max-w-[720px] max-w-none translate-x-0 translate-y-0 rounded-none"
        >
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

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-3">
            <NotificationTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              unreadCount={unreadCount}
              readCount={readCount}
            />

            <button
              type="button"
              onClick={handleMarkAllRead}
              className="text-primary border-primary hover:bg-primary/5 flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors self-start sm:self-auto"
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
                  onDelete={requestDelete}
                />
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation modal */}
      <BaseModal
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        icon={<Trash2 className="text-primary h-12 w-12" />}
        title="Delete Notification"
        subtitle="Are you sure you want to delete this notification?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />

      {/* "All caught up" success modal */}
      <BaseModal
        isOpen={isAllReadModalOpen}
        onClose={() => setIsAllReadModalOpen(false)}
        icon={<PartyPopper className="text-primary h-12 w-12" />}
        title="You are all caught up"
        subtitle="All notifications are now read."
        confirmText="Done"
        cancelText="Undo"
        onConfirm={() => setIsAllReadModalOpen(false)}
        onCancel={undoMarkAllRead}
      />
    </>
  );
}
