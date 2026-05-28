import type { Notification } from "@/types/notification";

const now = new Date();
const minsAgo = (m: number) =>
  new Date(now.getTime() - m * 60_000).toISOString();
const hoursAgo = (h: number) =>
  new Date(now.getTime() - h * 3_600_000).toISOString();
const daysAgo = (d: number) =>
  new Date(now.getTime() - d * 86_400_000).toISOString();

export const mockNotifications: Notification[] = [
  {
    id: "1",
    title: 'Time to take action on "Spark Interest"',
    body: "Reply to your messages and engage your audience today.",
    iconType: "bell",
    iconColor: "blue",
    isRead: false,
    createdAt: minsAgo(2),
  },
  {
    id: "2",
    title: "Don't forget to log your progress",
    body: 'Update what you did this week for "Spark Interest".',
    iconType: "calendar",
    iconColor: "purple",
    isRead: false,
    createdAt: minsAgo(15),
  },
  {
    id: "3",
    title: 'You completed "Get Noticed"',
    body: "Great job! You are ready for the next stage.",
    iconType: "check",
    iconColor: "green",
    isRead: false,
    createdAt: hoursAgo(2),
  },
  {
    id: "4",
    title: '"Spark Interest" is now active',
    body: "Start engaging with your audience this week",
    iconType: "flag",
    iconColor: "orange",
    isRead: false,
    createdAt: hoursAgo(3),
  },
  {
    id: "5",
    title: "You are 50% through your funnel",
    body: "Keep going - you're halfway there.",
    iconType: "chart",
    iconColor: "blue",
    isRead: false,
    createdAt: daysAgo(1),
  },
  {
    id: "6",
    title: "Try this to boost results",
    body: "Post a short video to increase engagement.",
    iconType: "lightbulb",
    iconColor: "yellow",
    isRead: false,
    createdAt: daysAgo(1),
  },
  {
    id: "7",
    title: "Someone reacted to your post",
    body: "Now is a good time to follow up.",
    iconType: "message",
    iconColor: "green",
    isRead: false,
    createdAt: daysAgo(5),
  },
  {
    id: "8",
    title: "You have 3 interested buyers",
    body: "Send pricing details to close the sale.",
    iconType: "cart",
    iconColor: "orange",
    isRead: true,
    createdAt: daysAgo(10),
  },
  {
    id: "9",
    title: "Your funnel was regenerated",
    body: "Your plan has been updated based on your inputs.",
    iconType: "gear",
    iconColor: "gray",
    isRead: true,
    createdAt: daysAgo(90),
  },
  {
    id: "10",
    title: "Mercy updated checklist items",
    body: '2 tasks marked complete in "Make First Sale".',
    iconType: "user",
    iconColor: "purple",
    isRead: true,
    createdAt: daysAgo(120),
  },
  {
    id: "11",
    title: 'Time to take action on "Get Noticed"',
    body: "You have 4 tasks left to complete this week",
    iconType: "bell",
    iconColor: "blue",
    isRead: true,
    createdAt: daysAgo(140),
  },
  {
    id: "12",
    title: "Welcome to FlowBrand",
    body: "Complete your profile to get the most out of your funnel.",
    iconType: "user",
    iconColor: "green",
    isRead: true,
    createdAt: daysAgo(160),
  },
];
