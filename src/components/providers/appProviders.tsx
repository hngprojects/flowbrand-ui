"use client";

import { SessionProvider } from "next-auth/react";
import { SESSION_REFETCH_INTERVAL_S } from "@/lib/auth-session-timing";
import { GoogleSignInToast } from "@/components/auth/google-sign-in-toast";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/providers/query-provider";
import { PaymentFlowProvider } from "@/components/modals/payment/payment-flow-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      refetchOnWindowFocus
      refetchInterval={SESSION_REFETCH_INTERVAL_S}
    >
      <QueryProvider>
        <PaymentFlowProvider>
          <GoogleSignInToast />
          {children}
          <Toaster richColors position="top-center" />
        </PaymentFlowProvider>
      </QueryProvider>
    </SessionProvider>
  );
}
