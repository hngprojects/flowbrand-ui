/** Backend access JWT lifetime (~14m). Refresh client-side tracking slightly early. */
export const ACCESS_TOKEN_LIFETIME_MS = 1000 * 60 * 14;

/** Refresh when within this window of client-side expiry. */
export const ACCESS_TOKEN_REFRESH_BUFFER_MS = 60_000;

/**
 * How often the browser re-fetches `/api/auth/session` (seconds).
 * Matches the 14m client lifetime minus the 1m refresh buffer (13m interval).
 */
export const SESSION_REFETCH_INTERVAL_S = 13 * 60;
