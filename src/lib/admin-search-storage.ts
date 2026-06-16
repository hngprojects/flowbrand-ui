import { DEFAULT_ADMIN_RECENT_SEARCHES } from "@/lib/admin-users-stub";

const RECENT_KEY = "admin-search-recent";
const MAX_RECENT = 8;

export function readAdminRecentSearches(): string[] {
  if (typeof window === "undefined") {
    return [...DEFAULT_ADMIN_RECENT_SEARCHES];
  }

  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    if (!raw) {
      return [...DEFAULT_ADMIN_RECENT_SEARCHES];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [...DEFAULT_ADMIN_RECENT_SEARCHES];
    }

    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [...DEFAULT_ADMIN_RECENT_SEARCHES];
  }
}

export function writeAdminRecentSearches(items: string[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      RECENT_KEY,
      JSON.stringify(items.slice(0, MAX_RECENT)),
    );
  } catch {
    // Quota exceeded, private mode, or storage disabled.
  }
}

export function addAdminRecentSearch(term: string): string[] {
  const trimmed = term.trim();
  if (!trimmed) {
    return readAdminRecentSearches();
  }

  const next = [
    trimmed,
    ...readAdminRecentSearches().filter(
      (item) => item.toLowerCase() !== trimmed.toLowerCase(),
    ),
  ].slice(0, MAX_RECENT);

  writeAdminRecentSearches(next);
  return next;
}
