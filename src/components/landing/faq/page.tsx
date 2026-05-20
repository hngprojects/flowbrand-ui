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
          <div className="section-class">
            <div className="flex  flex-col items-center gap-6 py-12 lg:flex-row lg:items-center lg:justify-between lg:py-16">
              <div className="flex  items-center gap-3">
                <div
                  style={{
                    width: "67px",
                    height: "64px",
                    borderRadius: "300px",
                    padding: "8px 18px",
                    boxShadow: "0px 3.38px 3.38px 0px #00000040",
                    backgroundColor: "rgba(50, 106, 209, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MobileLogo />
                </div>
                <h1 className="text-foreground text-3xl font-bold md:text-4xl">
                  FAQs
                </h1>
              </div>

              <div className="relative w-full max-w-xl">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="Search anything"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-12 rounded-full pr-4 pl-10 shadow-sm bg-white text-[#a2a2a]"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-16">
          <div className="section-class">
            {filteredFaqs.length === 0 ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 py-20 text-center">
                <p
                  style={{
                    color: "#030D1F",
                    fontSize: "48px",
                    fontWeight: 600,
                    lineHeight: "123%",
                    letterSpacing: "0%",
                  }}
                >
                  No results found
                </p>
                <p
                  className="max-w-md"
                  style={{
                    color: "#353D4C",
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "150%",
                  }}
                >
                  We couldn&apos;t find any FAQs matching your search. Try a
                  different keyword, or browse all questions.
                </p>
              </div>
            ) : (
              <>
                <Accordion
                  type="single"
                  collapsible
                  className="flex w-full flex-col gap-4"
                >
                  {filteredFaqs.map((item, index) => (
                    <AccordionItem
                      key={index}
                      value={item.question}
                      className="group overflow-hidden  bg-white px-0 data-[state=open]:border-blue-100 data-[state=open]:shadow-sm"
                    >
                      <AccordionTrigger className="items-start px-6 py-6 text-left hover:no-underline">
                        <span className="text-foreground pr-4 text-base leading-tight font-medium md:text-lg">
                          {item.question}
                        </span>
                        <div className="ml-auto flex shrink-0 pt-0.5">
                          <Plus className="h-5 w-5 text-[#1E3A8A] transition-transform duration-200 group-data-[state=open]:rotate-45 md:h-6 md:w-6" />
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pt-0 pb-6">
                        <div className="space-y-4 rounded-2xl border-t border-gray-100 bg-[#FBFCFF] pt-4 text-sm leading-relaxed text-black-500 md:text-[15px]">
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
                    Ready To Grow Your Business With A System That Actually
                    Brings Customers?
                  </h2>
                  <p className="text-black-400 max-w-md text-sm leading-relaxed md:text-base">
                    A simple marketing plan that attracts, nurtures, and
                    converts customers without stress.
                  </p>
                  <Link
                    href="/register"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 rounded-lg px-8 py-3.5 text-md font-medium shadow-md transition-all active:scale-95"
                  >
                    Create a free account
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
