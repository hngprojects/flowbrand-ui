"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Step {
  id: number;
  title: string;
  description: string;
  image: string;
  align?: "center" | "bottom";
}

const steps: Step[] = [
  {
    id: 1,
    title: "Tell us about your business.",
    description:
      "Upload your business documents or answer 3 plain questions to get started— no marketing knowledge needed!",
    image: "/images/snippet.png",
    align: "center",
  },
  {
    id: 2,
    title: "We build your marketing strategy",
    description:
      "Seil matches your answers to the right strategy plan type and personalizes every stage for your business. Done in under 3 seconds.",
    image: "/images/snippet-1.png",
    align: "bottom",
  },
  {
    id: 3,
    title: "Take it one step at a time.",
    description:
      "Each week, you get one clear action to complete. Tick it off. Move to the next stage. No overwhelm, no skipped steps.",
    image: "/images/snippet-2.png",
    align: "bottom",
  },
];

const Solution = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir > 0 ? -50 : 50,
      opacity: 0,
    }),
  };

  return (
    <div
      className="w-full py-16 px-4 md:px-8 lg:px-16 overflow-hidden"
      style={{ fontFamily: '"Inter", sans-serif' }}
    >
      {/* Header */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-amber-600 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Our Solution
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-foreground">
          How it works
        </h2>
        <p className="text-foreground/80 text-lg">
          We get you up and running in just 3 steps
        </p>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-7xl mx-auto">
        {/* Left Content */}
        <div className="flex flex-col justify-center">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
              }}
              className="flex flex-col justify-center"
            >
              {/* Navigation Dots */}
              <div className="flex gap-2 mb-10">
                {steps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setDirection(index > currentStep ? 1 : -1);
                      setCurrentStep(index);
                    }}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentStep
                        ? "w-8 h-2.5 bg-amber-500"
                        : "w-2.5 h-2.5 bg-amber-100 hover:bg-amber-200"
                    }`}
                    aria-label={`Go to step ${index + 1}`}
                  />
                ))}
              </div>

              {/* Step Number */}
              <div className="mb-4">
                <span className="text-foreground/80 text-sm font-semibold tracking-wider uppercase">
                  STEP {currentStep + 1}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground mb-4 leading-tight">
                {steps[currentStep].title}
              </h3>

              {/* Description */}
              <p className="text-foreground/80 leading-relaxed text-lg max-w-lg">
                {steps[currentStep].description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Image Container */}
        <div className="flex justify-center w-full">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
              }}
              className="w-full max-w-md mx-auto"
            >
              {/* Orange Background Container */}
              <div
                className={`relative w-full aspect-[4/3] rounded-[2rem] bg-amber-500 flex justify-center overflow-hidden ${
                  steps[currentStep].align === "bottom"
                    ? "items-end pt-6 px-2 md:pt-10 md:px-4"
                    : "items-center py-4 px-2 md:py-6 md:px-4"
                }`}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                  className="w-full h-full flex justify-center"
                >
                  <Image
                    src={steps[currentStep].image}
                    alt={`Step ${currentStep + 1}: ${steps[currentStep].title}`}
                    className="max-w-full max-h-full object-contain object-bottom rounded-xl"
                    width={600}
                    height={400}
                  />
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Solution;
