/** Backend access JWT lifetime (~15m). Refresh client-side tracking slightly early. */
export const ACCESS_TOKEN_LIFETIME_MS = 1000 * 60 * 14;

/** Refresh when within this window of client-side expiry. */
export const ACCESS_TOKEN_REFRESH_BUFFER_MS = 60_000;

/**
 * How often the browser re-fetches `/api/auth/session` (seconds).
 * Aligned with the client-side refresh window (~13m before access JWT expiry).
 */
export const SESSION_REFETCH_INTERVAL_S = 13 * 60;
