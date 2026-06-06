"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RevokeAccessModal } from "@/components/admin/teams/revoke-access-modal";
import { useRevokeInviteMutation } from "@/hooks/mutations/use-admin-team-mutations";
import type { PendingInvite } from "@/types/admin";

export function PendingInvites({
  teamId,
  invites,
}: {
  teamId: string;
  invites: PendingInvite[];
}) {
  const revoke = useRevokeInviteMutation(teamId);
  const [revokeTarget, setRevokeTarget] = useState<PendingInvite | null>(null);

  function confirmRevoke() {
    if (!revokeTarget) return;
    revoke.mutate(revokeTarget.id, {
      onSuccess: () => setRevokeTarget(null),
    });
  }

  if (invites.length === 0) {
    return (
      <div className="rounded-2xl border border-[#EAECF0] bg-white p-5 sm:p-6">
        <h3 className="text-sm font-medium text-black-500">Pending (0)</h3>
        <p className="mt-2 text-sm text-neutral-500">
          No pending invites right now.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-[#EAECF0] bg-white p-5 sm:p-6">
        <h3 className="mb-4 text-sm font-medium text-black-500">
          Pending ({invites.length})
        </h3>
        <ul className="flex flex-col">
          {invites.map((invite, index) => (
            <li
              key={invite.id}
              className={
                index < invites.length - 1
                  ? "flex items-center justify-between gap-4 border-b border-[#EAECF0] py-4 first:pt-0 last:pb-0"
                  : "flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
              }
            >
              <div className="min-w-0">
                <p className="truncate text-sm text-black-500">
                  {invite.email}
                </p>
                <p className="text-xs text-neutral-500">{invite.sentAgo}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setRevokeTarget(invite)}
                disabled={revoke.isPending}
                className="text-red-500 hover:bg-transparent hover:text-red-600"
              >
                Revoke
              </Button>
            </li>
          ))}
        </ul>
      </div>

      <RevokeAccessModal
        open={Boolean(revokeTarget)}
        onOpenChange={(open) => {
          if (!open) setRevokeTarget(null);
        }}
        onConfirm={confirmRevoke}
        isRevoking={revoke.isPending}
        description={
          revokeTarget
            ? `Are you sure you want to revoke access for ${revokeTarget.email}?`
            : "Are you sure you want to revoke link access?"
        }
      />
    </>
  );
}
