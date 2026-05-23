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
  purple: "bg-purple-100 text-purple-600",
  green: "bg-green-100 text-green-600",
  orange: "bg-orange-100 text-orange-600",
  blue: "bg-blue-100 text-blue-600",
  yellow: "bg-yellow-100 text-yellow-600",
  red: "bg-red-100 text-red-600",
  pink: "bg-pink-100 text-pink-600",
  gray: "bg-gray-100 text-gray-600",
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
      <Icon className="h-5 w-5" />
    </div>
  );
}
