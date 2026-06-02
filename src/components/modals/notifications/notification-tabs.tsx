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
    <div role="tablist" className="flex gap-2 border border-border rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`rounded-lg px-4 py-2 text-sm w-24 font-medium transition-colors ${
            activeTab === tab.id
              ? "bg-primary text-primary-foreground"
              : "bg-transparent text-foreground/50 hover:bg-muted-foreground/10"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
