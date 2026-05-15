import Image from "next/image";

const Features = () => {
  return (
    <section
      className="w-full py-16 px-4 md:px-8 lg:px-16"
      style={{ fontFamily: '"Inter", sans-serif' }}
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Badge */}
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-amber-600 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Features
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-foreground text-center tracking-tight">
          Everything you need to grow
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {/* Card 1: Guided Setup */}
          <div className="bg-black rounded-[2rem] p-8 flex flex-col h-[405px] shadow-sm">
            <div className="flex-1 flex justify-start items-start">
              <Image
                src="/images/feature-1.png"
                alt="Guided Setup"
                width={80}
                height={80}
                className="w-[80px] h-auto object-contain"
              />
            </div>
            <div className="mt-auto">
              <h3 className="text-white text-xl font-semibold mb-3">
                Guided Setup
              </h3>
              <p className="text-gray-400 text-xs font-medium leading-relaxed">
                Build the best marketing strategy for your business with clear,
                step by step support
              </p>
            </div>
          </div>

          {/* Card 2: Progress Tracking */}
          <div className="relative rounded-[2rem] overflow-hidden flex flex-col h-[405px] group shadow-sm">
            <Image
              src="/images/dark-skin-girl-2.jpg"
              alt="Progress Tracking"
              width={405}
              height={456}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Dark Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/90 via-[#1a1a1a]/30 to-transparent"></div>
            <div className="relative z-10 mt-auto p-8">
              <h3 className="text-white text-xl font-semibold mb-3">
                Progress Tracking
              </h3>
              <p className="text-gray-200 text-xs font-medium leading-relaxed">
                Track every stage of your marketing and see what to improve on
                next, without guess work
              </p>
            </div>
          </div>

          {/* Card 3: Smarter Conversions */}
          <div className="md:col-span-2 lg:col-span-1 md:flex md:justify-center lg:block">
            <div className="bg-[#7ba4ed] rounded-[2rem] p-6 flex flex-col h-[405px] relative overflow-hidden shadow-sm w-full md:max-w-[calc(50%-12px)] lg:max-w-none">
              {/* Top Section with Vector Graphic */}
              <div className="flex-1 relative w-full pt-4 px-0 bg-white/25 rounded-[1.5rem]">
                {/* "From Business Idea" text */}
                <div className="absolute top-5 left-5">
                  <p className="text-white/90 text-md font-medium leading-tight">
                    From
                    <br />
                    Business Idea
                  </p>
                </div>

                {/* Vector Arrow Graphic */}
                <div className="absolute top-16 left-10 w-[90px] h-[50px]">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 90 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="overflow-visible"
                  >
                    {/* Starting Dot */}
                    <circle cx="5" cy="5" r="4" fill="white" />
                    {/* Curved Dashed Path */}
                    <path
                      d="M5 10 C 5 40, 20 45, 85 45"
                      stroke="white"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      fill="none"
                    />
                    {/* Arrow Head */}
                    <path
                      d="M75 37 L87 45 L75 53"
                      stroke="white"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* "Real Marketing Strategies" text */}
                <div className="absolute top-[5rem] left-[8rem] w-full">
                  <p className="text-white text-2xl md:text-[1.25rem] lg:text-[1.5rem] font-semibold leading-snug">
                    Real Marketing
                    <br />
                    Strategies
                  </p>
                </div>
              </div>

              <div className="mt-20 px-2">
                <h3 className="text-white text-xl font-semibold mb-3">
                  Smarter Conversions
                </h3>
                <p className="text-white/85 text-xs font-medium leading-relaxed">
                  Convert leads into real customers with better inquiry and
                  booking flows.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
