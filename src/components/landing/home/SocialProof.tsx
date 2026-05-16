"use client";

import Image from "next/image";
import {
  Homemade_Apple,
  Inspiration,
  Inknut_Antiqua,
  Instrument_Serif,
} from "next/font/google";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

const fontHomemadeApple = Homemade_Apple({ weight: "400", subsets: ["latin"] });
const fontInspiration = Inspiration({ weight: "400", subsets: ["latin"] });
const fontInknutAntiqua = Inknut_Antiqua({ weight: "400", subsets: ["latin"] });
const fontInstrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
});

const logos = [
  {
    label: "Repair Service",
    icon: "/images/repair.png",
    width: 67,
    height: 41,
    fontClass: fontInstrumentSerif.className,
  },
  {
    label: "Beauty Salon",
    icon: "/images/beauty.png",
    width: 39,
    height: 57,
    fontClass: fontHomemadeApple.className,
  },
  {
    label: "Bakery",
    icon: "/images/bakery.png",
    width: 48,
    height: 40,
    fontClass: fontInspiration.className,
  },
  {
    label: "Small Retail",
    icon: "/images/small.png",
    width: 43,
    height: 36,
    fontClass: fontInknutAntiqua.className,
  },
  {
    label: "Agency",
    icon: "/images/layer1.png",
    width: 39,
    height: 57,
    fontClass: fontHomemadeApple.className,
  },
] as const;

function LogoItem({
  label,
  icon,
  width,
  height,
  fontClass,
}: {
  label: string;
  icon: string;
  width: number;
  height: number;
  fontClass?: string;
}) {
  return (
    <div className="flex items-center justify-center gap-4 opacity-50 grayscale transition-opacity hover:opacity-100 px-8">
      <Image
        src={icon}
        alt={label}
        width={width}
        height={height}
        className="w-10 sm:w-12"
        style={{ height: "auto" }}
      />
      <span
        className={cn(
          "whitespace-nowrap text-center text-[18px] leading-none font-normal text-gray-800 sm:text-[22px]",
          fontClass,
        )}
      >
        {label}
      </span>
    </div>
  );
}

export default function SocialProof() {
  const duplicatedLogos = [...logos, ...logos, ...logos];

  return (
    <section className="w-full bg-[#FCFDFF] py-8 md:py-12 overflow-hidden">
      <div className="mx-auto flex flex-col items-center gap-10">
        <p className="text-center text-[14px] text-gray-800 md:text-[16px] px-6">
          Used by small businesses like yours to build and grow with confidence
        </p>

        <div className="relative w-full">
          {/* Gradient Overlays for smooth edges */}
          <div className="absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-[#FCFDFF] to-transparent md:w-32"></div>
          <div className="absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-[#FCFDFF] to-transparent md:w-32"></div>

          <motion.div
            className="flex w-max"
            animate={{
              x: ["-33.33%", "0%"],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {duplicatedLogos.map((logo, index) => (
              <LogoItem
                key={`${logo.label}-${index}`}
                label={logo.label}
                icon={logo.icon}
                width={logo.width}
                height={logo.height}
                fontClass={logo.fontClass}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
