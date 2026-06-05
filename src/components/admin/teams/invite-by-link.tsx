"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InviteRoleSelect } from "@/components/admin/teams/invite-role-select";
import type { InviteLink, InviteRole } from "@/types/admin";

/** "By link" invite panel: role picker + shareable link + copy. */
export function InviteByLink({ link }: { link: InviteLink }) {
  const [role, setRole] = useState<InviteRole>(link.role);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link.url);
      setCopied(true);
      toast.success("Invite link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy the link.");
    }
  }

  return (
    <div className="rounded-xl border border-gray-300 p-4 sm:p-5">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-sm font-medium text-black-500">By link</h3>
        <InviteRoleSelect
          value={role}
          onChange={setRole}
          id="invite-link-role"
        />
      </div>
      <p className="mb-3 text-xs text-neutral-500">
        Anyone with this link can join as an admin. {link.expiresLabel}.
      </p>

      <div className="flex items-center gap-2">
        <Input
          readOnly
          value={link.url}
          aria-label="Invite link"
          className="h-11 rounded-lg text-neutral-500"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleCopy}
          className="h-11 shrink-0 rounded-lg"
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
    </div>
  );
}
