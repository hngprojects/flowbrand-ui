"use client";

import { Plus } from "lucide-react";
import { motion } from "framer-motion";
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
        <div className="flex w-full flex-col items-center">
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: -16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <SectionLabelPill>FAQs</SectionLabelPill>
          </motion.div>

          <motion.h2
            className="text-foreground text-center text-2xl md:text-4xl  font-[500] mb-8"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1] as const,
              delay: 0.1,
            }}
          >
            Still wondering? We thought you might be.
          </motion.h2>

          <Accordion
            type="single"
            collapsible
            className="grid w-full grid-cols-1 gap-4 md:grid-cols-2"
          >
            {faq_items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1] as const,
                  delay: index * 0.07,
                }}
              >
                <AccordionItem
                  value={item.question}
                  className="group overflow-hidden rounded-xl border border-gray-300 bg-white px-0 data-[state=open]:border-blue-100 data-[state=open]:shadow-sm"
                >
                  <AccordionTrigger className="items-start px-6 py-6 text-left hover:no-underline [&>svg:last-child]:hidden">
                    <span className="text-foreground pr-4 text-lg leading-tight font-medium">
                      {item.question}
                    </span>
                    <div className="ml-auto flex shrink-0 pt-0.5">
                      <Plus className="h-6 w-6 text-brand transition-transform duration-200 group-data-[state=open]:rotate-45" />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pt-0 pb-6">
                    <div className="space-y-4 border-t border-gray-100 pt-4 text-sm leading-relaxed text-gray-800 md:text-md-accent">
                      {item.answerParagraphs.map(
                        (paragraph: string, paragraphIndex: number) => (
                          <p key={paragraphIndex}>{paragraph}</p>
                        ),
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
