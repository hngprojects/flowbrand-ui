import Link from "next/link";
import { Button } from "@/components/ui/button";

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

        <Button
          asChild
          className="md:w-[232px] md:mx-auto w-full h-[56px] text-lg rounded-[10px]"
        >
          <Link href="/register">Create a free account</Link>
        </Button>
      </div>
    </section>
  );
};

export default CtaSection;
