import Image from "next/image";

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden bg-primary-50 to-white">
      <div className="absolute w-full h-full z-0 pointer-events-none">
        <Image
          src="/images/smallCloud.png"
          alt="Clouds"
          width={702}
          height={622}
          className="absolute top-0 hidden lg:block"
          preload={true}
        />
        <Image
          src="/images/bigCloud.png"
          alt="Clouds"
          width={286}
          height={264}
          className=" absolute top-[15%] right-0 hidden lg:block"
          preload={true}
        />
      </div>

      <div className="relative z-10 pt-[10%] max-w-7xl mx-auto px-4 md:px-8 text-center flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center rounded-lg border-[1.5px] border-accent p-[10px] mb-6 shadow-sm">
          <span className="bg-accent text-white text-[16px] font-[500] h-[28px] w-[78px] rounded-lg mr-3 flex items-center justify-center">
            Simply
          </span>
          <span className="text-foreground/80 text-[14px] font-[400]">
            Made for every kind of Business
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-[32px] md:text-[60px] font-[500] text-foreground leading-tight mb-6 max-w-3xl tracking-tight">
          Grow your business with a smarter{" "}
          <span className="text-accent">Marketing Strategy</span>
        </h1>

        {/* Subtitle */}
        <p className="text-[14px] md:text-[18px] font-[400] text-foreground/80 mb-5 max-w-2xl leading-relaxed">
          Manage your entire customer journey from first contact to repeat
          sales, without stress with everything you need in one place.
        </p>

        {/* CTA Button and dotted line */}
        <div className="relative mb-6 flex flex-col items-center">
          <button className="bg-primary-500 hover:bg-primary-600 text-[16px] text-white font-[500] py-3 px-8 rounded-lg transition-colors z-10 hover:cursor-pointer">
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
