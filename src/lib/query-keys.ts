export const queryKeys = {
  auth: {
    entryPath: () => ["auth", "entry-path"] as const,
  },
  onboarding: {
    all: () => ["onboarding"] as const,
    session: (scope: "default" | "new-strategy" = "default") =>
      ["onboarding", "session", scope] as const,
  },
  funnels: {
    all: () => ["funnels"] as const,
    list: (page = 1) => ["funnels", "list", page] as const,
    detail: (funnelId: string) => ["funnels", "detail", funnelId] as const,
    generationStatus: (funnelId: string) =>
      ["funnels", "generation-status", funnelId] as const,
    display: (funnelId: string) => ["funnels", "display", funnelId] as const,
  },
  uploads: {
    progress: (uploadId: string) => ["uploads", "progress", uploadId] as const,
  },
} as const;
