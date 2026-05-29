"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { setReturnToPath } from "@/lib/return-to-storage";

//  Mount once inside the dashboard layout. On every dashboard route change it
//  Anything outside `/dashboard/*` is ignored.

export function useTrackReturnToPath() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") return;
    if (!pathname) return;

    if (!pathname.startsWith("/dashboard")) return;

    const email = session?.user?.email;
    if (!email) return;

    const query = searchParams?.toString();
    const fullPath = query ? `${pathname}?${query}` : pathname;

    setReturnToPath(fullPath, email);
  }, [pathname, searchParams, status, session?.user?.email]);
}
