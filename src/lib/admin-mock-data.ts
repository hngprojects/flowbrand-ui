/**
 * Typed mock data for the Admin module (Teams, Invitations, Logs).
 *
 * This is a temporary stand-in until the backend exposes the Teams /
 * Invitations / Logs endpoints. Each loader returns a Promise and is wired
 * through the query/mutation hooks, so switching to real network calls later
 * only touches those hooks — not the components.
 */

import type {
  ActivityLogData,
  ActivityLogEntry,
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

const TOTAL_LOG_PAGES = 10;

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

/** GET /admin/logs (mock) — paginated activity log. */
export function fetchActivityLog(page = 1): Promise<ActivityLogData> {
  const safePage = Math.min(Math.max(page, 1), TOTAL_LOG_PAGES);
  const entries = buildLogPage(safePage);
  // Derive perPage from the actual page contents so the pagination contract
  // stays internally consistent (totalCount = totalPages * perPage).
  const perPage = entries.length;
  return delay({
    entries,
    page: safePage,
    perPage,
    totalPages: TOTAL_LOG_PAGES,
    totalCount: TOTAL_LOG_PAGES * perPage,
  });
}
