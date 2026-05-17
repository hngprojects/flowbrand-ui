"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { SectionLabelPill } from "@/components/ui/section-label-pill";
import { testimonialCardClassName } from "@/components/icons/testimonials";

type Testimonial = {
  quote: string;
  name: string;
  image: string;
  alt: string;
};

const row1: Testimonial[] = [
  {
    quote:
      "I used to just post on Instagram and hope for the best. FlowBrand actually tells me what to do on Monday morning. It gave our team of 3 a real system.",
    name: "Sarah Nnaji",
    image: "/images/chef.png",
    alt: "Sarah Nnaji testimonial",
  },
  {
    quote:
      "Before using this, I was just posting and hoping for results. Now I actually have a clear system and I am getting consistent customer inquiries every week.",
    name: "David Brown",
    image: "/images/david.png",
    alt: "David Brown testimonial",
  },
  {
    quote:
      "I did not realize how much I was doing wrong until I started. The step-by-step guidance made everything so easy to follow, and I finally understand how to attract the right customers.",
    name: "Bright Dawin",
    image: "/images/bright.png",
    alt: "Bright Dawin testimonial",
  },
  {
    quote:
      "This gave me structure. I no longer guess what to do next in my marketing, and i’ve already started seeing better engagement and more serious leads.",
    name: "Golda Falcon",
    image: "/images/david.png",
    alt: "Golda Falcon testimonial",
  },
  {
    quote:
      "“I used to struggle with turning interest into actual paying customers. Now i have a proper flow that helps me follow up and close more deals”.",
    name: "Rita Johnson",
    image: "/images/bright.png",
    alt: "Rita Johnson testimonial",
  },
];

const row2: Testimonial[] = [
  {
    quote:
      "I used to overthink my marketing a lot. Now I just follow the steps, and everything feels more organized and effective.",
    name: "Glory Nkene",
    image: "/images/ellipse-1.png",
    alt: "Glory Nkene testimonial",
  },
  {
    quote:
      "This helped me stop wasting time on things that were not working. Now I focus on what actually brings in customers.",
    name: "Ameerah Raji",
    image: "/images/ellipse-2.png",
    alt: "Ameerah Raji testimonial",
  },
  {
    quote:
      "I finally understand my customer journey, from attracting them to getting them to buy. It all makes sense now.",
    name: "Darwin Muri",
    image: "/images/ellipse-3.png",
    alt: "Darwin Muri testimonial",
  },
  {
    quote:
      "I have tried different strategies before, but this is the first time something actually feels simple and actionable.",
    name: "Jordan Coal",
    image: "/images/ellipse-1.png",
    alt: "Jordan Coal testimonial",
  },
  {
    quote:
      "My biggest win is consistency. I now show up with a plan, not just vibes and it’s paying off.",
    name: "Ray Sybil",
    image: "/images/ellipse-2.png",
    alt: "Ray Sybil testimonial",
  },
];

function TestimonialRow({
  items,
  direction = "left",
}: {
  items: Testimonial[];
  direction?: "left" | "right";
}) {
  // Duplicate items for seamless loop
  const duplicatedItems = [...items, ...items];

  return (
    <div className="w-full overflow-hidden py-2 sm:py-4">
      <motion.div
        className="flex min-w-max gap-3 px-1 sm:gap-4 md:gap-6 md:px-2"
        animate={{
          x: direction === "left" ? [0, "-50%"] : ["-50%", 0],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {duplicatedItems.map((t, index) => (
          <Card key={index} className={testimonialCardClassName}>
            <p className="w-full text-sm leading-snug text-black-500 sm:text-base sm:leading-[130%] md:text-lg lg:text-[20px]">
              “{t.quote}”
            </p>
            <div className="flex w-full items-center justify-center gap-2 sm:gap-2.5">
              <Image
                src={t.image}
                alt={t.alt}
                width={40}
                height={40}
                className="size-8 shrink-0 rounded-full sm:size-10"
              />
              <span className="text-sm font-medium text-black-500 sm:text-base">
                {t.name}
              </span>
            </div>
          </Card>
        ))}
      </motion.div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="w-full">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="bg-badge-bg mb-2 flex items-center gap-2 rounded-xl px-4 py-2">
          <div className="bg-badge-fg h-4 w-4 rounded-full"></div>
          <SectionLabelPill>Testimonials</SectionLabelPill>
        </div>
        <h2 className="mb-6 px-4 text-2xl font-medium tracking-tight text-black-500 sm:mb-8 sm:text-4xl md:text-5xl">
          Trusted by growing businesses
        </h2>
        <div className="w-full space-y-4 sm:space-y-6 md:space-y-8">
          <TestimonialRow items={row1} direction="left" />
          <TestimonialRow items={row2} direction="right" />
        </div>
      </div>
    </section>
  );
}
