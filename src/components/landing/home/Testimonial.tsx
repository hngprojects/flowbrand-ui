"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface Testimonial {
  id: number;
  name: string;
  quote: string;
  image: string;
}

const testimonials1: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Ntiaji",
    quote:
      "I used to just post on Instagram and hope for the best. Not actually tells me what I plan on doing on Monday morning. It gave our team of 3 a real system.",
    image: "/images/redgirl.jpg",
  },
  {
    id: 2,
    name: "David Brown",
    quote:
      "Before using this, I was just posting daily. Now I actually have a clear system and I'm getting consistent customer inquiries every week.",
    image: "/images/blackguy.jpg",
  },
  {
    id: 3,
    name: "Bright Dawkm",
    quote:
      "I didn't realize how much I was doing until I started. The step-by-step makes everything so easy to follow. I can't wait to attract the right customers.",
    image: "/images/suitguy.jpg",
  },
  {
    id: 4,
    name: "Glory Nkeme",
    quote:
      "I used to overthink my marketing at. Now I just follow the steps, and everything feels more organized and effective.",
    image: "/images/redgirl.jpg",
  },
  {
    id: 5,
    name: "Ameerah Raji",
    quote:
      "This helped stop wasting time on things that weren't working. Now I focus on what actually brings in customers.",
    image: "/images/whitegirl.png",
  },
];

const testimonials2: Testimonial[] = [
  {
    id: 6,
    name: "Darwin Muri",
    quote:
      "This gave me structure. I no longer guess what to do next in my marketing, and i’ve already started seeing better engagement and more serious leads.",
    image: "/images/redgirl.jpg",
  },
  {
    id: 7,
    name: "Emma Wilson",
    quote:
      "I used to struggle with turning interest into actual paying customers. Now i have a proper flow that helps me follow up and close more deals.",
    image: "/images/whiteman.jpg",
  },
  {
    id: 8,
    name: "Marcus Thompson",
    quote:
      "Game changer for our small business. We've tripled our customer inquiries.",
    image: "/images/suitguy.jpg",
  },
  {
    id: 9,
    name: "Lisa Chen",
    quote:
      "I didn’t expect results this quickly. Within a short time, I started getting more serious inquiries from ready to buy customers.",
    image: "/images/blackguy.jpg",
  },
  {
    id: 10,
    name: "James Roberts",
    quote:
      "I have tried different strategies before, but this is the first time something actually feels simple and actionable.",
    image: "/images/glory.jpg",
  },
];

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <div className=" shrink-0 w-100 px-4">
    <div className="bg-card rounded-2xl p-6 h-full border border-border shadow-sm hover:shadow-md transition-shadow">
      {/* Quote */}
      <p className="text-foreground text-sm font-medium leading-relaxed mb-6 min-h-24">
        {testimonial.quote}
      </p>

      {/* Divider */}
      <div className="mt-6">
        {/* Profile Section - Centered */}
        <div className="flex items-center justify-center gap-2">
          {/* Profile Image */}
          <div>
            <Image
              src={testimonial.image}
              alt={testimonial.name}
              className="w-6 h-6 rounded-full object-cover"
              width={24}
              height={24}
            />
          </div>

          {/* Name */}
          <h4 className="text-gray-900 font-semibold text-sm text-center">
            {testimonial.name}
          </h4>
        </div>
      </div>
    </div>
  </div>
);

const TestimonialRow = ({
  testimonials,
  direction,
}: {
  testimonials: Testimonial[];
  direction: "left" | "right";
}) => {
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex w-max"
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          duration: direction === "left" ? 40 : 45,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
        }}
      >
        {duplicatedTestimonials.map((testimonial, index) => (
          <TestimonialCard
            key={`${testimonial.id}-${index}`}
            testimonial={testimonial}
          />
        ))}
      </motion.div>
    </div>
  );
};

const Testimonial = () => {
  return (
    <div
      className="w-full py-16 px-4 md:px-8 lg:px-16"
      style={{ fontFamily: '"Inter", sans-serif' }}
    >
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-amber-600 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Testimonials
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-foreground">
          Trusted by growing businesses
        </h2>
      </div>

      {/* Testimonials Container */}
      <div className="space-y-8">
        {/* Row 1 - Moving Right to Left */}
        <TestimonialRow testimonials={testimonials1} direction="left" />

        {/* Row 2 - Moving Left to Right */}
        <TestimonialRow testimonials={testimonials2} direction="right" />
      </div>
    </div>
  );
};

export default Testimonial;
