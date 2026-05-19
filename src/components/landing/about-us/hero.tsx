"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#EBF0FB]">
      <div className="pointer-events-none absolute top-12 left-8 w-[280px] select-none md:top-16 md:w-[400px]">
        <Image
          src="/images/bigCloud.png"
          alt=""
          width={160}
          height={100}
          className="h-auto w-full"
          aria-hidden
        />
      </div>
      <div className="pointer-events-none absolute top-14 right-0 w-[220px] select-none md:top-24 md:w-[320px]">
        <Image
          src="/images/smallCloud.png"
          alt=""
          width={400}
          height={280}
          className="h-auto w-full"
          aria-hidden
        />
      </div>

      <motion.div
        className="relative z-10 mx-auto mt-8 max-w-[440px] px-5 pt-20 text-center md:max-w-[800px]"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as const }}
      >
        <h1 className="w-full text-[32px] leading-[1.16] font-bold tracking-[-0.5px] text-black md:text-[54px] md:tracking-[-1.5px] lg:text-[52px]">
          We built <span className="text-[#E58F17]">Seil </span> because great
          marketing shouldn&apos;t require a marketing degree.
        </h1>
      </motion.div>

      <motion.div
        className="relative z-10 w-full"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          ease: [0.22, 1, 0.36, 1] as const,
          delay: 0.2,
        }}
      >
        <div className="relative mx-auto hidden w-full md:block">
          <Image
            src="/images/new-hero.png"
            alt="Small business owners — Maimuna, David, Sarah and Aisha"
            width={1100}
            height={640}
            priority
            className="w-[calc(100svw+300px)] max-w-[calc(100svw+300px)] -mx-35"
          />
          <div className="pointer-events-none absolute bottom-0 left-0 w-full select-none h-[25%]">
            <Image
              src="/images/white.png"
              alt=""
              width={1450}
              height={778}
              className="h-full w-full object-cover object-top mt-9 lg:mt-0"
              aria-hidden
            />
          </div>
        </div>
        <div className="relative mx-auto block w-full md:hidden">
          <Image
            src="/images/hero.png"
            alt="Small business owners"
            width={480}
            height={520}
            priority
            className="w-full object-cover object-top"
          />
          <div className="pointer-events-none absolute bottom-0 left-0 w-full select-none h-[28%]">
            <Image
              src="/images/white.png"
              alt=""
              width={480}
              height={200}
              className="h-full w-full object-cover object-top"
              aria-hidden
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
