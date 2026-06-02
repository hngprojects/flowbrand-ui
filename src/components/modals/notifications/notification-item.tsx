import { CheckCircle2, Trash2 } from "lucide-react";
import NotificationIcon from "./notification-icon";
import { formatNotificationTime } from "@/utils/format-notification-time";
import type { Notification } from "@/types/notification";

type NotificationItemProps = {
  notification: Notification;
  onMarkRead?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export default function NotificationItem({
  notification,
  onMarkRead,
  onDelete,
}: NotificationItemProps) {
  const time = formatNotificationTime(notification.createdAt);
  const isUnread = !notification.isRead;

  const handleRowActivate = () => {
    if (isUnread) onMarkRead?.(notification.id);
  };

  return (
    <div
      role={isUnread ? "button" : undefined}
      tabIndex={isUnread ? 0 : undefined}
      onClick={isUnread ? handleRowActivate : undefined}
      onKeyDown={(e) => {
        if (isUnread && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          handleRowActivate();
        }
      }}
      className={`flex gap-4 border-b border-border px-4 py-3 last:border-b-0 sm:gap-3 ${
        isUnread ? "bg-primary/5 cursor-pointer" : "bg-transparent"
      }`}
    >
      <NotificationIcon
        type={notification.iconType}
        color={notification.iconColor}
      />

      {/* Middle: title + body (+ time on mobile) */}
      <div className="min-w-0 flex-1">
        <h4 className="text-foreground text-sm font-semibold">
          {notification.title}
        </h4>
        <p className="text-muted-foreground mt-1 text-sm">
          {notification.body}
        </p>
        {/* Mobile-only time: shows under the body */}
        <span className="text-muted-foreground mt-2 block text-xs sm:hidden">
          {time}
        </span>
      </div>

      {/* Right column: tight on mobile (dot + trash close together), spread on desktop */}
      <div className="flex flex-shrink-0 flex-col items-end gap-2 sm:justify-between sm:gap-0">
        <div className="flex items-center gap-2">
          {/* Desktop-only time: shows on the right */}
          <span className="text-muted-foreground hidden text-xs sm:block">
            {time}
          </span>
          {isUnread && (
            <span
              role="status"
              aria-label="Unread notification"
              className="bg-primary h-2 w-2 rounded-full"
            />
          )}
        </div>

        <div className="flex items-center gap-2 sm:mt-2">
          {/* Mark-as-read button — desktop only; on mobile, tapping the row marks read */}
          {isUnread && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMarkRead?.(notification.id);
              }}
              className="text-primary hover:bg-primary/10 hidden rounded-full p-1 transition-colors sm:inline-flex"
              aria-label="Mark as read"
            >
              <CheckCircle2 className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(notification.id);
            }}
            className="text-muted-foreground hover:text-error hover:bg-error/10 rounded-full p-1 transition-colors"
            aria-label="Delete notification"
          >
            <Trash2 className="h-4 w-4 text-primary" />
          </button>
        </div>
      </div>
    </div>
  );
}
