"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InviteRoleSelect } from "@/components/admin/teams/invite-role-select";
import { useRegenerateInviteLinkMutation } from "@/hooks/mutations/use-admin-team-mutations";
import type { InviteLink, InviteRole } from "@/types/admin";

function roleLabel(role: InviteRole): string {
  if (role === "super_admin") return "a super admin";
  if (role === "owner") return "an owner";
  if (role === "dev") return "a dev";
  if (role === "designer") return "a designer";
  return "an admin";
}

/** Shareable invite link with role picker. */
export function InviteByLink({
  teamId,
  link,
}: {
  teamId: string;
  link: InviteLink;
}) {
  const [generatedLink, setGeneratedLink] = useState<InviteLink | null>(null);
  const [copied, setCopied] = useState(false);
  const regenerate = useRegenerateInviteLinkMutation(teamId);
  const activeLink = generatedLink ?? link;

  function handleRoleChange(nextRole: InviteRole) {
    regenerate.mutate(nextRole, {
      onSuccess: setGeneratedLink,
    });
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(activeLink.url);
      setCopied(true);
      toast.success("Invite link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy the link.");
    }
  }

  return (
    <div className="rounded-2xl border border-[#EAECF0] bg-white p-5 sm:p-6">
      <div className="mb-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-medium text-black-500">By link</h3>
        <InviteRoleSelect
          value={activeLink.role}
          onChange={handleRoleChange}
          id="invite-link-role"
        />
      </div>
      <p className="mb-4 text-xs text-neutral-500">
        Anyone with this link can join as {roleLabel(activeLink.role)}.{" "}
        {activeLink.expiresLabel}.
      </p>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          readOnly
          value={activeLink.url}
          aria-label="Invite link"
          className="h-12 min-w-0 rounded-xl border-[#EAECF0] text-neutral-500"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleCopy}
          disabled={regenerate.isPending}
          className="h-12 w-full shrink-0 rounded-xl px-5 sm:w-auto"
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
    </div>
  );
}
