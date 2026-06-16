import type { AdminSearchUser } from "@/types/admin";
import type { AdminUser } from "@/components/admin/users/users-table";

export const DEFAULT_ADMIN_RECENT_SEARCHES = [
  "Sarah Martin",
  "Folake",
] as const;

const EXTRA_SEARCH_USERS: AdminSearchUser[] = [
  { id: "x-sarah", fullName: "Sarah Martin", email: "sarah.martin@seil.app" },
  { id: "x-folake", fullName: "Folake", email: "folake@folakeandco.com" },
  { id: "x-s1", fullName: "Sophia Okolo", email: "sophia.okolo@seil.app" },
  { id: "x-s2", fullName: "Sophia Keturah", email: "sophia.keturah@seil.app" },
  { id: "x-s3", fullName: "Sophia Kehinde", email: "sophia.kehinde@seil.app" },
  { id: "x-s4", fullName: "Sophia Ijemama", email: "sophia.ijemama@seil.app" },
];

const DEFAULT_SUGGESTED_NAMES = [
  "Sophia Okolo",
  "Sophia Keturah",
  "Sophia Kehinde",
  "Sophia Ijemama",
] as const;

export type AdminUserProfile = AdminUser & {
  lastActive: string;
  signupFull: string;
  documents: { name: string; size: string }[];
  strategies: {
    id: string;
    title: string;
    source: "documents" | "questions";
    createdAt: string;
    info?: string;
    stages: {
      name: string;
      tasks: string;
      status: "complete" | "active" | "locked";
    }[];
  }[];
};

export const ADMIN_STUB_USERS: AdminUser[] = [
  {
    id: "1",
    name: "Folakemi Adeyemi",
    email: "Folake@folakeandco.com",
    plan: "Free",
    country: "Nigeria",
    status: "active",
    signupDate: "Mar 4",
  },
  {
    id: "2",
    name: "Adaeze Okoro",
    email: "a.okoro@sweetbites.ng",
    plan: "Pro",
    country: "Nigeria",
    status: "inactive",
    signupDate: "Mar 7",
  },
  {
    id: "3",
    name: "Priya Iyer",
    email: "priya@yogawithpriya.com",
    plan: "Pro",
    country: "Ghana",
    status: "active",
    signupDate: "Feb 22",
  },
  {
    id: "4",
    name: "Marcus Aboagye",
    email: "marcus@methodstudio.com",
    plan: "Free",
    country: "Benin Republic",
    status: "active",
    signupDate: "Feb 18",
  },
  {
    id: "5",
    name: "Daniel Otieno",
    email: "daniel@repairhub.ke",
    plan: "Free",
    country: "Cameroon",
    status: "active",
    signupDate: "Feb 14",
  },
  {
    id: "6",
    name: "Bright Smile Dental",
    email: "admin@brightsmile.com",
    plan: "Free",
    country: "Ghana",
    status: "active",
    signupDate: "Jan 30",
  },
  {
    id: "7",
    name: "Mama Dele Foods",
    email: "orders@mamadele.com",
    plan: "Pro",
    country: "Cameroon",
    status: "deleted",
    signupDate: "Feb 12",
  },
  {
    id: "8",
    name: "James Park",
    email: "james@parkplumbing.com",
    plan: "Pro",
    country: "Nigeria",
    status: "inactive",
    signupDate: "Mar 17",
  },
  {
    id: "9",
    name: "Imani Banda",
    email: "imani@brushflorals.co",
    plan: "Pro",
    country: "Nigeria",
    status: "active",
    signupDate: "Mar 10",
  },
];

