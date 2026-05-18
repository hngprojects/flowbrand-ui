import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#EBF0FB]">
      {/* ── Half cloud — left edge ── */}
      <div className="pointer-events-none absolute top-12 left-8 w-[280px] select-none md:top-16 md:w-[400px]">
        <Image
          src="/images/bigCloud.png"
          alt=""
          width={160}
          height={100}
          className="h-auto w-full"
          aria-hidden
        />
      </div>

      {/* ── Full cloud — right edge ── */}
      <div className="pointer-events-none absolute top-14 right-0 w-[220px] select-none md:top-24 md:w-[320px]">
        <Image
          src="/images/smallCloud.png"
          alt=""
          width={400}
          height={280}
          className="h-auto w-full"
          aria-hidden
        />
      </div>

      {/* ── Headline ── */}
      <div className="relative z-10 mx-auto mt-8 mb-16 max-w-[440px] px-5 pt-20 pb-0 text-center md:mt-12 md:max-w-[800px] md:pt-24">
        <h1 className="w-full text-[32px] leading-[1.16] font-bold tracking-[-0.5px] text-[#1C3A73] md:text-[54px] md:tracking-[-1.5px] lg:text-[52px]">
          We built <span className="text-[#E58F17]">FlowBrand</span> because
          great marketing shouldn&apos;t require a marketing degree.
        </h1>
      </div>

      {/* ── Image + overlay ── */}
      <div className="relative z-10 mt-10 w-full md:mt-18">
        {/* Desktop */}
        <div className="relative mx-auto hidden w-full md:block">
          <Image
            src="/images/hero.png"
            alt="Small business owners — Maimuna, David, Sarah and Aisha"
            width={1100}
            height={640}
            priority
            className="w-full object-cover object-top"
          />

          {/* Overlay: absolute, pinned to bottom, covers ~40% of image height */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 w-full select-none"
            style={{ height: "42%" }}
          >
            <Image
              src="/images/white.png"
              alt=""
              width={1100}
              height={260}
              className="mt-26 h-full w-full object-cover object-top translate-y-12"
              aria-hidden
            />
          </div>
        </div>

        {/* Mobile */}
        <div className="relative block w-full md:hidden">
          <Image
            src="/images/hero.png"
            alt="Small business owners"
            width={480}
            height={520}
            priority
            className="w-full object-cover object-top"
          />
          {/* Overlay: pinned to bottom, covers ~38% */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 w-full select-none"
            style={{ height: "38%" }}
          >
            <Image
              src="/images/white.png"
              alt=""
              width={480}
              height={200}
              className="h-full w-full object-cover object-top translate-y-6"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </section>
  );
}
