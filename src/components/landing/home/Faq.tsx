"use client";

import Link from "next/link";
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
            className="text-foreground text-center text-[24px] md:text-[32px] font-[500] mb-8"
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
              </motion.div>
            ))}
          </Accordion>

          <div className="mt-20 flex flex-col items-center gap-6 pb-12 text-center md:pb-20">
            <motion.h2
              className="text-black-500 max-w-4xl text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
            >
              Get a step-by-step marketing strategy in minutes
            </motion.h2>

            <motion.p
              className="text-black-400 max-w-md text-sm leading-relaxed md:text-base"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1] as const,
                delay: 0.15,
              }}
            >
              A simple marketing plan that attracts, nurtures, and converts
              customers without stress
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1] as const,
                delay: 0.25,
              }}
            >
              <motion.div
                className="mt-4 inline-block overflow-hidden rounded-lg"
                whileHover="hover"
                whileTap={{ scale: 0.97 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 20,
                }}
              >
                <Link
                  href="/register"
                  className="bg-primary text-primary-foreground relative inline-flex px-8 py-3.5 text-md font-medium shadow-md focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-inset"
                >
                  <motion.span
                    className="absolute inset-0 z-0 bg-amber-500"
                    variants={{ hover: { x: 0 } }}
                    initial={{ x: "-100%" }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                    }}
                  />
                  <span className="relative z-10">
                    Create a free account
                  </span>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}