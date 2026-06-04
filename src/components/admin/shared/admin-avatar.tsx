import { cn } from "@/lib/utils";

/**
 * Circular initials avatar used across admin tables (Teams, Logs).
 * Background tint is chosen deterministically from the initials so the same
 * person keeps a stable colour. All colours come from globals.css tokens.
 */

const TINTS = [
  "bg-primary-50 text-primary-700",
  "bg-accent-50 text-accent-700",
  "bg-green-50 text-green-700",
  "bg-red-50 text-red-400",
  "bg-yellow-50 text-yellow-700",
  "bg-primary-55 text-primary-625",
] as const;

function pickTint(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash + seed.charCodeAt(i)) % TINTS.length;
  }
  return TINTS[hash];
}

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
        "inline-flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
        pickTint(seed ?? initials),
        className,
      )}
    >
      {initials}
    </span>
  );
}
