"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { UpgradeToProModal } from "@/components/modals/payment/upgrade-to-pro-modal";
import { PaymentSuccessModal } from "@/components/modals/payment/payment-success-modal";
import { PaymentFailedModal } from "@/components/modals/payment/payment-failed-modal";
import {
  amountForBillingCycle,
  MOCK_PAYMENT_DETAILS,
  type BillingCycle,
  type PaymentDetails,
} from "@/components/modals/payment/payment-types";

type PaymentFlowContextValue = {
  openUpgrade: () => void;
  openSuccess: () => void;
  openFailed: () => void;
  closeAll: () => void;
};

const PaymentFlowContext = createContext<PaymentFlowContextValue | null>(null);

export function usePaymentFlow(): PaymentFlowContextValue {
  const ctx = useContext(PaymentFlowContext);
  if (!ctx) {
    throw new Error("usePaymentFlow must be used within PaymentFlowProvider");
  }
  return ctx;
}

export function PaymentFlowProvider({ children }: { children: ReactNode }) {
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [failedOpen, setFailedOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  const paymentDetails: PaymentDetails = useMemo(
    () => ({
      ...MOCK_PAYMENT_DETAILS,
      amount: amountForBillingCycle(billingCycle),
    }),
    [billingCycle],
  );

  const closeAll = useCallback(() => {
    setUpgradeOpen(false);
    setSuccessOpen(false);
    setFailedOpen(false);
  }, []);

  const openUpgrade = useCallback(() => {
    setSuccessOpen(false);
    setFailedOpen(false);
    setUpgradeOpen(true);
  }, []);

  const openSuccess = useCallback(() => {
    setUpgradeOpen(false);
    setFailedOpen(false);
    setSuccessOpen(true);
  }, []);

  const openFailed = useCallback(() => {
    setUpgradeOpen(false);
    setSuccessOpen(false);
    setFailedOpen(true);
  }, []);

  const simulateSuccess = useCallback(() => {
    setUpgradeOpen(false);
    setFailedOpen(false);
    setSuccessOpen(true);
  }, []);

  const simulateFailed = useCallback(() => {
    setUpgradeOpen(false);
    setSuccessOpen(false);
    setFailedOpen(true);
  }, []);

  const retryPayment = useCallback(() => {
    setSuccessOpen(false);
    setFailedOpen(false);
    setUpgradeOpen(true);
  }, []);

  const value = useMemo(
    () => ({ openUpgrade, openSuccess, openFailed, closeAll }),
    [openUpgrade, openSuccess, openFailed, closeAll],
  );

  return (
    <PaymentFlowContext.Provider value={value}>
      {children}

      <UpgradeToProModal
        isOpen={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        billingCycle={billingCycle}
        onBillingCycleChange={setBillingCycle}
        onGetFullAccess={() => {}}
        onSimSuccess={simulateSuccess}
        onSimFailed={simulateFailed}
      />

      <PaymentSuccessModal
        isOpen={successOpen}
        onClose={() => setSuccessOpen(false)}
        details={paymentDetails}
      />

      <PaymentFailedModal
        isOpen={failedOpen}
        onClose={() => setFailedOpen(false)}
        details={paymentDetails}
        onTryAgain={retryPayment}
        onChooseAnotherMethod={retryPayment}
      />
    </PaymentFlowContext.Provider>
  );
}
