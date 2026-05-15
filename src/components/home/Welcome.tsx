import React from "react";
import Image from "next/image";

const Welcome = () => {
  return (
    <section
      className="w-full py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto"
      style={{ fontFamily: '"Inter", sans-serif' }}
    >
      <div className="flex flex-col lg:flex-row justify-between items-start mb-10 gap-8 lg:gap-16">
        {/* Left Column */}
        <div className="flex-1 max-w-2xl">
          <span className="inline-block text-blue-600 font-medium mb-4 text-sm md:text-base tracking-wide">
            Welcome to Seil
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground leading-tight">
            We help you attract the right customers and convert them into paying
            buyers
          </h2>
        </div>

        {/* Right Column */}
        <div className="flex-1 lg:max-w-md lg:pt-10">
          <p className="text-foreground/80 text-sm md:text-base leading-relaxed">
            We built Seil because we kept seeing the same thing: brilliant
            business owners with no clear path to getting customers
            consistently. Not because they&apos;re not capable, but b
          </p>
        </div>
      </div>

      {/* Image Section */}
      <div className="w-full rounded-[1rem] overflow-hidden">
        <Image
          src="/images/dark-skin-girl-1.jpg"
          width={1200}
          height={600}
          alt="Business owner working on a laptop"
          className="w-full h-auto object-cover object-center"
        />
      </div>
    </section>
  );
};

export default Welcome;
