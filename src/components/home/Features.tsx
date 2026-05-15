import Image from "next/image";

const Features = () => {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-6 py-4 md:px-12 lg:px-20">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-amber-600 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Features
          </span>
        </div>
        <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
          Everything you need to grow
        </h2>
      </div>

      {/* Features Grid */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
        {/* Card 1: Guided Setup */}
        <div className="flex h-full min-h-80 flex-col justify-between rounded-3xl bg-black p-8 text-white">
          {/* Icon */}
          <div className="mb-6">
            <Image
              src="/images/feature-1.png"
              alt="Guided Setup"
              width={111}
              height={111}
            />
          </div>

          {/* Content */}
          <div>
            <h3 className="mb-3 text-2xl font-bold">Guided Setup</h3>
            <p className="text-sm leading-relaxed text-gray-300">
              Build the best marketing strategy for your business with clear,
              step by step support
            </p>
          </div>
        </div>

        {/* Card 2: Progress Tracking */}
        <div className="h-full min-h-80 overflow-hidden rounded-3xl">
          <div className="relative flex h-full items-end bg-gradient-to-br from-gray-200 to-gray-300">
            {/* Placeholder for image */}
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/40 to-transparent p-8">
              <h3 className="mb-2 text-2xl font-bold text-white">
                Progress Tracking
              </h3>
              <p className="text-sm leading-relaxed text-white">
                Track every stage of your marketing and see what improves
                convert, without guess work
              </p>
            </div>
            {/* Image area - using placeholder styling */}
            <Image
              src="/images/dark-skin-girl-2.jpg"
              alt="Progress Tracking"
              className="h-full w-full object-cover"
              width={405}
              height={456}
            />
          </div>
        </div>

        {/* Card 3: Smarter Conversions */}
        <div className="bg-[#7ba4ed] rounded-[2rem] p-6 flex flex-col min-h-80 relative overflow-hidden shadow-sm">
          {/* Top Section with Vector Graphic */}
          <div className="flex-1 relative w-full pt-4 px-0 bg-white/25 rounded-[1.5rem]">
            {/* "From Business Idea" text */}
            <div className="absolute top-5 left-5">
              <p className="text-white/90 text-sm font-medium leading-tight">
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
              <p className="text-white text-[1rem] font-semibold leading-snug">
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
            <p className="text-white/85 text-sm leading-relaxed">
              Convert leads into real customers with better inquiry and booking
              flows.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
