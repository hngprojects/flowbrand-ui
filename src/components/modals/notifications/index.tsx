"use client";

import { useState } from "react";
import { X, CheckCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import BaseModal from "@/components/modals/BaseModal";
import NotificationTabs, { type NotificationTab } from "./notification-tabs";
import NotificationItem from "./notification-item";
import { PartyIcon } from "@/components/icons/modals/partyIcon";
import { TrashIcon } from "@/components/icons/modals/trashIcon";
import { cn } from "@/lib/utils";
import { useNotificationsQuery } from "@/hooks/queries/use-notification-queries";
import {
  useDeleteNotificationMutation,
  useMarkAllNotificationsReadMutation,
  useMarkAllNotificationsUnreadMutation,
  useMarkNotificationReadMutation,
} from "@/hooks/mutations/use-notification-mutations";

type NotificationsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function NotificationsModal({
  isOpen,
  onClose,
}: NotificationsModalProps) {
  const [activeTab, setActiveTab] = useState<NotificationTab>("all");

  // Confirmation/success modals
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isAllReadModalOpen, setIsAllReadModalOpen] = useState(false);

  // GET /api/notifications — fetched only while the panel is open
  const listQuery = useNotificationsQuery(activeTab, 1, isOpen);

  // Mutations
  const markReadMutation = useMarkNotificationReadMutation();
  const deleteMutation = useDeleteNotificationMutation();
  const markAllReadMutation = useMarkAllNotificationsReadMutation();
  const undoMarkAllReadMutation = useMarkAllNotificationsUnreadMutation();

  const items = listQuery.data?.items ?? [];
  const unreadCount = listQuery.data?.unread_count ?? 0;
  // `total_count` reflects the current filter when filter !== "all", so we use it as the per-tab count.
  const totalCount = listQuery.data?.total_count ?? 0;
  // For the All tab we only know unread; read = total - unread on this page is unreliable across pages.
  // Surface the unread/read counts the backend gave us; show read as "—" until the user opens that tab.
  const readCount =
    activeTab === "read" ? totalCount : Math.max(0, totalCount - unreadCount);

  const handleMarkRead = (id: string) => {
    markReadMutation.mutate(id, {
      onError: (err) => {
        toast.error(
          err instanceof Error
            ? err.message
            : "Could not mark this notification as read.",
        );
      },
    });
  };

  const requestDelete = (id: string) => setDeleteTargetId(id);

  const confirmDelete = () => {
    if (!deleteTargetId) {
      setDeleteTargetId(null);
      return;
    }
    const id = deleteTargetId;
    setDeleteTargetId(null);
    deleteMutation.mutate(id, {
      onError: (err) => {
        toast.error(
          err instanceof Error
            ? err.message
            : "Could not delete this notification.",
        );
      },
    });
  };

  const handleMarkAllRead = () => {
    markAllReadMutation.mutate(undefined, {
      onSuccess: () => {
        setIsAllReadModalOpen(true);
      },
      onError: (err) => {
        toast.error(
          err instanceof Error
            ? err.message
            : "Could not mark all notifications as read.",
        );
      },
    });
  };

  const undoMarkAllRead = () => {
    undoMarkAllReadMutation.mutate(undefined, {
      onSuccess: () => {
        setIsAllReadModalOpen(false);
      },
      onError: (err) => {
        toast.error(
          err instanceof Error
            ? err.message
            : "Could not undo mark all as read.",
        );
      },
    });
  };

  const isFetching = listQuery.isPending || listQuery.isFetching;
  const errorMessage =
    listQuery.error instanceof Error
      ? listQuery.error.message
      : "Could not load your notifications.";

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <DialogContent
          showCloseButton={false}
          className={cn(
            "fixed top-0 right-0 left-auto h-screen w-full max-w-none",
            "translate-x-0 translate-y-0 rounded-none",
            "lg:top-3 lg:right-4 lg:w-1/2 lg:max-w-[720px] lg:rounded-lg",
          )}
        >
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <DialogTitle className="text-foreground text-lg font-semibold">
              Notifications
            </DialogTitle>
            <DialogDescription className="sr-only">
              This modal displays lists of notifications for the user.
            </DialogDescription>
            <button
              type="button"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors"
            >
              <X className="h-4 w-4" />
              Close
            </button>
          </div>

          <div className="flex flex-col gap-3 px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
            <NotificationTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              unreadCount={unreadCount}
              readCount={readCount}
            />

            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0 || markAllReadMutation.isPending}
              className={cn(
                "text-primary border-primary hover:bg-primary/5",
                "flex items-center gap-1.5 rounded-lg border px-3 py-1.5",
                "text-sm font-medium transition-colors self-start sm:self-auto",
                "disabled:cursor-not-allowed disabled:opacity-50",
              )}
            >
              {markAllReadMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCheck className="h-4 w-4" />
              )}
              Mark all as read
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {listQuery.isError ? (
              <div className="text-error flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
                <p className="text-sm">{errorMessage}</p>
                <button
                  type="button"
                  onClick={() => listQuery.refetch()}
                  className="text-primary border-primary hover:bg-primary/5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors"
                >
                  Try again
                </button>
              </div>
            ) : isFetching && items.length === 0 ? (
              <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
                <Loader2 className="h-6 w-6 animate-spin" />
                <p className="text-sm">Loading notifications…</p>
              </div>
            ) : items.length === 0 ? (
              <div className="text-muted-foreground flex flex-col items-center justify-center px-6 py-12 text-center">
                <p className="text-sm">No notifications to show</p>
              </div>
            ) : (
              items.map((notification) => {
                const pending =
                  (markReadMutation.isPending &&
                    markReadMutation.variables === notification.id) ||
                  (deleteMutation.isPending &&
                    deleteMutation.variables === notification.id);
                return (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkRead={handleMarkRead}
                    onDelete={requestDelete}
                    pending={pending}
                  />
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation modal */}
      <BaseModal
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        icon={<TrashIcon className="text-primary h-12 w-12" />}
        title="Delete Notification"
        subtitle="Are you sure you want to delete this notification?"
        confirmText={deleteMutation.isPending ? "Deleting…" : "Delete"}
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />

      {/* "All caught up" success modal */}
      <BaseModal
        isOpen={isAllReadModalOpen}
        onClose={() => setIsAllReadModalOpen(false)}
        icon={<PartyIcon className="text-primary h-12 w-12" />}
        title="You are all caught up"
        subtitle="All notifications are now read."
        confirmText="Done"
        cancelText={undoMarkAllReadMutation.isPending ? "Undoing…" : "Undo"}
        onConfirm={() => setIsAllReadModalOpen(false)}
        onCancel={undoMarkAllRead}
      />
    </>
  );
}
