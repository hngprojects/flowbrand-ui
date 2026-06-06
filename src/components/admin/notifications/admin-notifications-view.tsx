"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import DeleteNotificationModal from "@/components/admin/notifications/DeleteNotificationModal";
import MilestoneIcon from "@/components/icons/admin/notifications/MilestoneIcon";
import RiskIcon from "@/components/icons/admin/notifications/RiskIcon";
import MentionIcon from "@/components/icons/admin/notifications/MentionIcon";
import FeedbackIcon from "@/components/icons/admin/notifications/FeedbackIcon";
import {
  type AdminNotificationItem,
  type AdminNotificationType,
} from "@/lib/admin-notifications-api";
import { useAdminNotificationsQuery } from "@/hooks/queries/use-admin-notifications-queries";
import { useAdminNotificationsMutations } from "@/hooks/mutations/use-admin-notifications-mutations";

type NotificationTag = "MILESTONE" | "RISK" | "MENTION" | "FEEDBACK";

const TAG_ICONS: Record<NotificationTag, React.ReactNode> = {
  MILESTONE: <MilestoneIcon />,
  RISK: <RiskIcon />,
  MENTION: <MentionIcon />,
  FEEDBACK: <FeedbackIcon />,
};

const TAG_STYLES: Record<NotificationTag, string> = {
  MILESTONE: "bg-green-100 text-green-800",
  RISK: "bg-red-100 text-red-800",
  MENTION: "bg-blue-100 text-blue-800",
  FEEDBACK: "bg-yellow-100 text-yellow-800",
};

type TabFilter = "all" | "mentions" | "risks" | "milestones" | "feedback";

const TAB_FILTERS: { id: TabFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "mentions", label: "Mentions" },
  { id: "risks", label: "Risks" },
  { id: "milestones", label: "Milestones" },
  { id: "feedback", label: "Feedback" },
];

const TAB_TO_TYPE: Record<
  TabFilter,
  "all" | AdminNotificationType | undefined
> = {
  all: "all",
  mentions: "mention",
  risks: "risk",
  milestones: "milestone",
  feedback: "feedback",
};

function typeToTag(type: AdminNotificationType): NotificationTag {
  return type.toUpperCase() as NotificationTag;
}

export function AdminNotificationsView() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const typeFilter = TAB_TO_TYPE[activeTab];
  const queryParams = useMemo(
    () => ({
      type: typeFilter === "all" ? undefined : typeFilter,
      page: 1,
      perPage: 50,
    }),
    [typeFilter],
  );

  const { data, isLoading, isError, refetch } =
    useAdminNotificationsQuery(queryParams);
  const { deleteOne, bulkDelete, markRead, markAllRead } =
    useAdminNotificationsMutations();

  const notifications = data?.notifications ?? [];

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === notifications.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(notifications.map((n) => n.id)));
    }
  };

  const handleDeleteSingle = () => {
    if (!deleteTarget) return;
    deleteOne.mutate(deleteTarget, {
      onSuccess: () => {
        setSelected((prev) => {
          const next = new Set(prev);
          next.delete(deleteTarget);
          return next;
        });
        setDeleteTarget(null);
      },
      onError: (error) => {
        toast.error(
          error instanceof Error
            ? error.message
            : "Could not delete notification.",
        );
      },
    });
  };

  const handleBulkDelete = () => {
    bulkDelete.mutate(
      { ids: [...selected] },
      {
        onSuccess: () => {
          setSelected(new Set());
          setBulkDeleteOpen(false);
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Could not delete notifications.",
          );
        },
      },
    );
  };

  const handleOpenNotification = (notification: AdminNotificationItem) => {
    if (!notification.isRead) {
      markRead.mutate(notification.id);
    }
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-5 flex items-center gap-2 text-sm text-black-300 hover:text-black-500 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M10 12L6 8L10 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back
      </button>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {TAB_FILTERS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setSelected(new Set());
              }}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-white"
                  : "bg-transparent text-black-300 hover:bg-gray-200"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && data?.meta.total != null
                ? ` (${data.meta.total})`
                : ""}
            </button>
          ))}
        </div>

        {(data?.meta.unread_count ?? 0) > 0 ? (
          <button
            type="button"
            onClick={() =>
              markAllRead.mutate(typeFilter === "all" ? undefined : typeFilter)
            }
            className="text-sm font-medium text-primary hover:underline"
          >
            Mark all as read
          </button>
        ) : null}
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-3">
        <input
          type="checkbox"
          checked={
            notifications.length > 0 && selected.size === notifications.length
          }
          onChange={toggleSelectAll}
          className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-primary"
        />
        <span className="text-sm text-black-300">
          {isLoading
            ? "Loading..."
            : `${data?.meta.total ?? notifications.length} notifications`}
          {data?.meta.unread_count ? ` · ${data.meta.unread_count} unread` : ""}
        </span>
        {selected.size > 0 ? (
          <button
            type="button"
            onClick={() => setBulkDeleteOpen(true)}
            className="flex items-center gap-1.5 rounded-[8px] border border-red-100 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-500 hover:opacity-90 transition-opacity"
          >
            Delete ({selected.size})
          </button>
        ) : null}
      </div>

      {isError ? (
        <div className="rounded-[12px] border border-gray-500 bg-white px-6 py-16 text-center">
          <p className="text-sm text-neutral-500">
            Could not load notifications.
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-4 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[12px] border border-gray-500 bg-white">
          {notifications.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center gap-3 py-16 text-black-300">
              <AlertCircle size={32} className="text-gray-300" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const tag = typeToTag(notif.type);
              return (
                <div
                  key={notif.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleOpenNotification(notif)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      handleOpenNotification(notif);
                    }
                  }}
                  className={`flex flex-wrap items-start gap-3 px-4 py-4 transition-colors border-t border-b border-gray-500 first:border-t-0 last:border-b-0 cursor-pointer sm:flex-nowrap ${
                    selected.has(notif.id) ? "bg-blue-50" : "hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected.has(notif.id)}
                    onChange={() => toggleSelect(notif.id)}
                    onClick={(event) => event.stopPropagation()}
                    className="mt-1 h-5 w-5 cursor-pointer rounded border-gray-300 accent-primary shrink-0"
                  />

                  <div
                    className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ${
                      notif.isRead ? "bg-transparent" : "bg-primary"
                    }`}
                  />

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-medium">
                    {TAG_ICONS[tag]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-foreground">
                        {notif.senderName}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${TAG_STYLES[tag]}`}
                      >
                        {tag}
                      </span>
                    </div>
                    <p className="text-sm text-black-300 leading-snug">
                      {notif.message}
                    </p>
                    <p className="text-xs text-[#A2A2A2] mt-0.5">
                      {notif.title}
                    </p>
                  </div>

                  <div className="ml-auto flex w-full shrink-0 flex-row items-center justify-between gap-2 sm:ml-0 sm:w-auto sm:flex-col sm:items-end">
                    <span className="text-xs text-[#A2A2A2]">
                      {notif.timeLabel}
                    </span>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setDeleteTarget(notif.id);
                      }}
                      aria-label="Delete notification"
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                      >
                        <path
                          d="M2 4h11M5 4V2.5a.5.5 0 01.5-.5h4a.5.5 0 01.5.5V4M6 7v4M9 7v4M3 4l.8 8.1a1 1 0 001 .9h5.4a1 1 0 001-.9L12 4"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      <DeleteNotificationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteSingle}
        isBulk={false}
      />

      <DeleteNotificationModal
        isOpen={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDelete}
        isBulk={true}
        count={selected.size}
      />
    </div>
  );
}
