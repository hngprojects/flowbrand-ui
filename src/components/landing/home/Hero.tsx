"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const itemVariantsDown = {
  hidden: { opacity: 0, y: -32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const imageVariants = {
  hidden: { opacity: 0, x: 80, scale: 0.98 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const Hero = () => {
  return (
    <section
      className="relative w-full pt-20 overflow-hidden bg-primary-50 to-white"
      style={{ fontFamily: '"Inter", sans-serif' }}
    >
      <div className="absolute w-full h-full z-0 pointer-events-none">
        <Image
          src="/images/smallCloud.png"
          alt="Clouds"
          width={702}
          height={622}
          className="absolute top-0 left-50 -translate-y-20"
        />
        <Image
          src="/images/bigCloud.png"
          alt="Clouds"
          width={286}
          height={264}
          className="absolute top-30 right-60"
        />
      </div>

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 text-center flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariantsDown}
          className="inline-flex items-center rounded-lg border border-amber-300 bg-white p-2 pr-5 mb-8 shadow-sm"
        >
          <span className="bg-amber-500 text-white text-xs md:text-sm font-semibold px-4 py-1.5 rounded-lg mr-3">
            Simply
          </span>
          <span className="text-foreground/80 text-xs md:text-sm font-medium">
            Made for every kind of Business
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariantsDown}
          className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight mb-6 max-w-4xl tracking-tight"
        >
          Grow your business with a smarter{" "}
          <span className="text-amber-500">Marketing Strategy</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-foreground/80 mb-10 max-w-2xl leading-relaxed"
        >
          Manage your entire customer journey from first contact to repeat
          sales, without stress with everything you need in one place.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="relative mb-16 flex flex-col items-center"
        >
          <motion.button
            className="relative bg-[#3b71e1] text-white font-medium py-3 px-8 rounded-lg z-10 overflow-hidden"
            whileHover="hover"
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <motion.span
              className="absolute inset-0 bg-amber-500 z-0"
              variants={{
                hover: { x: 0 },
              }}
              initial={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
            <span className="relative z-10">Create a free account</span>
          </motion.button>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={imageVariants}
          className="w-full max-w-5xl mx-auto relative mt-4 md:mt-8"
        >
          <Image
            src="/images/hero.svg"
            width={1200}
            height={800}
            alt="Seil App Interface on Desktop"
            className="w-full h-auto drop-shadow-2xl rounded-t-xl"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
