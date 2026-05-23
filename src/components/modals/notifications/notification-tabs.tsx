export type NotificationTab = "all" | "unread" | "read";

type NotificationTabsProps = {
  activeTab: NotificationTab;
  onTabChange: (tab: NotificationTab) => void;
  unreadCount: number;
  readCount: number;
};

export default function NotificationTabs({
  activeTab,
  onTabChange,
  unreadCount,
  readCount,
}: NotificationTabsProps) {
  const tabs: { id: NotificationTab; label: string }[] = [
    { id: "all", label: "All" },
    { id: "unread", label: `Unread(${unreadCount})` },
    { id: "read", label: `Read(${readCount})` },
  ];

  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? "bg-primary text-primary-foreground"
              : "bg-transparent text-foreground hover:bg-muted-foreground/10"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
