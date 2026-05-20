import Image from "next/image";

const Welcome = () => {
  return (
    <section className="w-full" style={{ fontFamily: '"Inter", sans-serif' }}>
      <div className="section-class">
        <div className="flex flex-col lg:flex-row justify-between items-start mb-10 gap-8 lg:gap-16">
          {/* Left Column */}
          <div className=" w-full lg:w-[58%]">
            <span className="inline-block text-blue-600 font-bold mb-4 text-sm md:text-base tracking-wide">
              Welcome to Seil
            </span>
            <h2 className="text-[24px] md:text-[32px] lg:text-[48px] font-semibold text-foreground leading-tight">
              We help you attract the right customers and convert them into
              paying buyers
            </h2>
          </div>

          {/* Right Column */}
          <div className="flex-1 lg:max-w-md lg:pt-10">
            <p className="text-foreground/80 text-sm md:text-xl leading-relaxed">
              We built Seil because we kept seeing the same thing: brilliant
              business owners with no clear path to getting customers
              consistently. Not because they weren&apos;t capable, but because
              every tool out there assumed they already knew what to do.
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
      </div>
    </section>
  );
};

export default Welcome;
