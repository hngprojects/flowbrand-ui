import { Select } from "@/components/ui/select";
import type { InviteRole } from "@/types/admin";

const ROLE_OPTIONS: { value: InviteRole; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "regular", label: "Regular" },
  { value: "designer", label: "Designer" },
  { value: "dev", label: "Dev" },
];

/** Compact role picker reused by both the "By email" and "By link" panels. */
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
      className={className ?? "h-9 w-28 rounded-lg"}
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
