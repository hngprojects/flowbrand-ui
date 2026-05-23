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

  return (
    <div
      className={`flex gap-3 border-b border-border px-4 py-3 last:border-b-0 ${
        notification.isRead ? "bg-transparent" : "bg-primary/5"
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

      {/* Right column: dot + time on top, actions on bottom */}
      <div className="flex flex-shrink-0 flex-col items-end justify-between">
        <div className="flex items-center gap-2">
          {/* Desktop-only time: shows on the right */}
          <span className="text-muted-foreground hidden text-xs sm:block">
            {time}
          </span>
          {!notification.isRead && (
            <span className="bg-primary h-2 w-2 rounded-full" />
          )}
        </div>

        <div className="mt-2 flex items-center gap-2">
          {!notification.isRead && (
            <button
              type="button"
              onClick={() => onMarkRead?.(notification.id)}
              className="text-primary hover:bg-primary/10 rounded-full p-1 transition-colors"
              aria-label="Mark as read"
            >
              <CheckCircle2 className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => onDelete?.(notification.id)}
            className="text-muted-foreground hover:text-error hover:bg-error/10 rounded-full p-1 transition-colors"
            aria-label="Delete notification"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
