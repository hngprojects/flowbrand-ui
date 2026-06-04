import { CheckCircle2, Trash2 } from "lucide-react";
import NotificationIcon from "./notification-icon";
import { formatNotificationTime } from "@/utils/format-notification-time";
import type { Notification } from "@/types/notification";

type NotificationItemProps = {
  notification: Notification;
  onMarkRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  /** Disable the per-row buttons while a mutation is in flight. */
  pending?: boolean;
};

export default function NotificationItem({
  notification,
  onMarkRead,
  onDelete,
  pending = false,
}: NotificationItemProps) {
  const time = formatNotificationTime(notification.created_at);

  return (
    <div
      className={`flex gap-3 border-b border-border px-4 py-3 last:border-b-0 ${
        notification.is_read ? "bg-transparent" : "bg-primary/5"
      }`}
    >
      <NotificationIcon type={notification.type} />

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
          {!notification.is_read && (
            <span
              role="status"
              aria-label="Unread notification"
              className="bg-primary h-2 w-2 rounded-full"
            />
          )}
        </div>

        <div className="mt-2 flex items-center gap-2">
          {!notification.is_read && (
            <button
              type="button"
              onClick={() => onMarkRead?.(notification.id)}
              disabled={pending}
              className="text-primary hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50 rounded-full p-1 transition-colors"
              aria-label="Mark as read"
            >
              <CheckCircle2 className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => onDelete?.(notification.id)}
            disabled={pending}
            className="text-muted-foreground hover:text-error hover:bg-error/10 disabled:cursor-not-allowed disabled:opacity-50 rounded-full p-1 transition-colors"
            aria-label="Delete notification"
          >
            <Trash2 className="h-4 w-4 text-primary" />
          </button>
        </div>
      </div>
    </div>
  );
}
