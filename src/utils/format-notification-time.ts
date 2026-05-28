import { format, isToday, isYesterday, isThisYear } from "date-fns";

export function formatNotificationTime(createdAt: string): string {
  const date = new Date(createdAt);
  if (isNaN(date.getTime())) return "";
  const now = new Date();
  const diffMins = Math.floor((now.getTime() - date.getTime()) / 60_000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} mins ago`;
  if (isToday(date)) return `${Math.floor(diffMins / 60)} hours ago`;
  if (isYesterday(date)) return "Yesterday";
  if (isThisYear(date)) return format(date, "MMM d");
  return format(date, "MMM d, yyyy");
}
