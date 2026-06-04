import { cn } from "@/lib/utils";
import type { TeamRole } from "@/types/admin";

/**
 * Pill badge for a team member's role. Colours are drawn from globals.css
 * tokens. NOTE: the Figma uses a pink "Designer" and a teal "Dev" pill; the
 * design system has no pink/teal scales, so those map to the closest existing
 * tokens (red / yellow). Confirm with the designer before finalising.
 */

const ROLE_CONFIG: Record<TeamRole, { label: string; className: string }> = {
  owner: { label: "Owner", className: "bg-gray-200 text-black-400" },
  super_admin: {
    label: "Super Admin",
    className: "bg-accent-50 text-accent-700",
  },
  admin: { label: "Admin", className: "bg-primary-50 text-primary-700" },
  regular: { label: "Regular", className: "bg-green-50 text-green-700" },
  designer: { label: "Designer", className: "bg-red-50 text-red-400" },
  dev: { label: "Dev", className: "bg-yellow-50 text-yellow-700" },
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
        "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
