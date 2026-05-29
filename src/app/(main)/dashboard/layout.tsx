"use client";

import { Suspense } from "react";
import { useTrackReturnToPath } from "@/hooks/use-track-return-to-path";

/** Inner component because useTrackReturnToPath uses useSearchParams,
 *  which requires a Suspense boundary in app-router. */
function ReturnToPathTracker() {
  useTrackReturnToPath();
  return null;
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Suspense fallback={null}>
        <ReturnToPathTracker />
      </Suspense>
      {children}
    </>
  );
}
