"use client";

import { useEffect } from "react";
import PricingPage from "@/components/landing/pricing/page";
import { usePaymentFlow } from "@/components/modals/payment/payment-flow-provider";

/** Pricing page with upgrade modal opened — used by "Get Full Access" links. */
export default function PricingProPage() {
  const { openUpgrade } = usePaymentFlow();

  useEffect(() => {
    openUpgrade();
  }, [openUpgrade]);

  return <PricingPage />;
}
