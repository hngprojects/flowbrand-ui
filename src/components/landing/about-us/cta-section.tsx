import Link from "next/link";

const CtaSection = () => {
  return (
    <section className="w-full">
      <div className="section-class max-w-5xl flex flex-col justify-center align-center md:gap-[1rem] mx-auto ">
        <h1 className="text-[2rem] md:text-[3rem] font-[500] leading-[110%] text-center ">
          Get a step-by-step marketing strategy in minutes
        </h1>
        <p className="text-[1rem] text-[var(--black-300)] leading-[150%] text-center mt-[0.69rem] mb-[1rem] ">
          A simple marketing plan that attracts, nurtures, and converts
          customers without stress
        </p>

        <Link
          href="/signup"
          className="bg-[var(--primary)] font-[500] text-[1rem] text-white py-[0.69rem] px-[2rem] rounded-[0.63rem] transition-colors duration-300 self-center inline-flex justify-center align-center"
        >
          Create a free account
        </Link>
      </div>
    </section>
  );
};

export default CtaSection;
