"use client";

import { Button } from "@/components/ui/button";
import { useRevokeInviteMutation } from "@/hooks/mutations/use-admin-team-mutations";
import type { PendingInvite } from "@/types/admin";

/** "Pending (n)" list with per-invite revoke. */
export function PendingInvites({ invites }: { invites: PendingInvite[] }) {
  const revoke = useRevokeInviteMutation();

  if (invites.length === 0) {
    return (
      <div className="rounded-xl border border-gray-300 p-4 sm:p-5">
        <h3 className="text-sm font-medium text-black-500">Pending (0)</h3>
        <p className="mt-2 text-sm text-neutral-500">
          No pending invites right now.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-300 p-4 sm:p-5">
      <h3 className="mb-3 text-sm font-medium text-black-500">
        Pending ({invites.length})
      </h3>
      <ul className="flex flex-col gap-3">
        {invites.map((invite) => (
          <li
            key={invite.id}
            className="flex items-center justify-between gap-4"
          >
            <div className="min-w-0">
              <p className="truncate text-sm text-black-500">{invite.email}</p>
              <p className="text-xs text-neutral-500">{invite.sentAgo}</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => revoke.mutate(invite.id)}
              disabled={revoke.isPending}
              className="text-red-500 hover:text-red-600"
            >
              Revoke
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
