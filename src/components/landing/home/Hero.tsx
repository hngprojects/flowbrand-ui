import Image from "next/image";

const Hero = () => {
  return (
    <section
      className="relative w-full pt-20 overflow-hidden bg-primary-50 to-white"
      style={{ fontFamily: '"Inter", sans-serif' }}
    >
      <div className="absolute w-full h-full z-0 pointer-events-none">
        <Image
          src="/images/smallCloud.png"
          alt="Clouds"
          width={702}
          height={622}
          className="absolute top-0 left-50 -translate-y-20"
          preload={true}
        />
        <Image
          src="/images/bigCloud.png"
          alt="Clouds"
          width={286}
          height={264}
          className=" absolute top-30 right-60"
          preload={true}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 text-center flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center rounded-lg border border-amber-300 bg-white p-2 pr-5 mb-8 shadow-sm">
          <span className="bg-amber-500 text-white text-xs md:text-sm font-semibold px-4 py-1.5 rounded-lg mr-3">
            Simply
          </span>
          <span className="text-foreground/80 text-xs md:text-sm font-medium">
            Made for every kind of Business
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight mb-6 max-w-4xl tracking-tight">
          Grow your business with a smarter{" "}
          <span className="text-amber-500">Marketing Strategy</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-foreground/80 mb-10 max-w-2xl leading-relaxed">
          Manage your entire customer journey from first contact to repeat
          sales, without stress with everything you need in one place.
        </p>

        {/* CTA Button and dotted line */}
        <div className="relative mb-16 flex flex-col items-center">
          <button className="bg-[#3b71e1] hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg transition-colors z-10">
            Create a free account
          </button>
        </div>

        {/* Desktop Image */}
        <div className="w-full max-w-5xl mx-auto relative mt-4 md:mt-8">
          <Image
            src="/images/hero.svg"
            width={1200}
            height={800}
            alt="Seil App Interface on Desktop"
            className="w-full h-auto drop-shadow-2xl rounded-t-xl"
            preload={true}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
