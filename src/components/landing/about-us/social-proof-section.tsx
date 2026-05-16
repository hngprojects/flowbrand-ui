import Image from "next/image";

const LOGOS = [
  {
    src: "/repair-service.svg",
    alt: "repair service",
    width: 228,
    height: 67,
    className: "w-[80px] h-[40px] md:w-[228px] md:h-[67px]",
  },
  {
    src: "/beauty-salon.svg",
    alt: "beauty salon",
    width: 239,
    height: 67,
    className: "w-[80px] h-[40px] md:w-[239px] md:h-[67px]",
  },
  {
    src: "/bakery.svg",
    alt: "bakery",
    width: 118,
    height: 67,
    className: "w-[80px] h-[40px] md:w-[118px] md:h-[67px]",
  },
  {
    src: "/small-retail.svg",
    alt: "small retail",
    width: 172,
    height: 67,
    className: "w-[80px] h-[40px] md:w-[172px] md:h-[67px]",
  },
  {
    src: "/agency.svg",
    alt: "agency",
    width: 139,
    height: 67,
    className: "w-[80px] h-[40px] md:w-[139px] md:h-[67px]",
  },
] as const;

const SocialProof = () => {
  return (
    <section className="w-full mb-[84px]">
      <div className="mt-[56px]">
        <h2 className=" text-center text-[12px] text-[#8B9098] font-[400] md:font-[500]  md:text-[20px]  mb-[8px] md:mb-[26px] ">
          Used by small businesses like yours to build and grow with confidence
        </h2>

        <div className="w-full flex justify-between align-center gap-[7px]  overflow-hidden ">
          {LOGOS.map((logo) => (
            <Image
              key={logo.src}
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              unoptimized
              className={logo.className}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
