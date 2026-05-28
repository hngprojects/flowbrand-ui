"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionLabelPill } from "@/components/ui/section-label-pill";

const Features = () => {
  return (
    <section className="w-full">
      <div className="flex flex-col items-center section-class">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <SectionLabelPill>Features</SectionLabelPill>
        </motion.div>

        <motion.h2
          className="text-[24px] md:text-[32px] font-semibold mb-12 text-foreground text-center tracking-tight"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1] as const,
            delay: 0.1,
          }}
        >
          Everything you need to grow
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          <motion.div
            className="bg-black-600 rounded-[2rem] p-6 flex flex-col h-[405px] shadow-sm"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1] as const,
              delay: 0.1,
            }}
          >
            <div className="flex-1 flex justify-start items-start">
              <Image
                src="/images/feature-1.png"
                alt="Guided Setup"
                width={80}
                height={80}
                className="w-[80px] h-auto object-contain"
              />
            </div>
            <div className="mt-auto">
              <h3 className="text-white text-[20px] md:text-[24px] font-[500] mb-3">
                <span className="hidden md:block">Guided Setup</span>
                <span className="md:hidden">
                  A plan made for your own business
                </span>
              </h3>
              <p className="text-gray-400 text-[16px] font-[400] leading-relaxed">
                <span className="hidden md:block">
                  Build the best marketing strategy for your business with
                  clear, step by step support
                </span>
                <span className="md:hidden">
                  Tell us what you sell and who buys it, we&lsquo;ll hand you
                  the steps. No &quot;figure it out&quot;.
                </span>
              </p>
            </div>
          </motion.div>

          <motion.div
            className="relative rounded-[2rem] overflow-hidden flex flex-col h-[405px] group shadow-sm"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1] as const,
              delay: 0.2,
            }}
          >
            <Image
              src="/images/dark-skin-girl-2.jpg"
              alt="Progress Tracking"
              width={405}
              height={456}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/90 via-[#1a1a1a]/30 to-transparent" />
            <div className="relative z-10 mt-auto p-8">
              <h3 className="text-white text-[20px] md:text-[24px] font-[500] mb-3">
                Progress Tracking
              </h3>
              <p className="text-gray-200 text-[16px] font-[400] leading-relaxed">
                Track every stage of your marketing and see what to improve on
                next, without guess work
              </p>
            </div>
          </motion.div>

          <motion.div
            className="md:col-span-2 lg:col-span-1 md:flex md:justify-center lg:block"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1] as const,
              delay: 0.3,
            }}
          >
            <div className="bg-primary-250 rounded-[2rem] p-6 flex flex-col h-[405px] relative overflow-hidden shadow-sm w-full md:max-w-[calc(50%-12px)] lg:max-w-none">
              <div className="flex-1 relative w-full pt-4 px-0 bg-white/25 rounded-[1.5rem]">
                <div className="absolute top-5 left-5">
                  <p className="text-white/90 text-md font-medium leading-tight">
                    From
                    <br />
                    Business Idea
                  </p>
                </div>
                <div className="absolute top-16 left-10 w-[90px] h-[50px]">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 90 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="overflow-visible"
                  >
                    <circle cx="5" cy="5" r="4" fill="white" />
                    <path
                      d="M5 10 C 5 40, 20 45, 85 45"
                      stroke="white"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      fill="none"
                    />
                    <path
                      d="M75 37 L87 45 L75 53"
                      stroke="white"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="absolute top-[5rem] left-[8rem] w-full">
                  <p className="text-white text-2xl md:text-[1.25rem] lg:text-[1.5rem] font-semibold leading-snug">
                    Real Marketing
                    <br />
                    Strategies
                  </p>
                </div>
              </div>
              <div className="mt-20 px-2">
                <h3 className="text-white text-[20px] md:text-[24px] font-[500] mb-3">
                  Smarter Conversions
                </h3>
                <p className="text-white/85 text-[16px] font-[400] leading-relaxed">
                  Convert leads into real customers with better inquiry and
                  booking flows.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Features;
