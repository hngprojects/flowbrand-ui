export type NotificationIconType =
  | "bell"
  | "calendar"
  | "check"
  | "flag"
  | "chart"
  | "lightbulb"
  | "message"
  | "cart"
  | "gear"
  | "user";

export type NotificationIconColor =
  | "purple"
  | "green"
  | "orange"
  | "blue"
  | "yellow"
  | "red"
  | "pink"
  | "gray";

export type Notification = {
  id: string;
  title: string;
  body: string;
  iconType: NotificationIconType;
  iconColor: NotificationIconColor;
  isRead: boolean;
  createdAt: string;
};
