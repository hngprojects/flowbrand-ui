"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

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
  const { data: session, status } = useSession();
  const isAuthenticated =
    status === "authenticated" &&
    session?.invalid !== true &&
    !!session?.user?.id;

  return (
    <section className="relative w-full overflow-hidden bg-primary-50 to-white">
      <div className="absolute w-full h-full z-0 pointer-events-none">
        <Image
          src="/images/smallCloud.png"
          alt="Clouds"
          width={702}
          height={622}
          className="absolute top-0 hidden lg:block"
        />
        <Image
          src="/images/bigCloud.png"
          alt="Clouds"
          width={286}
          height={264}
          className="absolute top-[15%] right-0 hidden lg:block"
        />
      </div>

      <motion.div
        className="relative z-10 pt-[10%] max-w-7xl mx-auto px-4 md:px-8 text-center flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariantsDown}
          className="inline-flex items-center rounded-lg border-[1.5px] border-accent p-[10px] mb-6 shadow-sm"
        >
          <span className="bg-accent text-white text-[16px] font-[500] h-[28px] w-[78px] rounded-lg mr-3 flex items-center justify-center">
            Simply
          </span>
          <span className="text-foreground/80 text-[14px] font-[400]">
            Made for every kind of Business
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariantsDown}
          className="text-[32px] md:text-[60px] font-[500] text-foreground leading-tight mb-6 max-w-3xl tracking-tight"
        >
          Grow your business with a smarter{" "}
          <span className="text-accent">Marketing Strategy</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-[14px] md:text-[18px] font-[400] text-foreground/80 mb-5 max-w-2xl leading-relaxed"
        >
          Manage your entire customer journey from first contact to repeat
          sales, without stress with everything you need in one place.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="relative mb-6 flex flex-col items-center"
        >
          <motion.div
            className="inline-block rounded-lg overflow-hidden"
            whileHover="hover"
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Link
              href={isAuthenticated ? "/dashboard" : "/register"}
              className="relative bg-primary-500 hover:bg-primary-600 text-[16px] text-white font-[500] py-3 px-8 rounded-lg transition-colors z-10 hover:cursor-pointer inline-flex overflow-hidden"
            >
              <motion.span
                className="absolute inset-0 bg-amber-500 z-0"
                variants={{ hover: { x: 0 } }}
                initial={{ x: "-100%" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
              <span className="relative z-10">
                {isAuthenticated ? "Go to Dashboard" : "Create a free account"}
              </span>
            </Link>
          </motion.div>
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
