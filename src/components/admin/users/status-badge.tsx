import { cn } from "@/lib/utils";

export type UserStatus = "active" | "inactive" | "deleted";

export function StatusBadge({
  status,
}: {
  status: UserStatus;
}) {
  const config = {
    active: {
      label: "Active",
      className: "bg-primary-50 text-primary-500",
    },
    inactive: {
      label: "Inactive",
      className: "bg-accent-50 text-accent-700",
    },
    deleted: {
      label: "Deleted",
      className: "bg-red-50 text-red-500",
    },
  };

  const current = config[status];

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium",
        current.className,
      )}
    >
      {current.label}
    </span>
  );
}