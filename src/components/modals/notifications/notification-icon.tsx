import {
  Bell,
  Calendar,
  CheckCircle2,
  Flag,
  LineChart,
  Lightbulb,
  MessageSquare,
  ShoppingCart,
  Settings,
  User,
} from "lucide-react";
import type {
  NotificationIconColor,
  NotificationIconType,
} from "@/types/notification";

const ICON_MAP: Record<
  NotificationIconType,
  React.ComponentType<{ className?: string }>
> = {
  bell: Bell,
  calendar: Calendar,
  check: CheckCircle2,
  flag: Flag,
  chart: LineChart,
  lightbulb: Lightbulb,
  message: MessageSquare,
  cart: ShoppingCart,
  gear: Settings,
  user: User,
};

const COLOR_MAP: Record<NotificationIconColor, string> = {
  purple: "bg-purple-500",
  green: "bg-green-500",
  orange: "bg-orange-500",
  blue: "bg-blue-500",
  yellow: "bg-yellow-500",
  red: "bg-red-500",
  pink: "bg-pink-500",
  gray: "bg-gray-800",
};

type IconSpec = {
  icon: NotificationIconType;
  color: NotificationIconColor;
};

/**
 * Map the backend notification.type to a UI icon + color.
 * Unknown types fall through to a sensible default.
 */
function specForType(type: string): IconSpec {
  switch (type) {
    case "funnel_completed":
    case "funnel_ready":
      return { icon: "check", color: "green" };
    case "funnel_failed":
      return { icon: "flag", color: "red" };
    case "funnel_generating":
      return { icon: "gear", color: "gray" };
    case "stage_unlocked":
      return { icon: "flag", color: "orange" };
    case "stage_completed":
      return { icon: "check", color: "green" };
    case "task_completed":
      return { icon: "check", color: "blue" };
    case "weekly_digest":
      return { icon: "chart", color: "blue" };
    case "tip":
    case "suggestion":
      return { icon: "lightbulb", color: "yellow" };
    case "message":
      return { icon: "message", color: "green" };
    case "buyer_interest":
    case "sale":
      return { icon: "cart", color: "orange" };
    case "account":
    case "profile":
      return { icon: "user", color: "purple" };
    case "reminder":
      return { icon: "calendar", color: "purple" };
    default:
      return { icon: "bell", color: "blue" };
  }
}

type NotificationIconProps = {
  /** Backend notification.type, e.g. "funnel_completed". */
  type: string;
};

export default function NotificationIcon({ type }: NotificationIconProps) {
  const { icon, color } = specForType(type);
  const Icon = ICON_MAP[icon];
  return (
    <div
      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${COLOR_MAP[color]}`}
    >
      <Icon className="h-5 w-5 text-white" />
    </div>
  );
}
