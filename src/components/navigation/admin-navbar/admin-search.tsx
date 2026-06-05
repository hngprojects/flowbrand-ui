"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Users, X } from "lucide-react";
import { searchAdminUsers } from "@/lib/admin-users-stub";
import {
  addAdminRecentSearch,
  readAdminRecentSearches,
} from "@/lib/admin-search-storage";
import { ADMIN_USERS_ROUTE } from "@/routes";
import type { AdminSearchUser } from "@/types/admin";

export function AdminSearch() {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState(() => readAdminRecentSearches());
  const [hiddenResultIds, setHiddenResultIds] = useState<string[]>([]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent | TouchEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, []);

  const results = useMemo(() => {
    return searchAdminUsers(query).filter(
      (user) => !hiddenResultIds.includes(user.id),
    );
  }, [query, hiddenResultIds]);

  function goToUsersFilter(term: string) {
    const trimmed = term.trim();
    if (!trimmed) {
      return;
    }

    const nextRecent = addAdminRecentSearch(trimmed);
    setRecent(nextRecent);
    setQuery("");
    setOpen(false);
    router.push(`${ADMIN_USERS_ROUTE}?search=${encodeURIComponent(trimmed)}`);
  }

  function handleSelect(user: AdminSearchUser) {
    goToUsersFilter(user.fullName);
  }

  function handleRecentClick(term: string) {
    goToUsersFilter(term);
  }

  function handleDismissResult(userId: string) {
    setHiddenResultIds((current) => [...current, userId]);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && query.trim()) {
      goToUsersFilter(query);
    }
  }

  return (
    <div ref={rootRef} className="relative ml-2 w-full max-w-[280px] sm:ml-6">
      <div className="flex items-center gap-2 rounded-xl border border-[#A2A2A2] bg-gray-100 px-4 py-2">
        <Search className="size-4 shrink-0 text-[#A2A2A2]" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder="Search..."
          onChange={(event) => {
            setQuery(event.target.value);
            setHiddenResultIds([]);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent text-sm text-black-500 outline-none placeholder:text-[#A2A2A2]"
        />
      </div>

      {open ? (
        <div
          className="absolute left-0 top-[calc(100%+10px)] z-[60] w-full min-w-[280px] 
        max-w-[320px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
        >
          {recent.length > 0 ? (
            <div className="border-b border-gray-100 px-4 pb-3 pt-4">
              <p className="text-[11px] font-medium tracking-wide text-neutral-400">
                RECENT
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {recent.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleRecentClick(term)}
                    className="rounded-full border border-gray-300 px-3 py-1 text-sm text-black-500 transition-colors hover:bg-gray-50"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <ul className="max-h-[280px] overflow-y-auto py-1">
            {results.length > 0 ? (
              results.map((user) => (
                <li key={user.id}>
                  <div className="flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50">
                    <button
                      type="button"
                      onClick={() => handleSelect(user)}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    >
                      <Users className="size-4 shrink-0 text-neutral-500" />
                      <span className="truncate text-sm text-black-500">
                        {user.fullName}
                      </span>
                    </button>
                    <button
                      type="button"
                      aria-label={`Remove ${user.fullName} from results`}
                      onClick={() => handleDismissResult(user.id)}
                      className="flex size-7 shrink-0 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-gray-100 hover:text-neutral-600"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-6 text-center text-sm text-neutral-500">
                No users found for &ldquo;{query}&rdquo;
              </li>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