const PROFILE_TEMPLATE: Omit<AdminUserProfile, keyof AdminUser> = {
  lastActive: "12 mins ago",
  signupFull: "Mar 4, 2026",
  documents: [
    { name: "Business requirement.pdf", size: "3.5 MB" },
    { name: "Business requirement.pdf", size: "1.5 MB" },
    { name: "Business requirement.pdf", size: "2.5 MB" },
  ],
  strategies: [
    {
      id: "s1",
      title: "I want to build a strategy for my small batch bakery",
      source: "documents",
      createdAt: "Mar 4, 2026",
      stages: [
        {
          name: "Get Noticed",
          tasks: "5/5 task this week",
          status: "complete",
        },
        {
          name: "Spark Interest",
          tasks: "7/10 task this week",
          status: "active",
        },
        {
          name: "Make first sale",
          tasks: "0/7 task this week",
          status: "locked",
        },
        {
          name: "Bring them back",
          tasks: "0/3 task this week",
          status: "locked",
        },
      ],
    },
    {
      id: "s2",
      title: "Social media platform isn't working for me",
      source: "questions",
      createdAt: "Mar 18, 2026",
      info: "I sell small chops and pastries for events and walk in customers who are typically Young women in Lagos who want affordable snacks. I get most of my customers from TikTok.",
      stages: [
        {
          name: "Get Noticed",
          tasks: "5/5 task this week",
          status: "complete",
        },
        {
          name: "Spark Interest",
          tasks: "7/10 task this week",
          status: "active",
        },
        {
          name: "Make first sale",
          tasks: "0/7 task this week",
          status: "locked",
        },
        {
          name: "Bring them back",
          tasks: "0/3 task this week",
          status: "locked",
        },
      ],
    },
    {
      id: "s3",
      title: "Grow my social media presence with reels",
      source: "documents",
      createdAt: "Mar 4, 2026",
      stages: [
        {
          name: "Get Noticed",
          tasks: "5/5 task this week",
          status: "complete",
        },
        {
          name: "Spark Interest",
          tasks: "7/10 task this week",
          status: "locked",
        },
        {
          name: "Make first sale",
          tasks: "0/7 task this week",
          status: "locked",
        },
        {
          name: "Bring them back",
          tasks: "0/3 task this week",
          status: "locked",
        },
      ],
    },
  ],
};

function buildProfile(base: AdminUser): AdminUserProfile {
  return {
    ...PROFILE_TEMPLATE,
    ...base,
    documents: [...PROFILE_TEMPLATE.documents],
    strategies: PROFILE_TEMPLATE.strategies.map((strategy) => ({
      ...strategy,
      stages: strategy.stages.map((stage) => ({ ...stage })),
    })),
  };
}

function tableUsersAsSearchResults(): AdminSearchUser[] {
  return ADMIN_STUB_USERS.map((user) => ({
    id: user.id,
    fullName: user.name,
    email: user.email,
  }));
}

/** All users available in admin navbar search (mock). */
export function getAdminSearchDirectory(): AdminSearchUser[] {
  return [...tableUsersAsSearchResults(), ...EXTRA_SEARCH_USERS];
}

/** Filter admin search directory (mock). */
export function searchAdminUsers(query: string): AdminSearchUser[] {
  const directory = getAdminSearchDirectory();
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return directory.filter((user) =>
      DEFAULT_SUGGESTED_NAMES.includes(
        user.fullName as (typeof DEFAULT_SUGGESTED_NAMES)[number],
      ),
    );
  }

  return directory.filter(
    (user) =>
      user.fullName.toLowerCase().includes(normalized) ||
      user.email.toLowerCase().includes(normalized),
  );
}

/** Resolve mock admin user profile by id (users table + search directory). */
export function getAdminUserProfile(userId: string): AdminUserProfile | null {
  const tableUser = ADMIN_STUB_USERS.find((user) => user.id === userId);
  if (tableUser) {
    return buildProfile(tableUser);
  }

  const searchUser = getAdminSearchDirectory().find(
    (user) => user.id === userId,
  );
  if (!searchUser) {
    return null;
  }

  return buildProfile({
    id: searchUser.id,
    name: searchUser.fullName,
    email: searchUser.email,
    plan: "Free",
    country: "Nigeria",
    status: "active",
    signupDate: "Mar 4",
  });
}
