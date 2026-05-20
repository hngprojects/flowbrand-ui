"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const CtaSection = () => {
  return (
    <section className="w-full">
      <div className="section-class max-w-5xl flex flex-col justify-center md:gap-[1rem] mx-auto">
        <motion.h1
          className="text-[2rem] md:text-[3rem] font-[500] leading-[110%] text-center"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
        >
          Get a step-by-step marketing strategy in minutes
        </motion.h1>

        <motion.p
          className="text-[1rem] text-[var(--black-300)] leading-[150%] text-center mt-[0.69rem] mb-[1rem]"
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
          className="self-center"
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
            className="inline-block rounded-[0.63rem] overflow-hidden"
            whileHover="hover"
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Link
              href="/signup"
              className={cn(
                "bg-[var(--primary)] text-white relative inline-flex rounded-lg",
                "px-[2rem] py-[0.69rem] text-[1rem] font-medium",
                "focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2",
                "transition-colors",
              )}
            >
              <motion.span
                className="absolute inset-0 bg-amber-500 z-0"
                variants={{ hover: { x: 0 } }}
                initial={{ x: "-100%" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
              <span className="relative z-10">Create a free account</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
