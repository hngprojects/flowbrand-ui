"use client";

import { SessionProvider } from "next-auth/react";
import { GoogleSignInToast } from "@/components/auth/google-sign-in-toast";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/providers/query-provider";
import { PaymentFlowProvider } from "@/components/modals/payment/payment-flow-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus refetchInterval={12 * 60}>
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
