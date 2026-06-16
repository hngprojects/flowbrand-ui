export type AcceptTeamInviteInput = {
  token: string;
  full_name?: string;
  password?: string;
  confirm_password?: string;
};

export type AcceptTeamInviteResult = {
  teamName?: string;
  teamId?: string;
  message?: string;
};

/**
 * Stub — backend POST /api/admin/teams/invitations/accept is not live yet.
 * Wire to /api/admin/accept-invite when the endpoint ships.
 */
export async function acceptTeamInvitation(
  _input: AcceptTeamInviteInput,
): Promise<AcceptTeamInviteResult> {
  void _input;
  throw new Error("Invite acceptance is not available yet.");
}
