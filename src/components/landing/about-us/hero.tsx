import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#EBF0FB]">
      <div className="absolute w-full h-full z-0 pointer-events-none hidden lg:block">
        <Image
          src="/images/smallCloud.png"
          alt="Clouds"
          width={702}
          height={622}
          className="absolute top-0"
          preload={true}
        />
        <Image
          src="/images/bigCloud.png"
          alt="Clouds"
          width={286}
          height={264}
          className=" absolute top-[15%] right-0"
          preload={true}
        />
      </div>

      <div className="absolute w-full h-full z-0 pointer-events-none block lg:hidden">
        <Image
          src="/images/smallCloud.png"
          alt="Clouds"
          width={277}
          height={226}
          className="absolute top-0"
          preload={true}
        />
        <Image
          src="/images/bigCloud.png"
          alt="Clouds"
          width={156}
          height={174}
          className=" absolute top-[30%] right-0"
          preload={true}
        />
      </div>

      {/* ── Headline ── */}
      <div className="relative z-10 mx-auto mt-8 max-w-[440px] px-5 pt-[7%] text-center lg:max-w-[850px] font-[500]">
        <h1 className="w-full text-[32px] lg:text-[60px] font-[500] leading-tight tracking-tight text-black">
          We built <span className="text-[#E58F17]">Seil </span> because great
          marketing shouldn&apos;t require a marketing degree.
        </h1>
      </div>

      {/* ── Image + overlay ── */}
      <div className="relative z-10 w-full mt-12 md:mt-0 md:-mb-14">
        {/* Desktop */}
        <div className="relative mx-auto hidden w-full lg:block w-full ">
          <Image
            src="/images/new-hero.png"
            alt="Small business owners — Maimuna, David, Sarah and Aisha"
            width={1100}
            height={640}
            priority
            className="relative left-1/2 -translate-x-1/2 w-[calc(100svw+300px)] max-w-[2000px]"
          />

          {/* Overlay: absolute, pinned to bottom, covers ~40% of image height */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0  select-none flex justify-center translate-y-1/4">
            <Image
              src="/images/white2.png"
              alt=""
              width={1450}
              height={778}
              className="w-[calc(100svw+300px)] max-w-[calc(100svw+300px)]  -mx-35"
              aria-hidden
            />
          </div>
        </div>

        {/* Mobile */}
        <div className="relative mx-auto block w-full lg:hidden">
          <Image
            src="/images/new-hero.png"
            alt="Small business owners"
            width={1100}
            height={640}
            priority
            className="relative left-1/2 -translate-x-1/2 w-[calc(100svw+100px)] max-w-[2000px]"
          />
          {/* Overlay: pinned to bottom, covers ~38% */}
          <div className="pointer-events-none absolute -bottom-[17%] left-0 w-full select-none">
            <Image
              src="/images/white.png"
              alt=""
              width={480}
              height={200}
              className="h-full w-full object-cover object-top"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </section>
  );
}
