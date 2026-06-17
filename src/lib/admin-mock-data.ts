/**
 * Typed mock data for the Admin module (Teams, Invitations, Logs).
 *
 * This is a temporary stand-in until the backend exposes the Teams /
 * Invitations / Logs endpoints. Each loader returns a Promise and is wired
 * through the query/mutation hooks, so switching to real network calls later
 * only touches those hooks — not the components.
 */

import type {
  ActivityLogEntry,
  AdminDashboardData,
  InvitesData,
  TeamMembersData,
} from "@/types/admin";

const SIMULATED_LATENCY_MS = 250;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(value), SIMULATED_LATENCY_MS),
  );
}

/** Derive two-letter initials from a full name. */
export function toInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return (first + last).toUpperCase();
}

const TEAM: TeamMembersData = {
  teamName: "Admin team",
  members: [
    {
      id: "tm-1",
      fullName: "Sarah Mensah",
      email: "sarah@seil.app",
      initials: "SM",
      role: "owner",
      activity: "Active now",
      removable: false,
    },
    {
      id: "tm-2",
      fullName: "Tomi Adekunle",
      email: "tomi@seil.app",
      initials: "TA",
      role: "super_admin",
      activity: "Active 1 hour ago",
      removable: true,
    },
    {
      id: "tm-3",
      fullName: "Reuben Carter",
      email: "reuben@seil.app",
      initials: "RC",
      role: "admin",
      activity: "Active 1 hour ago",
      removable: true,
    },
    {
      id: "tm-4",
      fullName: "Mei Chen",
      email: "mei@seil.app",
      initials: "MC",
      role: "regular",
      activity: "Active yesterday",
      removable: true,
    },
    {
      id: "tm-5",
      fullName: "Olu Bankole",
      email: "olu@seil.app",
      initials: "OB",
      role: "admin",
      activity: "Active 3 days ago",
      removable: true,
    },
    {
      id: "tm-6",
      fullName: "Olu Bankole",
      email: "olu@seil.app",
      initials: "OB",
      role: "regular",
      activity: "Active 3 days ago",
      removable: true,
    },
    {
      id: "tm-7",
      fullName: "Olu Bankole",
      email: "olu@seil.app",
      initials: "OB",
      role: "designer",
      activity: "Active 3 days ago",
      removable: true,
    },
    {
      id: "tm-8",
      fullName: "Olu Bankole",
      email: "olu@seil.app",
      initials: "OB",
      role: "admin",
      activity: "Active 3 days ago",
      removable: true,
    },
    {
      id: "tm-9",
      fullName: "Olu Bankole",
      email: "olu@seil.app",
      initials: "OB",
      role: "regular",
      activity: "Active 3 days ago",
      removable: true,
    },
    {
      id: "tm-10",
      fullName: "Olu Bankole",
      email: "olu@seil.app",
      initials: "OB",
      role: "dev",
      activity: "Active 3 days ago",
      removable: true,
    },
    {
      id: "tm-11",
      fullName: "Olu Bankole",
      email: "olu@seil.app",
      initials: "OB",
      role: "admin",
      activity: "Active 3 days ago",
      removable: true,
    },
    {
      id: "tm-12",
      fullName: "Olu Bankole",
      email: "olu@seil.app",
      initials: "OB",
      role: "regular",
      activity: "Active 3 days ago",
      removable: true,
    },
    {
      id: "tm-13",
      fullName: "Olu Bankole",
      email: "olu@seil.app",
      initials: "OB",
      role: "regular",
      activity: "Active 3 days ago",
      removable: true,
    },
  ],
};

const INVITES: InvitesData = {
  link: {
    url: "app.seil.brand/inviteadmin/qx7k-9mnv-3p2r94ujr",
    role: "admin",
    expiresLabel: "Expires in 7 days",
  },
  pending: [
    {
      id: "pi-1",
      email: "iviemamanduke@gmail.com",
      role: "admin",
      sentAgo: "was sent 2 days ago",
    },
    {
      id: "pi-2",
      email: "Terioluwa Hadassah@gmail.com",
      role: "admin",
      sentAgo: "was sent 2 days ago",
    },
  ],
};

const LOG_USERS: ActivityLogEntry["user"][] = [
  {
    fullName: "Folakemi Adeyemi",
    email: "folake@thelesandco.com",
    initials: "FA",
  },
  { fullName: "Adaeze Okoro", email: "a.okoro@sweetbliss.ng", initials: "AO" },
  { fullName: "Priya Iyer", email: "priya@vyganetthpriya.com", initials: "PI" },
  {
    fullName: "Marcus Aboagye",
    email: "marcus@redhotstudio.com",
    initials: "MA",
  },
  { fullName: "Daniel Otieno", email: "daniel@squimub.ke", initials: "DO" },
  {
    fullName: "Bright Smile Dental",
    email: "admin@brightsmile.com",
    initials: "BS",
  },
  { fullName: "Mama Dele Foods", email: "orders@mamadele.com", initials: "DF" },
  { fullName: "James Park", email: "james@parkplumbing.com", initials: "DF" },
  { fullName: "Imani Banda", email: "imani@brushfloral.co", initials: "DF" },
];

