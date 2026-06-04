import { signOut } from "next-auth/react";

const CLIENT_LOGOUT_TIMEOUT_MS = 15_000;

export type ClientLogoutOptions = {
  callbackUrl?: string;
  redirect?: boolean;
};

/** Revoke backend refresh session, then clear the NextAuth session. */
export async function performClientLogout(
  options: ClientLogoutOptions = {},
): Promise<void> {
  const { callbackUrl = "/login", redirect = true } = options;

  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
      signal: AbortSignal.timeout(CLIENT_LOGOUT_TIMEOUT_MS),
    });
  } catch {
    // Still clear the local Auth.js session.
  }

  try {
    if (redirect) {
      await signOut({ callbackUrl, redirect: true });
    } else {
      await signOut({ callbackUrl, redirect: false });
    }
  } catch {
    if (typeof window !== "undefined") {
      window.location.assign(callbackUrl);
    }
  }
}
