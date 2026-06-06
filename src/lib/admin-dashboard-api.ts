import { adminGatewayFetch } from "@/lib/admin-api-client";
import type {
  AdminDashboardData,
  ChartSegment,
  UserTenureBucket,
} from "@/types/admin";

const STAGE_COLORS = [
  "#4CAF50",
  "#FB8C00",
  "#4285F4",
  "#26C6DA",
  "#FF8A80",
  "#D946EF",
];

const RETENTION_COLORS = [
  "#40747F",
  "#9BE7E8",
  "#EEAACC",
  "#9C83F7",
  "#5C6BC0",
];

/** Stable donut legend order for known lifecycle stage keys. */
const STAGE_ID_BY_KEY: Record<string, string> = {
  signedUp: "signed-up",
  signed_up: "signed-up",
  intakeDone: "intake-done",
  intake_done: "intake-done",
  createdStrategies: "created-strategies",
  created_strategies: "created-strategies",
  stage1Active: "stage-1",
  stage_1_active: "stage-1",
  stage2Active: "stage-2",
  stage_2_active: "stage-2",
  stage3Active: "stage-3",
  stage_3_active: "stage-3",
};

const STAGE_COLOR_BY_KEY: Record<string, string> = {
  signedUp: STAGE_COLORS[0],
  signed_up: STAGE_COLORS[0],
  intakeDone: STAGE_COLORS[1],
  intake_done: STAGE_COLORS[1],
  createdStrategies: STAGE_COLORS[2],
  created_strategies: STAGE_COLORS[2],
  stage1Active: STAGE_COLORS[3],
  stage_1_active: STAGE_COLORS[3],
  stage2Active: STAGE_COLORS[4],
  stage_2_active: STAGE_COLORS[4],
  stage3Active: STAGE_COLORS[5],
  stage_3_active: STAGE_COLORS[5],
};

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
};

type DashboardStats = {
  totalUsers: number;
  activeUsers: number;
  totalFunnelsGenerated: number;
  funnelsThisWeek: number;
  planDistribution?: PlanDistribution;
};

type PlanDistribution = {
  free: number;
  pro: number;
};

type WeeklyOverview = {
  date: string;
  newUsers: number;
  funnelsGenerated: number;
};

type UserStageItem = {
  stage: string;
  label: string;
  count: number;
};

type RetentionBandItem = {
  band: string;
  label: string;
  count: number;
};

async function fetchAdminEndpoint<T>(path: string): Promise<T> {
  const res = await adminGatewayFetch(path);
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? `Request failed (${res.status})`);
  }
  const body = (await res.json()) as ApiEnvelope<T> | T;
  if (body && typeof body === "object" && "data" in body) {
    return (body as ApiEnvelope<T>).data as T;
  }
  return body as T;
}

function parseStatsPayload(raw: unknown): DashboardStats {
  const record = (raw ?? {}) as Record<string, unknown>;
  const planRaw = (record.planDistribution ?? record.plan_distribution) as
    | Record<string, unknown>
    | undefined;

  return {
    totalUsers: Number(record.totalUsers ?? record.total_users ?? 0),
    activeUsers: Number(record.activeUsers ?? record.active_users ?? 0),
    totalFunnelsGenerated: Number(
      record.totalFunnelsGenerated ?? record.total_funnels_generated ?? 0,
    ),
    funnelsThisWeek: Number(
      record.funnelsThisWeek ?? record.funnels_this_week ?? 0,
    ),
    planDistribution: planRaw
      ? {
          free: Number(planRaw.free ?? 0),
          pro: Number(planRaw.pro ?? 0),
        }
      : undefined,
  };
}

function parseArrayPayload<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (
    data &&
    typeof data === "object" &&
    Array.isArray((data as { data?: unknown }).data)
  ) {
    return (data as { data: T[] }).data;
  }
  return [];
}

function slugifyKey(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/_/g, "-")
    .toLowerCase();
}

