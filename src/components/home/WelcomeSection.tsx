import Image from "next/image";

/**
 * WelcomeSection component displays an introductory section about Seil.
 * It features a split layout with a mission statement and a high-quality
 * visual representation of a business owner.
 *
 * @returns {JSX.Element} The rendered welcome section.
 */
const WelcomeSection = () => {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-6 py-16 md:px-12 lg:px-20">
      <div className="p-7 md:p-[24px] lg:p-20">
        {/* Header Content */}
        <div className="mb-12 flex flex-col items-start justify-between gap-10 md:mb-16 lg:flex-row lg:items-end">
          {/* Left Column */}
          <div className="w-full lg:w-[60%]">
            <span className="mb-6 block align-middle text-[18px] leading-[1.5] font-medium tracking-normal text-[#2E60BE]">
              Welcome to Seil
            </span>
            <h2 className="align-middle text-[24px] leading-[1.1] font-medium tracking-normal md:text-[48px]">
              We help you attract the right customers and convert them into
              paying buyers
            </h2>
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-[35%]">
            <p className="align-middle text-base leading-[1.75] font-normal tracking-normal text-[#565D69]">
              We built Seil because we kept seeing the same thing: brilliant
              business owners with no clear path to getting customers
              consistently. Not because they were not capable, but because every
              tool out there assumed they already knew what to do.
            </p>
          </div>
        </div>

        {/* Image Section */}
        <div className="relative w-full overflow-hidden">
          <Image
            src="/images/dark-skin-girl-1.jpg"
            alt="A woman working on her business"
            width={1186}
            height={640}
            className="h-auto w-full rounded-xl object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
