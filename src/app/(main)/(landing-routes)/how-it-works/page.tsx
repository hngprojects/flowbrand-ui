import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
const HowItWorks = () => {
  const steps = [
    {
      title: "Tell us about your business.",
      desc: "Upload your business documents or answer 3 plain questions to get started— no marketing knowledge needed.",
      image: "/step1.png",
    },
    {
      title: "We build your marketing strategy",
      desc: "Seil matches your answers to the right strategy plan type and personalizes every stage for your business. Done in under 3 seconds.",
      image: "/step2.png",
    },
    {
      title: "Take it one step at a time.",
      desc: "Each week, you get one clear action to complete. Tick it off. Move to the next stage. No overwhelm, no skipped steps.",
      image: "/step3.png",
    },
  ];
  return (
    <main className="space-y-[84px] bg-white">
      <div className="bg-primary-50 h-[300px] md:h-[400px] w-full relative flex flex-col items-center justify-center overflow-hidden px-4">
        <div className="max-w-[721px] space-y-6 text-center z-10">
          <h1 className="text-[28px] md:text-[40px] text-black-500 font-medium leading-tight">
            From setup to growth in three steps
          </h1>

          <p className="text-[16px] md:text-[18px] text-black-300 max-w-[600px] mx-auto">
            Seil takes you from understanding your business to running a fully
            structured marketing Strategy—step by step.
          </p>
        </div>

        {/* ----CLOUD IMAGES---- */}
        <Image
          src="/images/big-cloud.png"
          aria-hidden
          alt="Cloud"
          width={445}
          height={447}
          className="absolute -left-20 md:left-0 top-10 md:top-30 w-[200px] md:w-[445px] opacity-50 md:opacity-100"
        />
        <Image
          src="/images/small-cloud.png"
          aria-hidden
          alt="Cloud"
          width={286}
          height={264}
          className="absolute -right-10 md:right-0 top-40 md:top-60 w-[150px] md:w-[286px] opacity-50 md:opacity-100"
        />
      </div>

      <div className="space-y-12 md:space-y-20 mx-auto">
        {steps.map((step, index) => (
          <div
            key={index}
            className={cn(
              "flex flex-col md:flex-row justify-between items-center gap-10 bg-[#FBFCFF] py-12 md:py-20 px-6 md:px-20",
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse",
            )}
          >
            <div className="space-y-8 md:space-y-[41px] max-w-[500px] w-full">
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((num) => (
                  <div
                    key={num}
                    className={cn(
                      "w-[15px] h-[15px] bg-accent-50 rounded-full",
                      index + 1 === num && "bg-accent w-[41px]",
                    )}
                  ></div>
                ))}
              </div>
              <div className="space-y-2">
                <h2 className="text-[14px] md:text-[18px] text-black-300 font-medium font-heading">
                  Step {index + 1}
                </h2>
                <h2 className="text-[22px] md:text-[32px] text-foreground font-medium leading-tight">
                  {step.title}
                </h2>
                <p className="text-[16px] md:text-[18px] text-black-300 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
              <Image
                src={step.image}
                alt={step.title}
                width={606}
                height={468}
                className="w-full max-w-[500px] md:max-w-none h-auto object-contain"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center gap-8 px-6 py-12 md:py-20 text-center">
        <div className="space-y-4 max-w-[800px]">
          <h2 className="text-[28px] md:text-[48px] text-foreground font-medium leading-tight">
            Get a step-by-step marketing strategy in minutes
          </h2>
          <p className="text-[16px] md:text-[18px] text-black-400">
            A simple marketing plan that attracts, nurtures, and converts
            customers without stress
          </p>
        </div>
        <Button
          asChild
          className="md:w-[232px] w-full h-[56px] text-lg rounded-[10px]"
        >
          <Link href="/register">Create a free account</Link>
        </Button>
      </div>
    </main>
  );
};

export default HowItWorks;
