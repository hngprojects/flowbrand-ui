"use client";

import { useState, useMemo } from "react";
import { Search, Plus } from "lucide-react";
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
        item.answerParagraphs.some((p) =>
          p.toLowerCase().includes(search.toLowerCase()),
        ),
    );
  }, [search]);

  return (
    <>
      <main className="overflow-hidden">
        <section className="bg-primary/10 w-full h-[304px] flex items-center">
          <div className="section-class w-full">
            <div className="flex flex-col items-center gap-6 py-12 lg:flex-row lg:items-center lg:justify-between lg:py-16">
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1] as const,
                }}
              >
                <div className="flex items-center justify-center w-[67px] h-[64px] rounded-[300px] px-[18px] py-[8px] shadow-[0px_3.38px_3.38px_0px_#00000040] bg-primary-500/8">
                  <MobileLogo />
                </div>
                <h1 className="text-foreground text-3xl font-bold md:text-4xl">
                  FAQs
                </h1>
              </motion.div>

              <motion.div
                className="relative w-full max-w-xl"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1] as const,
                  delay: 0.15,
                }}
              >
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="Search anything"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-12 rounded-full pr-4 pl-10 shadow-sm bg-white text-[#a2a2a]"
                />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-16">
          <div className="section-class">
            {filteredFaqs.length === 0 ? (
              <motion.div
                className="flex min-h-[400px] flex-col items-center justify-center gap-4 py-20 text-center"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <p className="text-black-500 text-5xl font-semibold leading-[123%] tracking-normal">
                  No results found
                </p>
                <p className="max-w-md text-black-400 text-base font-normal leading-[150%]">
                  We couldn&apos;t find any FAQs matching your search. Try a
                  different keyword, or browse all questions.
                </p>
              </motion.div>
            ) : (
              <>
                <Accordion
                  type="single"
                  collapsible
                  className="flex w-full flex-col gap-4"
                >
                  {filteredFaqs.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.1 }}
                      transition={{
                        duration: 0.6,
                        ease: [0.22, 1, 0.36, 1] as const,
                        delay: index * 0.06,
                      }}
                    >
                      <AccordionItem
                        value={item.question}
                        className="group overflow-hidden bg-white px-0 data-[state=open]:border-blue-100 data-[state=open]:shadow-sm"
                      >
                        <AccordionTrigger className="items-start px-6 py-6 text-left hover:no-underline">
                          <span className="text-foreground pr-4 text-base leading-tight font-medium md:text-lg">
                            {item.question}
                          </span>
                          <div className="ml-auto flex shrink-0 pt-0.5">
                            <Plus className="h-5 w-5 text-primary-950 transition-transform duration-200 group-data-[state=open]:rotate-45 md:h-6 md:w-6" />
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pt-0 pb-6">
                          <div className="space-y-4 rounded-2xl border-t border-gray-100 bg-primary-60 pt-4 text-sm leading-relaxed text-black-500 md:text-[15px]">
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
                      duration: 0.8,
                      ease: [0.22, 1, 0.36, 1] as const,
                    }}
                  >
                    Ready To Grow Your Business With A System That Actually
                    Brings Customers?
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
                      className="inline-block rounded-lg overflow-hidden"
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
                          "focus-visible:ring-2 focus-visible:ring-amber-500",
                          "focus-visible:ring-offset-2 transition-colors",
                        )}
                      >
                        <motion.span
                          className="absolute inset-0 bg-amber-500 z-0"
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
