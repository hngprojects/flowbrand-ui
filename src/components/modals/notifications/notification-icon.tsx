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
  NotificationIconType,
  NotificationIconColor,
} from "@/types/notification";

const ICON_MAP = {
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

type NotificationIconProps = {
  type: NotificationIconType;
  color: NotificationIconColor;
};

export default function NotificationIcon({
  type,
  color,
}: NotificationIconProps) {
  const Icon = ICON_MAP[type];
  return (
    <div
      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${COLOR_MAP[color]}`}
    >
      <Icon className="h-5 w-5 text-white" />
    </div>
  );
}
