import Image from "next/image";

export default function WhyWeStarted() {
  return (
    <section className="w-full ">
      <div className="section-class flex flex-col md:flex-row md:items-center">
        {/* Text — 45% */}
        <div className="w-full flex-shrink-0 md:mt-8 md:w-[50%]">
          <span className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-[#E58F172B] px-3 py-1 text-[11px] font-semibold tracking-wide text-[#E58F17] uppercase">
            <span className="inline-block h-3 w-3 rounded-full bg-[#E58F17]" />
            Our Story
          </span>
          <h2 className="mb-5 text-[22px] font-bold tracking-tight text-[#0D1117] md:text-[26px]">
            Why we started
          </h2>
          <p className="mb-3 text-[16px] leading-relaxed text-black md:text-[18px]">
            We kept seeing the same story everywhere.
          </p>
          <p className="mb-3 text-[16px] leading-relaxed text-black md:text-[18px]">
            A business owner doing everything, running the operation, managing
            staff, chasing payments and still finding time to post on Instagram
            hoping something would click.
          </p>
          <p className="text-[16px] leading-relaxed text-black md:text-[18px]">
            No strategy. No plan. Just effort and hope.
          </p>
        </div>

        {/* Image — 55% */}
        <div className="w-full flex-shrink-0 md:w-[50%]">
          <Image
            src="/images/nkechi.png"
            alt="Nkechi at her provisions store"
            width={500}
            height={380}
            className="hidden h-[340px] w-full rounded-2xl object-cover md:block lg:h-[380px]"
          />
          <Image
            src="/images/nkechi.png"
            alt="Nkechi at her provisions store"
            width={480}
            height={280}
            className="block h-[260px] w-full rounded-2xl object-cover md:hidden"
          />
        </div>
      </div>
    </section>
  );
}