function mapUserStages(items: UserStageItem[]): ChartSegment[] {
  return items
    .map((item, index) => {
      const count = Number(item.count);
      if (!Number.isFinite(count) || count <= 0) return null;

      const stageKey = item.stage?.trim() ?? "";
      return {
        id:
          STAGE_ID_BY_KEY[stageKey] ?? slugifyKey(stageKey || `stage-${index}`),
        label: item.label?.trim() || stageKey || `Stage ${index + 1}`,
        value: count,
        color:
          STAGE_COLOR_BY_KEY[stageKey] ??
          STAGE_COLORS[index % STAGE_COLORS.length],
      };
    })
    .filter((segment): segment is ChartSegment => segment !== null);
}

function mapUserRetention(items: RetentionBandItem[]): UserTenureBucket[] {
  return items
    .map((item, index) => {
      const count = Number(item.count);
      if (!Number.isFinite(count) || count <= 0) return null;

      const bandKey = item.band?.trim() ?? "";
      return {
        id: slugifyKey(bandKey || `band-${index}`),
        label: item.label?.trim() || bandKey || `Band ${index + 1}`,
        value: count,
        color: RETENTION_COLORS[index % RETENTION_COLORS.length],
      };
    })
    .filter((bucket): bucket is UserTenureBucket => bucket !== null);
}

function mapPlanDistribution(plan?: PlanDistribution): ChartSegment[] {
  if (!plan) return [];

  const segments: ChartSegment[] = [];
  if (plan.free > 0) {
    segments.push({
      id: "free",
      label: "Free plan users",
      value: plan.free,
      color: "#FBC02D",
    });
  }
  if (plan.pro > 0) {
    segments.push({
      id: "pro",
      label: "Pro plan users",
      value: plan.pro,
      color: "#4FC3F7",
    });
  }
  return segments;
}

/** Fetches and composes dashboard data from admin dashboard endpoints. */
export async function fetchAdminDashboard(): Promise<AdminDashboardData> {
  const [statsRaw, weekly, userStagesRaw, userRetentionRaw] = await Promise.all(
    [
      fetchAdminEndpoint<unknown>("dashboard/stats"),
      fetchAdminEndpoint<WeeklyOverview[]>("dashboard/weekly-overview"),
      fetchAdminEndpoint<unknown>("dashboard/user-stages"),
      fetchAdminEndpoint<unknown>("dashboard/user-retention"),
    ],
  );

  const stats = parseStatsPayload(statsRaw);
  const totalUsers = stats.totalUsers;
  const weeklyRows = weekly ?? [];
  const signUpTotal = weeklyRows.reduce((sum, row) => sum + row.newUsers, 0);
  const userStages = mapUserStages(
    parseArrayPayload<UserStageItem>(userStagesRaw),
  );
  const userRetention = mapUserRetention(
    parseArrayPayload<RetentionBandItem>(userRetentionRaw),
  );
  const planSegments = mapPlanDistribution(stats.planDistribution);
  const planTotal = planSegments.reduce(
    (sum, segment) => sum + segment.value,
    0,
  );

  return {
    metrics: [
      {
        id: "total-users",
        label: "Total Users",
        value: stats.totalUsers,
        changePercent: 0,
        trend: "up",
      },
      {
        id: "active-users",
        label: "Active Users",
        value: stats.activeUsers,
        changePercent: 0,
        trend: "up",
      },
      {
        id: "funnels-generated",
        label: "Funnels Generated",
        value: stats.totalFunnelsGenerated,
        changePercent: 0,
        trend: "up",
      },
      {
        id: "funnels-week",
        label: "Funnels This Week",
        value: stats.funnelsThisWeek,
        changePercent: 0,
        trend: "up",
      },
    ],
    signUps: {
      weeks: weeklyRows.map((row, index) => ({
        week: `W${index + 1}`,
        signUps: row.newUsers,
      })),
      total: signUpTotal,
      periodLabel: "Last 7 weeks",
    },
    userStages: {
      total: totalUsers,
      subtitle:
        totalUsers > 0
          ? `All ${totalUsers} users by current activity`
          : "User stages",
      segments: userStages,
    },
    planDistribution: {
      total: planTotal,
      subtitle: planTotal > 0 ? "Free vs Pro breakdown" : "Plan distribution",
      segments: planSegments,
    },
    userTenure: {
      total: totalUsers,
      subtitle: "How long users stay active after signing up.",
      buckets: userRetention,
    },
    recentActivity: [],
  };
}
