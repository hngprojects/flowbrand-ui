export default function Mission() {
  return (
    <section className="w-full bg-[#FCF4E8]">
      <div className="section-class max-w-5xl flex flex-col items-center py-30 text-center">
        <span className="mb-5 text-[11px] font-semibold tracking-[1.6px] text-black uppercase">
          Our Mission
        </span>

        {/* Figma: regular weight italic, not bold — matches the elegant feel */}
        <h2 className="text-[22px] leading-[1.4] font-normal tracking-[-0.2px] text-black italic md:text-[32px] lg:text-[40px]">
          Our mission is to give every business owner a clear path to getting
          consistent customers.
        </h2>
      </div>
    </section>
  );
}