const LOG_ACTIONS: ActivityLogEntry["action"][] = [
  "Signed in",
  "Invited a team",
  "Copied invite link",
  "Signed in",
  "Edited profile",
  "Signed in",
  "Invited a team",
  "Copied invite link",
  "Signed up",
];

const LOG_LOCATIONS = [
  "Lagos, NG",
  "Abuja, NG",
  "Enugu, NG",
  "Lagos, NG",
  "Abuja, NG",
  "Enugu, NG",
  "Lagos, NG",
  "Abuja, NG",
  "Enugu, NG",
];
const LOG_DEVICES = [
  "Chrome 134 · macOS 15.3",
  "Firefox 132 · macOS 15.3",
  "Chrome 134 · macOS 15.3",
  "Safari 19 · macOS 15.3",
  "Chrome 134 · macOS 15.3",
  "Chrome 134 · macOS 15.3",
  "Safari 19 · macOS 15.3",
  "Chrome 134 · macOS 15.3",
  "Safari 19 · macOS 15.3",
];

function buildLogPage(page: number): ActivityLogEntry[] {
  return LOG_USERS.map((user, index) => ({
    id: `log-${page}-${index}`,
    user,
    timestamp: "2026-05-13T12:20:00.000Z",
    action: LOG_ACTIONS[index % LOG_ACTIONS.length],
    ipAddress: "177.94.12.88",
    location: LOG_LOCATIONS[index % LOG_LOCATIONS.length],
    device: LOG_DEVICES[index % LOG_DEVICES.length],
  }));
}

/** GET /admin/teams (mock) — the Admin team member list. */
export function fetchTeamMembers(): Promise<TeamMembersData> {
  return delay({ ...TEAM, members: [...TEAM.members] });
}

/** GET /admin/teams/invites (mock) — invite link + pending invites. */
export function fetchInvites(): Promise<InvitesData> {
  return delay({ ...INVITES, pending: [...INVITES.pending] });
}

const DASHBOARD_SIGN_UPS = [
  { week: "W1", signUps: 38 },
  { week: "W2", signUps: 78 },
  { week: "W3", signUps: 25 },
  { week: "W4", signUps: 98 },
  { week: "W5", signUps: 80 },
  { week: "W6", signUps: 45 },
  { week: "W7", signUps: 92 },
] as const;

const DASHBOARD_DATA: AdminDashboardData = {
  metrics: [
    {
      id: "views",
      label: "Views",
      value: 965,
      changePercent: 11.01,
      trend: "up",
    },
    {
      id: "visits",
      label: "Visits",
      value: 571,
      changePercent: 0.03,
      trend: "down",
    },
    {
      id: "total-users",
      label: "Total Users",
      value: 184,
      changePercent: 15.03,
      trend: "up",
    },
    {
      id: "active-users",
      label: "Active Users",
      value: 142,
      changePercent: 6.08,
      trend: "up",
    },
  ],
  signUps: {
    weeks: [...DASHBOARD_SIGN_UPS],
    total: DASHBOARD_SIGN_UPS.reduce((sum, row) => sum + row.signUps, 0),
    periodLabel: "Last 7 weeks",
  },
  userStages: {
    total: 184,
    subtitle: "All 184 users by current activity",
    segments: [
      { id: "stage-3", label: "Stage 3 active", value: 14, color: "#D946EF" },
      { id: "signed-up", label: "Signed up", value: 184, color: "#4CAF50" },
      {
        id: "created-strategies",
        label: "Created strategies",
        value: 138,
        color: "#4285F4",
      },
      { id: "intake-done", label: "Intake done", value: 142, color: "#FB8C00" },
      { id: "stage-1", label: "Stage 1 active", value: 42, color: "#26C6DA" },
      { id: "stage-2", label: "Stage 2 active", value: 20, color: "#FF8A80" },
    ],
  },
  planDistribution: {
    total: 184,
    subtitle: "Free vs Pro breakdown",
    segments: [
      { id: "free", label: "Free plan users", value: 140, color: "#FBC02D" },
      { id: "pro", label: "Pro plan users", value: 44, color: "#4FC3F7" },
    ],
  },
  userTenure: {
    total: 184,
    subtitle: "How long users stay active after signing up.",
    buckets: [
      { id: "lt-1w", label: "< 1 week", value: 184, color: "#40747F" },
      { id: "1-4w", label: "1-4 weeks", value: 93, color: "#9BE7E8" },
      { id: "1-3m", label: "1-3 months", value: 64, color: "#EEAACC" },
      { id: "3m-plus", label: "3+ months", value: 42, color: "#9C83F7" },
    ],
  },
  recentActivity: buildLogPage(1).slice(0, 4),
};

/** GET /admin/dashboard (mock) — overview metrics and charts. */
export function fetchAdminDashboard(): Promise<AdminDashboardData> {
  return delay(structuredClone(DASHBOARD_DATA));
}
