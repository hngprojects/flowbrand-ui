"use client";

import type { PaymentDetails } from "@/components/modals/payment/payment-types";

export function PaymentDetailsBox({ details }: { details: PaymentDetails }) {
  const rows: { label: string; value: string }[] = [
    { label: "Reference", value: details.reference },
    { label: "Amount", value: details.amount },
    { label: "Payment Method", value: details.paymentMethod },
    { label: "Date & Time", value: details.dateTime },
  ];

  return (
    <div className="w-full rounded-2xl bg-primary-50 px-5 py-4 text-left">
      <p className="mb-3 text-sm font-semibold text-black-500">
        Payment details
      </p>
      <dl className="space-y-2.5">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-start justify-between gap-4 text-sm"
          >
            <dt className="shrink-0 text-black-300">{row.label}</dt>
            <dd className="text-right font-medium text-black-500">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
