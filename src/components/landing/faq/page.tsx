"use client";

import { useState, useMemo } from "react";
import { Search, Plus, X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { faq_items } from "@/constants/home/faq/landing-faq";
import Link from "next/link";
import MobileLogo from "@/components/icons/navbar/mobileLogo";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function FaqPage() {
  const [search, setSearch] = useState("");

  const filteredFaqs = useMemo(() => {
    if (!search.trim()) return faq_items;
    return faq_items.filter(
      (item) =>
        item.question.toLowerCase().includes(search.toLowerCase()) ||
        item.answerHeading.toLowerCase().includes(search.toLowerCase()) ||
        item.answerParagraphs.some((p) =>
          p.toLowerCase().includes(search.toLowerCase()),
        ),
    );
  }, [search]);

  return (
    <>
      <main className="overflow-hidden">
        <section className="w-full bg-primary-50 md:flex md:h-[304px] md:items-center">
          <div className="section-class flex w-full flex-col items-center gap-6 py-10 md:flex-row md:items-center md:justify-between md:gap-8 md:py-0">
            <motion.div
              className="flex shrink-0 items-center gap-3"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0px_3.38px_3.38px_0px_#00000040]">
                <MobileLogo />
              </div>
              <h1 className="text-foreground text-3xl font-bold md:text-4xl">
                FAQs
              </h1>
            </motion.div>

            <motion.div
              className="relative w-full max-w-xl md:max-w-md lg:max-w-xl"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1] as const,
                delay: 0.1,
              }}
            >
              <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-black-300" />
              <Input
                type="text"
                placeholder="Search anything"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 rounded-full border-0 bg-white pr-4 pl-11 text-foreground shadow-[0px_1px_2px_rgba(16,24,40,0.05)] placeholder:text-black-300"
              />
            </motion.div>
          </div>
        </section>

        <section className="w-full bg-white py-8 md:py-12">
          <div className="section-class">
            {filteredFaqs.length === 0 ? (
              <motion.div
                className="flex min-h-[400px] flex-col items-center justify-center gap-4 py-20 text-center"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <p className="text-5xl font-semibold leading-[123%] tracking-normal text-black-500">
                  No results found
                </p>
                <p className="max-w-md text-base font-normal leading-[150%] text-black-400">
                  We couldn&apos;t find any FAQs matching your search. Try a
                  different keyword, or browse all questions.
                </p>
              </motion.div>
            ) : (
              <>
                <Accordion
                  type="single"
                  collapsible
                  className="w-full border-y border-gray-200"
                >
                  {filteredFaqs.map((item, index) => (
                    <motion.div
                      key={item.question}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.1 }}
                      transition={{
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1] as const,
                        delay: index * 0.04,
                      }}
                    >
                      <AccordionItem
                        value={item.question}
                        className="group border-b border-gray-200 bg-white px-0 last:border-b-0 data-[state=open]:bg-white"
                      >
                        <AccordionTrigger className="items-center gap-4 px-0 py-5 text-left hover:no-underline md:py-6 [&>svg:last-child]:hidden">
                          <span className="flex-1 pr-4 text-base font-semibold leading-snug text-[#030D1F] md:text-lg">
                            {item.question}
                          </span>
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center text-[#030D1F]">
                            <Plus className="h-5 w-5 group-data-[state=open]:hidden" />
                            <X className="hidden h-5 w-5 group-data-[state=open]:block" />
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="px-0 pb-5 md:pb-6">
                          <div className="space-y-3 border-t border-gray-200 pt-4">
                            <p className="text-base font-semibold text-[#030D1F]">
                              {item.answerHeading}
                            </p>
                            {item.answerParagraphs.map(
                              (paragraph, paragraphIndex) => (
                                <p
                                  key={paragraphIndex}
                                  className="text-sm leading-relaxed text-black-500 md:text-[15px]"
                                >
                                  {paragraph}
                                </p>
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
                    className="max-w-4xl text-3xl font-semibold tracking-tight text-black-500 md:text-4xl lg:text-5xl"
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                      duration: 0.8,
                      ease: [0.22, 1, 0.36, 1] as const,
                    }}
                  >
                    Ready To Grow Your Business With A System That Actually
                    Brings Customers?
                  </motion.h2>

                  <motion.p
                    className="max-w-md text-sm leading-relaxed text-black-400 md:text-base"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1] as const,
                      delay: 0.15,
                    }}
                  >
                    A simple marketing plan that attracts, nurtures, and
                    converts customers without stress.
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
                      className="inline-block overflow-hidden rounded-lg"
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
                        className={cn(
                          "bg-primary text-primary-foreground relative inline-flex rounded-lg",
                          "px-8 py-3.5 text-md font-medium shadow-md",
                          "transition-colors focus-visible:ring-2 focus-visible:ring-amber-500",
                          "focus-visible:ring-offset-2",
                        )}
                      >
                        <motion.span
                          className="absolute inset-0 z-0 bg-amber-500"
                          variants={{ hover: { x: 0 } }}
                          initial={{ x: "-100%" }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        />
                        <span className="relative z-10">
                          Create a free account
                        </span>
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
