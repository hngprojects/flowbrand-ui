"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faq_items } from "@/constants/home/faq/landing-faq";

export default function FaqSection() {
  return (
    <section className="w-full py-12 md:py-16">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">
        <div className="flex w-full flex-col items-center gap-6">
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-amber-600 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              FAQs
            </span>
          </div>

          <h2 className="text-foreground text-center text-3xl font-bold md:text-4xl">
            Still wondering? We thought you might be.
          </h2>

          <Accordion
            type="single"
            collapsible
            className="grid w-full grid-cols-1 gap-4 md:grid-cols-2"
          >
            {faq_items.map((item, index) => (
              <AccordionItem
                key={index}
                value={item.question}
                className="group overflow-hidden rounded-xl border border-[#EDEDED] bg-white px-0 data-[state=open]:border-blue-100 data-[state=open]:shadow-sm"
              >
                <AccordionTrigger className="items-start px-6 py-6 text-left hover:no-underline [&>svg:last-child]:hidden">
                  <span className="text-foreground pr-4 text-lg leading-tight font-medium">
                    {item.question}
                  </span>
                  <div className="ml-auto flex shrink-0 pt-0.5">
                    <Plus className="h-6 w-6 text-[#1E3A8A] transition-transform duration-200 group-data-[state=open]:rotate-45" />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pt-0 pb-6">
                  <div className="space-y-4 border-t border-gray-100 pt-4 text-sm leading-relaxed text-gray-800 md:text-[15px]">
                    {item.answerParagraphs.map(
                      (paragraph: string, paragraphIndex: number) => (
                        <p key={paragraphIndex}>{paragraph}</p>
                      ),
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-20 flex flex-col items-center gap-6 pb-12 text-center md:pb-20">
            <h2 className="text-black-500 max-w-4xl text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
              Get a step-by-step marketing strategy in minutes
            </h2>
            <p className="text-black-400 max-w-md text-sm leading-relaxed md:text-base">
              A simple marketing plan that attracts, nurtures, and converts
              customers without stress
            </p>
            <Link
              href="/register"
              className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 rounded-lg px-8 py-3.5 text-md font-medium shadow-md transition-all active:scale-95"
            >
              Create a free account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
