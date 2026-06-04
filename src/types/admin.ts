/**
 * Shared types for the Admin module — Teams, Invitations, and Logs.
 *
 * Owned by @A.Y Khalid. These mirror the shapes the backend is expected to
 * return once the Teams/Invitations/Logs endpoints exist. Until then they are
 * fed by typed mock data (see `@/lib/admin-mock-data`) so the UI and the data
 * hooks can be built and swapped to live endpoints with no component changes.
 */

export type TeamRole =
  | "owner"
  | "super_admin"
  | "admin"
  | "regular"
  | "designer"
  | "dev";

export interface TeamMember {
  id: string;
  fullName: string;
  email: string;
  /** Two-letter initials shown in the avatar, e.g. "SM". */
  initials: string;
  role: TeamRole;
  /** Human-readable presence string, e.g. "Active now", "Active 3 days ago". */
  activity: string;
  /** Whether the current admin may remove this member (owner is not removable). */
  removable: boolean;
}

export interface TeamMembersData {
  teamName: string;
  members: TeamMember[];
}

export type InviteRole = Extract<
  TeamRole,
  "admin" | "regular" | "designer" | "dev"
>;

export interface PendingInvite {
  id: string;
  email: string;
  role: InviteRole;
  /** Human-readable string, e.g. "was sent 2 days ago". */
  sentAgo: string;
}

export interface InviteLink {
  /** The shareable join URL. */
  url: string;
  role: InviteRole;
  /** Human-readable expiry, e.g. "Expires in 7 days". */
  expiresLabel: string;
}

export interface InvitesData {
  link: InviteLink;
  pending: PendingInvite[];
}

export type LogAction =
  | "Signed in"
  | "Signed up"
  | "Invited a team"
  | "Copied invite link"
  | "Edited profile";

export interface ActivityLogEntry {
  id: string;
  user: {
    fullName: string;
    email: string;
    initials: string;
  };
  /** ISO timestamp; formatted for display in the table cell. */
  timestamp: string;
  action: LogAction;
  ipAddress: string;
  location: string;
  device: string;
}

export type LogDateRange = "all" | "last_7_days" | "last_30_days" | "custom";

export interface ActivityLogData {
  entries: ActivityLogEntry[];
  page: number;
  perPage: number;
  totalPages: number;
  totalCount: number;
}
