"use client";

import Link from "next/link";
import { ADMIN_LOGIN_ROUTE } from "@/routes";

/**
 * Accept-invite UI placeholder.
 * Backend POST /api/admin/teams/invitations/accept is not live yet — do not wire
 * forms or API calls until that endpoint ships.
 */
export function AcceptInviteView() {
  return (
    <div className="w-full max-w-[520px] rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
      <h1 className="text-xl font-semibold text-primary-900">
        Accept team invitation
      </h1>
      <p className="mt-2 text-sm text-neutral-500">
        Invite acceptance is not available yet. Your team admin can add you
        directly from the admin portal once this flow is enabled.
      </p>
      <Link
        href={ADMIN_LOGIN_ROUTE}
        className="mt-6 inline-flex h-11 items-center rounded-lg bg-primary px-6 text-sm font-semibold text-white"
      >
        Go to admin login
      </Link>
    </div>
  );
}
