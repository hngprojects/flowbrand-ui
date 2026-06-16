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

/** Portal access roles assignable via invite (matches team member roles). */
export type InviteRole = Exclude<TeamRole, "regular">;

export interface AdminTeam {
  id: string;
  name: string;
  description: string | null;
  status: string;
  createdAt: string;
  memberCount: number;
}

export interface AdminTeamsListResult {
  teams: AdminTeam[];
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export interface PendingInvite {
  id: string;
  email: string;
  role: InviteRole;
  /** Human-readable string, e.g. "was sent 2 days ago". */
  sentAgo: string;
  expiresAt?: string;
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

export interface ActivityLogEntry {
  id: string;
  user: {
    fullName: string;
    email: string;
    initials: string;
  };
  /** ISO timestamp; formatted for display in the table cell. */
  timestamp: string;
  /** Human-readable action label derived from the backend action_type. */
  action: string;
  ipAddress: string;
  /**
   * NOTE: the backend audit-log endpoint does not currently return location or
   * device. These stay optional so the table can render a placeholder and so
   * the mapper can pick them up automatically if the API adds them later.
   */
  location?: string;
  device?: string;
}

export type LogDateRange = "all" | "last_7_days" | "last_30_days" | "custom";

export interface ActivityLogData {
  entries: ActivityLogEntry[];
  page: number;
  perPage: number;
  totalPages: number;
  totalCount: number;
}

export type MetricTrend = "up" | "down";

export interface AdminMetricCard {
  id: string;
  label: string;
  value: number;
  changePercent: number;
  trend: MetricTrend;
}

export interface SignUpWeek {
  week: string;
  signUps: number;
}

export interface ChartSegment {
  id: string;
  label: string;
  value: number;
  color: string;
}

export interface UserTenureBucket {
  id: string;
  label: string;
  value: number;
  color: string;
}

export interface AdminSearchUser {
  id: string;
  fullName: string;
  email: string;
}

export type AdminRole = "admin" | "super_admin";

export interface AdminProfile {
  id: string;
  fullName: string;
  email: string;
  country: string;
  avatarUrl: string | null;
  role: AdminRole;
  createdAt: string;
}

export interface AdminDashboardData {
  metrics: AdminMetricCard[];
  signUps: {
    weeks: SignUpWeek[];
    total: number;
    periodLabel: string;
  };
  userStages: {
    total: number;
    subtitle: string;
    segments: ChartSegment[];
  };
  planDistribution: {
    total: number;
    subtitle: string;
    segments: ChartSegment[];
  };
  userTenure: {
    total: number;
    subtitle: string;
    buckets: UserTenureBucket[];
  };
  recentActivity: ActivityLogEntry[];
}
