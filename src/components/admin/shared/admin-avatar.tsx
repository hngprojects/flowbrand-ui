import { cn } from "@/lib/utils";

/**
 * Circular initials avatar used across admin tables (Teams, Logs).
 * Background tint is chosen deterministically from the initials so the same
 * person keeps a stable colour. All colours come from globals.css tokens.
 */

interface AdminAvatarProps {
  initials: string;
  /** Used only to seed the colour; not displayed. */
  seed?: string;
  className?: string;
}

export function AdminAvatar({ initials, seed, className }: AdminAvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-full text-[18px] font-[800] font-semibold bg-[#EBF0FA] text-black-500",
        className,
      )}
    >
      {initials}
    </span>
  );
}
