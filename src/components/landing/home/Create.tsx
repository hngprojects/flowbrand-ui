"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function CreateSection() {
  return (
    <div className="section-class flex flex-col items-center gap-2 pb-12 text-center md:pb-20">
      <motion.h2
        className="text-black-500 max-w-xs lg:max-w-3xl text-[32px] lg:text-[48px] font-[500] tracking-tight leading-tight"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: easeOut }}
      >
        Get a step-by-step marketing strategy in minutes
      </motion.h2>
      <motion.p
        className="text-black-400 max-w-sm lg:max-w-lg text-[16px] leading-relaxed"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: easeOut, delay: 0.15 }}
      >
        A simple marketing plan that attracts, nurtures, and converts customers
        without stress
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: easeOut, delay: 0.25 }}
      >
        <motion.div
          className="mt-4 inline-block"
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <Link
            href="/register"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-8 py-3.5 text-[16px] md:text-[20px] font-[500] shadow-md transition-all active:scale-95"
          >
            Create a free account
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
