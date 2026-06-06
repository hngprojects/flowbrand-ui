"use client";

import { format } from "date-fns";
import { AdminAvatar } from "@/components/admin/shared/admin-avatar";
import type { ActivityLogEntry } from "@/types/admin";

const COLUMNS = [
  "User",
  "Timestamp",
  "Action",
  "IP address",
  "Location",
  "Device",
];

function formatTimestamp(iso: string): string {
  try {
    return format(new Date(iso), "MMM d, yyyy, h:mm a");
  } catch {
    return iso;
  }
}

/** The activity log data grid (User, Timestamp, Action, IP, Location, Device). */
export function ActivityLogTable({
  entries,
  isLoading,
}: {
  entries: ActivityLogEntry[];
  isLoading?: boolean;
}) {
  return (
    <div className="mb-6 w-full overflow-x-auto sm:mb-18">
      <table className="w-full min-w-[820px] border-collapse text-left">
        <thead>
          <tr>
            {COLUMNS.map((column) => (
              <th
                key={column}
                scope="col"
                className="px-4 py-3 text-[14px] font-[500] tracking-wide text-[#606060] uppercase"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 9 }).map((_, index) => (
              <tr key={index} className="border-b border-gray-300">
                <td className="px-4 py-3" colSpan={COLUMNS.length}>
                  <span className="block h-6 w-full animate-pulse rounded bg-gray-200" />
                </td>
              </tr>
            ))
          ) : entries.length === 0 ? (
            <tr>
              <td
                colSpan={COLUMNS.length}
                className="px-4 py-12 text-center text-sm text-neutral-500"
              >
                No activity yet
              </td>
            </tr>
          ) : (
            entries.map((entry) => (
              <tr
                key={entry.id}
                className="border-b border-gray-300 last:border-b-0"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <AdminAvatar initials={entry.user.initials} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-black-500">
                        {entry.user.fullName}
                      </p>
                      <p className="truncate text-xs text-neutral-500">
                        {entry.user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm whitespace-nowrap text-neutral-500">
                  {formatTimestamp(entry.timestamp)}
                </td>
                <td className="px-4 py-3 text-sm text-black-500">
                  {entry.action}
                </td>
                <td className="px-4 py-3 text-sm text-neutral-500">
                  {entry.ipAddress}
                </td>
                <td className="px-4 py-3 text-sm text-neutral-500">
                  {entry.location}
                </td>
                <td className="px-4 py-3 text-sm whitespace-nowrap text-neutral-500">
                  {entry.device}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
