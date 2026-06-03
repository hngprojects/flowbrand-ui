import { envConfig } from "@/config/env.config";

/** App runs on plain HTTP (typical `pnpm dev` on localhost). */
export function isLocalHttpApp(): boolean {
  try {
    const url = new URL(envConfig.APP_URL);
    return (
      url.protocol === "http:" &&
      (url.hostname === "localhost" ||
        url.hostname === "127.0.0.1" ||
        url.hostname.endsWith(".localhost"))
    );
  } catch {
    return false;
  }
}

/**
 * Staging/production APIs often return `Secure; SameSite=None; Domain=…`.
 * Browsers reject those on http://localhost, so refresh-token rotation breaks
 * and the session becomes invalid after the access token expires.
 */
export function normalizeAuthSetCookieHeader(header: string): string {
  if (!isLocalHttpApp()) return header;

  const parts = header.split(";").map((part) => part.trim());
  const kept: string[] = [];
  let hasSameSite = false;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const lower = part.toLowerCase();

    if (i === 0) {
      kept.push(part);
      continue;
    }
    if (lower === "secure") continue;
    if (lower.startsWith("domain=")) continue;
    if (lower.startsWith("samesite=")) {
      hasSameSite = true;
      kept.push("SameSite=Lax");
      continue;
    }
    kept.push(part);
  }

  if (!hasSameSite) {
    kept.push("SameSite=Lax");
  }

  return kept.join("; ");
}

type SetCookieTarget = {
  headers: { append: (name: string, value: string) => void };
};

export function appendAuthSetCookieHeaders(
  response: SetCookieTarget,
  headers: string[],
): void {
  for (const header of headers) {
    response.headers.append("Set-Cookie", normalizeAuthSetCookieHeader(header));
  }
}
