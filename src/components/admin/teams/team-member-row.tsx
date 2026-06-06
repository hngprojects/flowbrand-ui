"use client";

import { Trash2 } from "lucide-react";
import { AdminAvatar } from "@/components/admin/shared/admin-avatar";
import { RoleBadge } from "@/components/admin/teams/role-badge";
import { Button } from "@/components/ui/button";
import type { TeamMember } from "@/types/admin";

interface TeamMemberRowProps {
  member: TeamMember;
  onDelete: (member: TeamMember) => void;
}

export function TeamMemberRow({ member, onDelete }: TeamMemberRowProps) {
  return (
    <div
      role="row"
      className="flex flex-col gap-3 border-b border-[#EAECF0] px-4 py-4 last:border-b-0 sm:grid sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-center sm:gap-4 sm:px-5"
    >
      <div role="cell" className="flex min-w-0 items-center gap-3">
        <AdminAvatar initials={member.initials} />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-black-500">
            {member.fullName}
          </p>
          <p className="truncate text-xs text-neutral-500">{member.email}</p>
        </div>
      </div>

      <div
        role="cell"
        className="flex items-center justify-between gap-3 sm:contents"
      >
        <div className="flex justify-start sm:justify-center">
          <RoleBadge role={member.role} />
        </div>

        <p className="text-sm text-neutral-500">{member.activity}</p>

        <div className="flex w-9 justify-end">
          {member.removable ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Remove ${member.fullName}`}
              onClick={() => onDelete(member)}
              className="text-red-400 hover:bg-transparent hover:text-red-500"
            >
              <Trash2 className="size-4" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
