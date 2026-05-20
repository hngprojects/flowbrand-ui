"use client";

import { Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faq_items } from "@/constants/home/faq/landing-faq";
import { SectionLabelPill } from "@/components/ui/section-label-pill";

export default function FaqSection() {
  return (
    <section className="w-full pt-15 bg-primary-60">
      <div className="flex flex-col items-center section-class">
        <div className="flex w-full flex-col items-center ">
          <SectionLabelPill>FAQs</SectionLabelPill>

          <h2 className="text-foreground text-center text-[24px] md:text-[32px] font-[500] mb-8">
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
                  <span className="text-foreground pr-4 text-[16px] md:text-[18px] font-[500] leading-tight">
                    {item.question}
                  </span>
                  <div className="ml-auto flex shrink-0 pt-0.5">
                    <Plus className="h-6 w-6 text-[#1E3A8A] transition-transform duration-200 group-data-[state=open]:rotate-45" />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pt-0 pb-6">
                  <div className="space-y-4 border-t border-gray-100 pt-4 text-[14px] md:text-[18px] leading-relaxed text-gray-800">
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
        </div>
      </div>
    </section>
  );
}
