"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InviteRoleSelect } from "@/components/admin/teams/invite-role-select";
import { useSendInviteMutation } from "@/hooks/mutations/use-admin-team-mutations";
import type { InviteRole } from "@/types/admin";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function InviteByEmail({ teamId }: { teamId: string }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<InviteRole>("admin");
  const [touched, setTouched] = useState(false);
  const sendInvite = useSendInviteMutation(teamId);

  const isValid = EMAIL_PATTERN.test(email.trim());

  function handleSend() {
    setTouched(true);
    if (!isValid) return;
    sendInvite.mutate(
      { email: email.trim(), role },
      { onSuccess: () => setEmail("") },
    );
  }

  return (
    <div className="rounded-2xl border border-[#EAECF0] bg-white p-5 sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-medium text-black-500">By email</h3>
        <InviteRoleSelect
          value={role}
          onChange={setRole}
          id="invite-email-role"
        />
      </div>

      <Input
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="name@gmail.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        onBlur={() => setTouched(true)}
        aria-invalid={touched && !isValid}
        className="h-12 rounded-xl border-[#EAECF0]"
      />
      {touched && !isValid ? (
        <p className="mt-1.5 text-xs text-red-500">
          Enter a valid email address.
        </p>
      ) : null}

      <div className="mt-4 flex justify-end">
        <Button
          type="button"
          onClick={handleSend}
          disabled={sendInvite.isPending}
          className="h-11 rounded-xl px-6"
        >
          {sendInvite.isPending ? "Sending…" : "Send invite"}
        </Button>
      </div>
    </div>
  );
}
