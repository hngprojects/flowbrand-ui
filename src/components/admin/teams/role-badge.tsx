import { cn } from "@/lib/utils";
import type { TeamRole } from "@/types/admin";

const ROLE_CONFIG: Record<TeamRole, { label: string; className: string }> = {
  owner: { label: "Owner", className: "bg-gray-200 text-gray-700" },
  super_admin: {
    label: "Super Admin",
    className: "bg-[#FFEDD5] text-[#9A3412]",
  },
  admin: { label: "Admin", className: "bg-[#E0E7FF] text-[#4338CA]" },
  regular: { label: "Regular", className: "bg-[#DCFCE7] text-[#15803D]" },
  designer: { label: "Designer", className: "bg-[#F5F3FF] text-[#7C3AED]" },
  dev: { label: "Dev", className: "bg-[#FEF9C3] text-[#854D0E]" },
};

export function RoleBadge({
  role,
  className,
}: {
  role: TeamRole;
  className?: string;
}) {
  const config = ROLE_CONFIG[role];
  return (
    <span
      className={cn(
        "inline-flex min-w-[88px] items-center justify-center rounded-full px-3 py-1 text-xs font-medium",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
