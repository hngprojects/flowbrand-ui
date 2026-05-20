"use client";

import { motion } from "framer-motion";

export default function SimpleIdea() {
  return (
    <section className="section-class flex flex-col items-center bg-[#FCFDFF] text-center">
      <motion.h2
        className="mb-10 text-[20px] font-bold tracking-tight text-[#0D1117] md:text-[24px]"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
      >
        Seil started as a simple idea
      </motion.h2>

      <motion.div
        className="relative w-full max-w-[640px] px-6 md:px-8"
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1] as const,
          delay: 0.15,
        }}
      >
        <span
          aria-hidden
          className="absolute top-[-24px] left-0 font-serif text-[72px] leading-none font-bold text-[#1C2B4A] select-none md:text-[88px]"
        >
          &ldquo;
        </span>
        <div className="rounded-2xl border border-[#E2E8F0] bg-[#FCFDFF] px-8 py-8 md:px-12 md:py-10">
          <p className="text-center text-[14px] leading-[1.9] text-black md:text-[16px]">
            what if we could ask someone a few questions about their business,
            and give them back a marketing strategy that actually fits, built in
            plain English, one step at a time?
          </p>
        </div>
        <span
          aria-hidden
          className="absolute right-0 bottom-[-54px] font-serif text-[72px] leading-none font-bold text-[#1C2B4A] select-none md:bottom-[-62px] md:text-[88px]"
        >
          &rdquo;
        </span>
      </motion.div>
    </section>
  );
}
