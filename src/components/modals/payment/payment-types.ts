export type BillingCycle = "monthly" | "annual";

export type PaymentDetails = {
  reference: string;
  amount: string;
  paymentMethod: string;
  dateTime: string;
};

export const MOCK_PAYMENT_DETAILS: PaymentDetails = {
  reference: "FB-2028-05-13-0089",
  amount: "₦10,000.00",
  paymentMethod: "Card ****8970",
  dateTime: "May 19, 2024 · 11:42AM",
};

export function amountForBillingCycle(cycle: BillingCycle): string {
  return cycle === "monthly" ? "₦10,000.00" : "₦100,000.00";
}
