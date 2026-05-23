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
  return (
    <div className="border-border flex gap-3 border-b px-4 py-3 last:border-b-0">
      <NotificationIcon
        type={notification.iconType}
        color={notification.iconColor}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h4 className="text-foreground text-sm font-semibold">
            {notification.title}
          </h4>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-muted-foreground text-xs">
              {formatNotificationTime(notification.createdAt)}
            </span>
            {!notification.isRead && (
              <span className="bg-primary h-2 w-2 rounded-full" />
            )}
          </div>
        </div>
        <p className="text-muted-foreground mt-1 text-sm">
          {notification.body}
        </p>

        <div className="mt-2 flex items-center gap-3">
          {!notification.isRead && (
            <button
              type="button"
              onClick={() => onMarkRead?.(notification.id)}
              className="text-primary hover:text-primary/80 transition-colors"
              aria-label="Mark as read"
            >
              <CheckCircle2 className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => onDelete?.(notification.id)}
            className="text-muted-foreground hover:text-error transition-colors"
            aria-label="Delete notification"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
