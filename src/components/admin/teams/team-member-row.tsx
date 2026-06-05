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
    <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-4 border-b border-gray-300 px-4 py-3.5 last:border-b-0">
      <div className="flex min-w-0 items-center gap-3">
        <AdminAvatar initials={member.initials} seed={member.id} />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-black-500">
            {member.fullName}
          </p>
          <p className="truncate text-xs text-neutral-500">{member.email}</p>
        </div>
      </div>

      <div className="flex justify-center">
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
            className="text-neutral-400 hover:text-red-500"
          >
            <Trash2 className="size-4 border-primary" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
