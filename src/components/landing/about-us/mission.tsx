"use client";

import { motion } from "framer-motion";

export default function Mission() {
  return (
    <section className="w-full bg-accent-50">
      <div className="section-class max-w-5xl flex flex-col items-center py-30 text-center">
        <motion.span
          className="mb-5 text-[16px] font-semibold tracking-[1.6px] text-black uppercase"
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Our Mission
        </motion.span>

        <motion.h2
          className="text-[24px] leading-[1.4] font-normal tracking-[-0.2px] text-black lg:text-[40px]"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1] as const,
            delay: 0.15,
          }}
        >
          Our mission is to give every business owner a clear path to getting
          consistent customers.
        </motion.h2>
      </div>
    </section>
  );
}
