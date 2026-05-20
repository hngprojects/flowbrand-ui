import Image from "next/image";
import { cn } from "@/lib/utils";
import CreateSection from "../home/Create";
const HowItWorks = () => {
  const steps = [
    {
      title: "Tell us about your business.",
      desc: "Upload your business documents or answer 3 plain questions to get started, no marketing knowledge needed.",
      image: "/images/snippet.svg",
    },
    {
      title: "We build your marketing strategy",
      desc: "Seil matches your answers to the right strategy plan type and personalizes every stage for your business. Done in under 3 seconds.",
      image: "/images/snippet-1.svg",
    },
    {
      title: "Take it one step at a time.",
      desc: "Each week, you get one clear action to complete. Tick it off. Move to the next stage. No overwhelm, no skipped steps.",
      image: "/images/snippet-2.svg",
    },
  ];
  return (
    <main className="w-full space-y-15">
      <div className="bg-primary-50 h-[300px] md:h-[400px] w-full relative flex flex-col items-center justify-center overflow-hidden px-4">
        <div className="max-w-[721px] space-y-2 text-center z-10">
          <h1 className="text-[28px] md:text-[40px] text-black-500 font-[500] leading-tight">
            From setup to growth in three steps
          </h1>

          <p className="text-[16px] md:text-[18px] text-black-300 max-w-[660px] mx-auto">
            Seil takes you from understanding your business to running a fully
            structured marketing Strategy, step by step.
          </p>
        </div>

        {/* ----CLOUD IMAGES---- */}
        <div className="absolute w-full h-full z-0 pointer-events-none">
          <Image
            src="/images/smallCloud.png"
            alt="Clouds"
            width={702}
            height={622}
            className="absolute top-[20%] left-0 hidden lg:block"
            preload={true}
          />
          <Image
            src="/images/bigCloud.png"
            alt="Clouds"
            width={286}
            height={264}
            className=" absolute top-[65%] right-0 hidden lg:block"
            preload={true}
          />
        </div>
      </div>

      <div className="w-full bg-primary-60 py-10">
        {steps.map((step, index) => (
          <div
            key={index}
            className={cn(
              "flex flex-col md:flex-row justify-between items-center gap-10 section-class",
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse",
            )}
          >
            <div className="space-y-8 md:space-y-[41px] max-w-[540px] w-full">
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
                  STEP {index + 1}
                </h2>
                <h2 className="text-[22px] md:text-[32px] text-foreground font-medium leading-tight">
                  {step.title}
                </h2>
                <p className="text-[16px] md:text-[18px] text-black-300 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center bg-accent p-4 lg:p-10 rounded-xl">
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

      <CreateSection />
    </main>
  );
};

export default HowItWorks;
