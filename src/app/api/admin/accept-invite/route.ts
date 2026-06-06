import { NextResponse } from "next/server";

/**
 * BFF stub for team invitation acceptance.
 * Backend POST /api/admin/teams/invitations/accept is not live yet — intentionally
 * returns 501 until the endpoint is available.
 */
export async function POST() {
  return NextResponse.json(
    { message: "Invite acceptance is not available yet." },
    { status: 501 },
  );
}
