"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { SectionLabelPill } from "@/components/ui/section-label-pill";

interface Step {
  number: number;
  title: string;
  description: string;
  image: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: "Tell us about your business.",
    description:
      "Upload your business documents or answer 3 plain questions to get started, no marketing knowledge needed.",
    image: "/images/snippet.svg",
  },
  {
    number: 2,
    title: "We build your marketing strategy.",
    description:
      "Seil matches your answers to the right strategy plan type and personalizes every stage for your business. Done in under 3 seconds.",
    image: "/images/snippet-1.svg",
  },
  {
    number: 3,
    title: "Take it one step at a time.",
    description:
      "Each week, you get one clear action to complete. Tick it off. Move to the next stage. No overwhelm, no skipped steps.",
    image: "/images/snippet-2.svg",
  },
];

const Solution = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const goToStep = (index: number) => {
    setDirection(index > activeStep ? 1 : -1);
    setActiveStep(index);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  const currentStep = steps[activeStep];

  return (
    <section className="w-full">
      <div className="section-class">
        {/* Header Content */}
        <div className="mb-16 text-center md:mb-20">
          <SectionLabelPill>Our Solution</SectionLabelPill>
          <h2 className="mb-4 text-4xl font-medium tracking-tight text-[#0F172A] md:text-5xl">
            How it works
          </h2>
          <p className="text-base text-black-300 md:text-lg">
            We get you up and running in just 3 steps
          </p>
        </div>

        {/* Interactive Content */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left Column: Text Content */}
          <div className="flex flex-col items-start">
            {/* Dots Pagination */}
            <div className="mb-10 flex gap-3">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToStep(idx)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    idx === activeStep
                      ? "w-8 bg-orange-400"
                      : "w-3 bg-orange-100"
                  }`}
                  aria-label={`Go to step ${idx + 1}`}
                />
              ))}
            </div>

            <div className="relative min-h-[200px] w-full overflow-hidden">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={activeStep}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="w-full"
                >
                  <span className="mb-4 block text-sm font-semibold tracking-wider text-gray-700 uppercase">
                    STEP {currentStep.number}
                  </span>
                  <h3 className="mb-4 text-2xl font-bold text-[#0F172A] md:text-3xl">
                    {currentStep.title}
                  </h3>
                  <p className="max-w-md text-lg leading-relaxed text-black-300">
                    {currentStep.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Image Mockup */}
          <div className="flex justify-center lg:justify-end">
            <div
              className={`relative aspect-[606/468] w-full max-w-[606px] overflow-hidden rounded-[32px] bg-accent transition-all duration-500 ${
                activeStep === 0
                  ? "p-6 sm:p-8 lg:p-10"
                  : "px-6 pt-6 pb-0 sm:px-8 sm:pt-8 lg:px-10 lg:pt-10"
              }`}
            >
              <div className="relative h-full w-full">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={activeStep}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                    }}
                    className="relative h-full w-full"
                  >
                    <Image
                      src={currentStep.image}
                      alt={currentStep.title}
                      fill
                      className={`object-contain transition-all duration-500 ${
                        activeStep === 0 ? "object-center" : "object-bottom"
                      }`}
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Solution;
