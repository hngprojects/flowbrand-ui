import Image from "next/image";
import { SectionLabelPill } from "../ui/section-label-pill";

const Features = () => {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-6 py-4 md:px-12 lg:px-20">
      {/* Header */}
      <div className="mb-12 text-center">
        <SectionLabelPill>Features</SectionLabelPill>
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
        <div className="relative flex h-full min-h-80 flex-col justify-between rounded-3xl bg-[#769BE0] p-3 text-white">
          {/* From Tag */}
          <div className="rounded-xl bg-[#A1BAEA] p-3">
            <div>
              <div className="mb-4">
                <span className="text-xs font-semibold text-blue-100 opacity-75">
                  From
                </span>
                <p className="text-lg font-bold">Business Idea</p>
              </div>

              {/* Dashed Arrow with Curve and Ball */}
              <svg
                style={{
                  position: "absolute",
                  width: "119.26608269285097px",
                  height: "24.986453995172663px",
                  top: "85px",
                  left: "31px",
                  transform: "rotate(-28.06deg)",
                  opacity: 1,
                }}
                viewBox="0 0 119.27 34.99"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Ball at tail end (inverted position) */}
                <circle cx="113.27" cy="22.49" r="6" fill="white" />

                {/* Curved dashed line that bends opposite direction */}
                <path
                  d="M 107.27 22.49 Q 59.27 -5 10 14.99"
                  stroke="white"
                  strokeWidth="3"
                  strokeDasharray="6, 6"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Arrowhead pointing diagonally downward */}
                <polygon points="10,14.99 17,5 12,11 22,20" fill="white" />
              </svg>
            </div>
            {/* Real Marketing Strategies Box - Right Side */}
            <div className="absolute right-4 bottom-55 max-w-[150px]">
              <h3 className="text-sm leading-tight font-bold text-white">
                Real Marketing
                <br />
                Strategies
              </h3>
            </div>
          </div>
          {/* Content - Bottom */}
          <div className="mt-auto p-6">
            <h4 className="mb-2 text-[24px] font-bold">Smarter Conversions</h4>
            <p className="text-[16px] leading-relaxed text-blue-50">
              Convert leads into real customers with better inquiry and booking
              flows
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
