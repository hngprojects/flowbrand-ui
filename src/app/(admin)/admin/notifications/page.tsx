"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import DeleteNotificationModal from "@/components/admin/notifications/DeleteNotificationModal";
import MilestoneIcon from "@/components/icons/admin/notifications/MilestoneIcon";
import RiskIcon from "@/components/icons/admin/notifications/RiskIcon";
import MentionIcon from "@/components/icons/admin/notifications/MentionIcon";
import FeedbackIcon from "@/components/icons/admin/notifications/FeedbackIcon";

const TAG_ICONS: Record<NotificationTag, React.ReactNode> = {
  MILESTONE: <MilestoneIcon />,
  RISK: <RiskIcon />,
  MENTION: <MentionIcon />,
  FEEDBACK: <FeedbackIcon />,
};

type NotificationTag = "MILESTONE" | "RISK" | "MENTION" | "FEEDBACK";

interface AdminNotification {
  id: string;
  name: string;
  tag: NotificationTag;
  text: string;
  sub: string;
  time: string;
  read: boolean;
  avatarColor: string;
  avatarText: string;
}

const MOCK_NOTIFICATIONS: AdminNotification[] = [
  {
    id: "1",
    name: "Maya Patel",
    tag: "MILESTONE",
    text: "reached Stage 3 — first $1k month",
    sub: "Funnel: Local bakery · NPS +9",
    time: "12 min ago",
    read: false,
    avatarColor: "#DCFCE7",
    avatarText: "M",
  },
  {
    id: "2",
    name: "Cohort signal",
    tag: "RISK",
    text: "mentioned you in Lagos Cakes feedback",
    sub: "184 owners tracked",
    time: "38 min ago",
    read: false,
    avatarColor: "#FEE2E2",
    avatarText: "C",
  },
  {
    id: "3",
    name: "Maya Patel",
    tag: "MENTION",
    text: "mentioned you in Lagos Cakes feedback",
    sub: '"@you can we ship her template by Fri?"',
    time: "50 min ago",
    read: false,
    avatarColor: "#DBEAFE",
    avatarText: "M",
  },
  {
    id: "4",
    name: "Maya Patel",
    tag: "FEEDBACK",
    text: "left feedback on the Service template",
    sub: 'Rating 4/5 · "intro stage too long"',
    time: "1h ago",
    read: true,
    avatarColor: "#FEF3C7",
    avatarText: "M",
  },
  {
    id: "5",
    name: "NorthFork Coffee",
    tag: "MILESTONE",
    text: "completed onboarding",
    sub: "Funnel: Cafe loyalty · 8 minutes",
    time: "2h ago",
    read: false,
    avatarColor: "#DCFCE7",
    avatarText: "N",
  },
  {
    id: "6",
    name: "System",
    tag: "MENTION",
    text: "Funnel: Cafe loyalty · 8 minutes",
    sub: "184 owners · 5 templates · 64 feedback",
    time: "8h ago",
    read: true,
    avatarColor: "#F1EFE8",
    avatarText: "S",
  },
  {
    id: "7",
    name: "Maya Patel",
    tag: "MENTION",
    text: "mentioned you in Lagos Cakes feedback",
    sub: '"agreed — let\'s push the v2 template tomorrow"',
    time: "12h ago",
    read: true,
    avatarColor: "#DBEAFE",
    avatarText: "M",
  },
  {
    id: "8",
    name: "Maya Patel",
    tag: "MENTION",
    text: "mentioned you in Lagos Cakes feedback",
    sub: '"@you can we ship her template by Fri?"',
    time: "14h ago",
    read: true,
    avatarColor: "#DBEAFE",
    avatarText: "M",
  },
];

const TAG_STYLES: Record<NotificationTag, string> = {
  MILESTONE: "bg-green-100 text-green-800",
  RISK: "bg-red-100 text-red-800",
  MENTION: "bg-blue-100 text-blue-800",
  FEEDBACK: "bg-yellow-100 text-yellow-800",
};

type TabFilter = "all" | "mentions" | "risks" | "milestones" | "feedback";

const TAB_FILTERS: { id: TabFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "mentions", label: "Mentions" },
  { id: "risks", label: "Risks" },
  { id: "milestones", label: "Milestones" },
  { id: "feedback", label: "Feedback" },
];

