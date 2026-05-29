"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { getPostAuthRedirect } from "~/actions/auth";
import { clearForgotResetStorage } from "@/lib/forgot-password-storage";
import { clearRegisterVerifyEmail } from "@/lib/register-verify-storage";
import { clearReturnToPath, getReturnToPath } from "@/lib/return-to-storage";
import { queryKeys } from "@/lib/query-keys";
import { ONBOARDING_UPLOAD_ROUTE } from "@/routes";
import { flowLog } from "@/lib/flow-debug-log";

/** After sign-in, resolve onboarding vs strategy once the client session is ready. */
export function usePostAuthRedirect() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const redirectStarted = useRef(false);

  const isAuthenticated =
    status === "authenticated" &&
    session?.invalid !== true &&
    !!session?.user?.id;

  // If we have a remembered dashboard path for THIS user, prefer it over the
  // backend-driven default. This is what powers "return to where they were".
  // Read once per render — getReturnToPath() also enforces the email match.
  const userEmail = session?.user?.email ?? "";
  const remembered =
    isAuthenticated && userEmail ? getReturnToPath(userEmail) : null;

  const entryQuery = useQuery({
    queryKey: queryKeys.auth.entryPath(),
    queryFn: () => getPostAuthRedirect(),
    // Skip the backend resolver entirely when we already know where to go.
    enabled: isAuthenticated && !remembered,
    staleTime: 60_000,
    retry: 1,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      redirectStarted.current = false;
      return;
    }

    if (redirectStarted.current) return;

    // Path 1 — we remembered where they were. Use it, then clear so a future
    // login that happens to follow a different flow isn't stuck on it.
    if (remembered) {
      redirectStarted.current = true;
      clearRegisterVerifyEmail();
      clearForgotResetStorage();
      clearReturnToPath();
      flowLog("auth", "post-auth redirect (remembered)", { path: remembered });
      router.replace(remembered);
      return;
    }

    // Path 2 — fall back to backend resolver.
    if (entryQuery.isPending || !entryQuery.data) return;

    redirectStarted.current = true;
    clearRegisterVerifyEmail();
    clearForgotResetStorage();
    flowLog("auth", "post-auth redirect", { path: entryQuery.data });
    router.replace(entryQuery.data);
  }, [
    isAuthenticated,
    remembered,
    entryQuery.isPending,
    entryQuery.data,
    router,
  ]);

  useEffect(() => {
    if (!entryQuery.isError) return;
    redirectStarted.current = false;
    if (process.env.NODE_ENV === "development") {
      console.warn("[auth] post-auth redirect failed", entryQuery.error);
    }
    clearRegisterVerifyEmail();
    clearForgotResetStorage();
    clearReturnToPath();
    router.replace(ONBOARDING_UPLOAD_ROUTE);
  }, [entryQuery.isError, entryQuery.error, router]);
}
