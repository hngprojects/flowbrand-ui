"use client";

import { useState } from "react";
// import { Button } from "~/components/ui/button";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BadgeCheck, Check } from "lucide-react";
import Image from "next/image";

type FeatureValue = boolean | string;

const features: { name: string; free: FeatureValue; pro: FeatureValue }[] = [
  { name: "Guided Funnel Setup", free: true, pro: true },
  { name: "Active Funnel", free: "1", pro: "Unlimited" },
  { name: "Funnel Recommendation", free: "Basic", pro: "Advanced" },
  { name: "Lead Capture guidance", free: true, pro: true },
  { name: "Progress tracking", free: true, pro: true },
  { name: "Follow up template & Prompts", free: "Limited", pro: "Full Access" },
  { name: "Performance Insights", free: false, pro: true },
  { name: "Priority Support", free: false, pro: true },
];

const freeFeatures = [
  "Intake Wizard",
  "Personalized Templates",
  "Built-in Checklist",
  "Save & Track your progress",
];

const proFeatures = [
  "Everything in free",
  "Multiple marketing plans",
  "Advanced stages",
  "Follow up templates & Prompts",
  "Team Collaboration",
  "Performance Insights",
];

const faqs = [
  {
    question: "Can I start for free without registering my ID card?",
    answer:
      "Yes, you can start with our free plan without any registration requirements. Simply sign up with your email to get started.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Yes, we take data security seriously. All your data is encrypted and stored securely. We never share your data with third parties.",
  },
  {
    question: "What happens if I cancel pro?",
    answer:
      "If you cancel your pro subscription, your account will revert to the free plan. You will retain your data but lose access to premium features.",
  },
  {
    question: "Do you have any cancellation fee?",
    answer:
      "No, there are no cancellation fees. You can cancel your subscription at any time without penalty.",
  },
  {
    question: "What type of payment do you accept?",
    answer:
      "We accept various payment methods including credit cards, debit cards, and other digital payment options.",
  },
  {
    question: "Do I need marketing experience to use it?",
    answer:
      "No, our platform is designed for everyone. We provide guided setup and templates to help you succeed without prior experience.",
  },
];

