"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { getPostAuthRedirect } from "~/actions/auth";
import { clearForgotResetStorage } from "@/lib/forgot-password-storage";
import { clearRegisterVerifyEmail } from "@/lib/register-verify-storage";
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

  const entryQuery = useQuery({
    queryKey: queryKeys.auth.entryPath(),
    queryFn: () => getPostAuthRedirect(),
    enabled: isAuthenticated,
    staleTime: 60_000,
    retry: 1,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      redirectStarted.current = false;
      return;
    }

    if (redirectStarted.current || entryQuery.isPending || !entryQuery.data) {
      return;
    }

    redirectStarted.current = true;
    clearRegisterVerifyEmail();
    clearForgotResetStorage();
    flowLog("auth", "post-auth redirect", { path: entryQuery.data });
    router.replace(entryQuery.data);
  }, [isAuthenticated, entryQuery.isPending, entryQuery.data, router]);

  useEffect(() => {
    if (!entryQuery.isError) return;
    redirectStarted.current = false;
    if (process.env.NODE_ENV === "development") {
      console.warn("[auth] post-auth redirect failed", entryQuery.error);
    }
    clearRegisterVerifyEmail();
    clearForgotResetStorage();
    router.replace(ONBOARDING_UPLOAD_ROUTE);
  }, [entryQuery.isError, entryQuery.error, router]);
}
