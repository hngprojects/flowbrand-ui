"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const easeOut = [0.22, 1, 0.36, 1] as const;

const Welcome = () => {
  return (
    <section className="w-full">
      <div className="section-class">
        <div className="flex flex-col lg:flex-row justify-between items-start mb-10 gap-4">
          <motion.div
            className="w-full lg:w-[58%]"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: easeOut }}
          >
            <span className="inline-block text-primary-600 font-bold mb-4 text-lg  font-[500]">
              Welcome to Seil
            </span>
            <h2 className="text-2xl md:text-6xl font-[500] text-foreground leading-tight">
              We help you attract the right customers and convert them into
              paying buyers
            </h2>
          </motion.div>

          <motion.div
            className="flex-1 max-w-[460px]"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: easeOut, delay: 0.15 }}
          >
            <p className="text-foreground/80 text-base md:text-xl font-[400] leading-relaxed">
              We built Seil because we kept seeing the same thing: brilliant
              business owners with no clear path to getting customers
              consistently. Not because they weren&apos;t capable, but because
              every tool out there assumed they already knew what to do.
            </p>
          </motion.div>
        </div>

        <motion.div
          className="w-full rounded-[1rem] overflow-hidden"
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.9, ease: easeOut, delay: 0.2 }}
        >
          <Image
            src="/images/dark-skin-girl-1.jpg"
            width={1200}
            height={600}
            alt="Business owner working on a laptop"
            className="w-full h-auto object-cover object-center"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Welcome;