const TAG_MAP: Record<TabFilter, NotificationTag | null> = {
  all: null,
  mentions: "MENTION",
  risks: "RISK",
  milestones: "MILESTONE",
  feedback: "FEEDBACK",
};

export default function AdminNotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const filtered = notifications.filter((n) => {
    const tagFilter = TAG_MAP[activeTab];
    return tagFilter ? n.tag === tagFilter : true;
  });

  const tabCount = (tab: TabFilter) => {
    const tagFilter = TAG_MAP[tab];
    return tagFilter
      ? notifications.filter((n) => n.tag === tagFilter).length
      : notifications.length;
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((n) => n.id)));
    }
  };

  const handleDeleteSingle = () => {
    if (!deleteTarget) return;
    setNotifications((prev) => prev.filter((n) => n.id !== deleteTarget));
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(deleteTarget);
      return next;
    });
    setDeleteTarget(null);
  };

  const handleBulkDelete = () => {
    setNotifications((prev) => prev.filter((n) => !selected.has(n.id)));
    setSelected(new Set());
    setBulkDeleteOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 md:px-8">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-5 flex items-center gap-2 text-sm text-black-300 hover:text-black-500 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M10 12L6 8L10 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back
      </button>

      <div className="mb-4 flex flex-wrap gap-2">
        {TAB_FILTERS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-white"
                : "bg-transparent text-black-300 hover:bg-gray-200"
            }`}
          >
            {tab.label} ({tabCount(tab.id)})
          </button>
        ))}
      </div>

      <div className="mb-3 flex items-center gap-3">
        <input
          type="checkbox"
          checked={selected.size === filtered.length && filtered.length > 0}
          onChange={toggleSelectAll}
          className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-primary"
        />
        <span className="text-sm text-black-300">
          {filtered.length} notifications
        </span>
        {selected.size > 0 && (
          <button
            type="button"
            onClick={() => setBulkDeleteOpen(true)}
            className="flex items-center gap-1.5 rounded-[8px] border border-red-100 bg-red-50 
            px-3 py-1.5 text-sm font-medium text-red-500 hover:opacity-90 transition-opacity"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path
                d="M2 4h11M5 4V2.5a.5.5 0 01.5-.5h4a.5.5 0 01.5.5V4M6 7v4M9 7v4M3 4l.8 8.1a1 1 0 001 .9h5.4a1 1 0 001-.9L12 4"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Delete ({selected.size})
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-[12px] border border-gray-500 bg-white">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-black-300">
            <AlertCircle size={32} className="text-gray-300" />
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          filtered.map((notif) => (
            <div
              key={notif.id}
              className={`flex items-start gap-3 px-4 py-4 transition-colors
                border-t border-b border-gray-500 first:border-t-0 last:border-b-0
                ${selected.has(notif.id) ? "bg-blue-50" : "hover:bg-gray-50"}`}
            >
              <input
                type="checkbox"
                checked={selected.has(notif.id)}
                onChange={() => toggleSelect(notif.id)}
                className="mt-1 h-5 w- cursor-pointer rounded border-gray-300 accent-primary shrink-0"
              />

              <div
                className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ${
                  notif.read ? "bg-transparent" : "bg-primary"
                }`}
              />

              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium"
                style={{ backgroundColor: notif.avatarColor }}
              >
                {TAG_ICONS[notif.tag]}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium text-foreground">
                    {notif.name}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${TAG_STYLES[notif.tag]}`}
                  >
                    {notif.tag}
                  </span>
                </div>
                <p className="text-sm text-black-300 leading-snug">
                  {notif.text}
                </p>
                <p className="text-xs text-[#A2A2A2] mt-0.5">{notif.sub}</p>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-2">
                <span className="text-xs text-[#A2A2A2]">{notif.time}</span>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(notif.id)}
                  aria-label="Delete notification"
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path
                      d="M2 4h11M5 4V2.5a.5.5 0 01.5-.5h4a.5.5 0 01.5.5V4M6 7v4M9 7v4M3 4l.8 8.1a1 1 0 001 .9h5.4a1 1 0 001-.9L12 4"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <DeleteNotificationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteSingle}
        isBulk={false}
      />

      <DeleteNotificationModal
        isOpen={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDelete}
        isBulk={true}
        count={selected.size}
      />
    </div>
  );
}
