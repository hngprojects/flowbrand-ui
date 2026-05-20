"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function WhyWeStarted() {
  return (
    <section className="w-full bg-[var(--background)]">
      <div className="section-class flex flex-col md:flex-row md:items-center">
        <motion.div
          className="w-full flex-shrink-0 md:mt-8 md:w-[50%] md:pr-4 mb-4 md:mb-0 "
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <span className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-[#E58F172B] px-3 py-1 text-[11px] font-semibold tracking-wide text-[#E58F17] uppercase">
            <span className="inline-block h-3 w-3 rounded-full bg-[#E58F17]" />
            Our Story
          </span>
          <h2 className="mb-5 text-[22px] font-bold tracking-tight text-[#0D1117] md:text-[26px]">
            Why we started
          </h2>
          <p className="mb-3 text-[16px] leading-relaxed text-black md:text-[18px]">
            We kept seeing the same story everywhere.
          </p>
          <p className="mb-3 text-[16px] leading-relaxed text-black md:text-[18px]">
            A business owner doing everything, running the operation, managing
            staff, chasing payments and still finding time to post on Instagram
            hoping something would click.
          </p>
          <p className="text-[16px] leading-relaxed text-black md:text-[18px]">
            No strategy. No plan. Just effort and hope.
          </p>
        </motion.div>

        <motion.div
          className="w-full flex-shrink-0 md:w-[50%]"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1] as const,
            delay: 0.15,
          }}
        >
          <Image
            src="/images/nkechi.png"
            alt="Nkechi at her provisions store"
            width={500}
            height={380}
            className="hidden h-[340px] w-full rounded-2xl object-cover md:block lg:h-[380px]"
          />
          <Image
            src="/images/nkechi.png"
            alt="Nkechi at her provisions store"
            width={480}
            height={280}
            className="block h-[260px] w-full rounded-2xl object-cover md:hidden"
          />
        </motion.div>
      </div>
    </section>
  );
}
