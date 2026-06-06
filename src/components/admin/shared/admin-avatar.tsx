import { cn } from "@/lib/utils";

/** Circular initials avatar used across admin tables (Teams, Logs). */

interface AdminAvatarProps {
  initials: string;
  className?: string;
}

export function AdminAvatar({ initials, className }: AdminAvatarProps) {
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
