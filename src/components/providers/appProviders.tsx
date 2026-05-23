"use client";

import { SessionProvider } from "next-auth/react";
import { GoogleSignInToast } from "@/components/auth/google-sign-in-toast";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/providers/query-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus={false} refetchInterval={0}>
      <QueryProvider>
        <GoogleSignInToast />
        {children}
        <Toaster richColors position="top-center" />
      </QueryProvider>
    </SessionProvider>
  );
}
