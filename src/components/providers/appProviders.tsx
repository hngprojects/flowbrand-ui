"use client";

import { SessionProvider } from "next-auth/react";
import { GoogleSignInToast } from "@/components/auth/google-sign-in-toast";
import { Toaster } from "@/components/ui/sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <GoogleSignInToast />
      {children}
      <Toaster richColors position="top-center" />
    </SessionProvider>
  );
}
