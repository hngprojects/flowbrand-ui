import { Select } from "@/components/ui/select";
import type { InviteRole } from "@/types/admin";

const ROLE_OPTIONS: { value: InviteRole; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "super_admin", label: "Super Admin" },
  { value: "owner", label: "Owner" },
  { value: "dev", label: "Dev" },
  { value: "designer", label: "Designer" },
];

/** Compact role picker for team invite panels. */
export function InviteRoleSelect({
  value,
  onChange,
  id,
  className,
}: {
  value: InviteRole;
  onChange: (role: InviteRole) => void;
  id?: string;
  className?: string;
}) {
  return (
    <Select
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value as InviteRole)}
      className={
        className ?? "h-9 min-w-[120px] rounded-lg border-gray-300 text-sm"
      }
      aria-label="Invite role"
    >
      {ROLE_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  );
}