// Compare table: normal orange Check for true, orange dash for false
function FeatureCell({ value }: { value: FeatureValue }) {
  if (value === true) {
    return (
      <td className="px-6 py-4 text-center">
        <Check className="mx-auto h-5 w-5 text-orange-500" />
      </td>
    );
  }
  if (value === false) {
    return (
      <td className="px-6 py-4 text-center">
        <span className="mx-auto block text-center text-base font-medium text-orange-400">
          —
        </span>
      </td>
    );
  }
  return (
    <td className="px-6 py-4 text-center">
      <span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>
    </td>
  );
}

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly",
  );

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      {/* HERO */}
      <section className="relative overflow-hidden bg-sky-100/40 px-4 pb-20 pt-16 sm:pt-20 dark:bg-slate-900/20">
        {/* Cloud images from Figma — place files at: public/images/pricing/cloud-left.png and public/images/pricing/cloud-right.png */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <Image
            src="/images/cloud1.png"
            alt=""
            width={340}
            height={260}
            className="absolute -left-10 top-0 opacity-60"
          />
          <Image
            src="/images/cloud2.png"
            alt=""
            width={340}
            height={260}
            className="absolute -right-10 bottom-0 opacity-60"
          />
          {/* fallback blobs in case images are not yet added */}
          <div className="absolute -top-10 -left-16 h-72 w-72 rounded-full bg-white/60 blur-2xl" />
          <div className="absolute -right-16 -bottom-10 h-80 w-80 rounded-full bg-white/60 blur-2xl" />
          <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-sky-200/20 blur-3xl" />
          <div className="absolute -right-32 -bottom-20 h-96 w-96 rounded-full bg-sky-200/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="mb-2 text-4xl font-bold sm:text-5xl">
            Affordable Pricing for your{" "}
            <span className="text-orange-500">Business</span>
          </h1>
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            Whether you&apos;re just figuring things out or ready to scale,
            FlowBrand gives you exactly what you need at every stage.
          </p>

          {/* Toggle — slightly rounded rectangle, not full pill */}
          <div className="mt-12 inline-flex items-center rounded-lg border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-md px-6 py-2 text-sm font-medium transition-all ${
                billingCycle === "monthly"
                  ? "bg-orange-500 text-white shadow"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
              }`}
            >
              Monthly Pricing
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`rounded-md px-6 py-2 text-sm font-medium transition-all ${
                billingCycle === "annual"
                  ? "bg-orange-500 text-white shadow"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
              }`}
            >
              Annual Pricing
            </button>
          </div>
        </div>
      </section>

      {/* PRICING CARDS — wrapped in a light background div, overlapping hero */}
      <section className="relative z-10 w-full">
        <div className="mx-auto w-full max-w-4xl px-6 md:px-12 lg:px-20">
          {/* Outer wrapper with background — matches Figma card container */}
          <div className="-mt-10 rounded-2xl bg-gray-50 p-6 shadow-sm dark:bg-gray-900/50">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Free Plan — uses flex-col so button stays at bottom */}
              <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Free Plan
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Perfect for one-person shops or small businesses
                  </p>
                  <p className="mt-4 text-base font-semibold text-orange-500">
                    Free
                  </p>
                  {/* BadgeCheck bullet — black color as requested */}
                  <div className="my-6 space-y-3">
                    {freeFeatures.map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <BadgeCheck className="h-4 w-4 shrink-0 text-gray-900 dark:text-white" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Button pinned to bottom so it aligns with Pro card button */}
                <Button className="mt-4 w-full bg-blue-600 text-white hover:bg-blue-700">
                  Start For Free
                </Button>
              </div>

              {/* Pro Plan — uses flex-col so button stays at bottom */}
              <div className="relative flex flex-col rounded-2xl border-2 border-orange-500 bg-white p-8 shadow-sm dark:bg-gray-950">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="whitespace-nowrap rounded-full bg-orange-500 px-4 py-1 text-xs font-semibold text-white shadow">
                    Recommended
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Pro Plan
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    For businesses ready to grow further and faster.
                  </p>
                  <p className="mt-4 text-2xl font-bold text-orange-500">
                    ₦10,000
                    <span className="text-sm font-normal text-gray-500">
                      {" "}
                      /monthly
                    </span>
                  </p>
                  {/* BadgeCheck bullet — black color as requested */}
                  <div className="my-6 space-y-3">
                    {proFeatures.map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <BadgeCheck className="h-4 w-4 shrink-0 text-gray-900 dark:text-white" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Button pinned to bottom so it aligns with Free card button */}
                <Button className="mt-4 w-full border-2 border-orange-500 bg-transparent text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950">
                  Get Full Access
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARE TABLE */}
      <section className="w-full py-16">
        <div className="mx-auto w-full max-w-4xl px-6 md:px-12 lg:px-20">
          <h2 className="mb-3 text-center text-3xl font-bold text-gray-900 dark:text-white">
            Compare Plans
          </h2>
          <p className="mb-10 text-center text-gray-600 dark:text-gray-400">
            Find the right plan for where your business is now—and where
            you&apos;re going.
          </p>

          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Free
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 dark:border-gray-800"
                  >
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {feature.name}
                    </td>
                    <FeatureCell value={feature.free} />
                    <FeatureCell value={feature.pro} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative overflow-hidden bg-slate-50/60 px-4 py-16 dark:bg-amber-900/10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 -left-32 h-80 w-80 rounded-full bg-yellow-200/20 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-yellow-200/15 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 dark:border-orange-800 dark:bg-orange-950">
              <span className="h-2 w-2 rounded-full bg-orange-400" />
              <span className="text-xs font-semibold text-orange-600 dark:text-orange-300">
                FAQs
              </span>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              Still wondering? We thought you might be .
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Get answers to common questions about our plans and features.
            </p>
          </div>

          <Accordion
            type="single"
            collapsible
            className="grid gap-4 md:grid-cols-2"
          >
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="group rounded-xl border border-gray-200 bg-white px-5 py-1 dark:border-gray-700 dark:bg-gray-900"
              >
                <AccordionTrigger className="flex w-full items-center justify-between gap-3 text-left text-sm font-medium hover:no-underline hover:text-orange-500 [&>svg]:hidden">
                  <span>{faq.question}</span>
                  {/* + rotates 45deg to become × when open */}
                  <span className="shrink-0 text-xl font-light text-orange-500 transition-transform duration-200 group-has-[[data-state=open]]:rotate-45">
                    +
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </main>
  );
}
