import Image from "next/image";

const WhySection = () => {
  return (
    <section className="w-full h-[17.1rem] md:h-[52.8rem] bg-[var(--background)] mt-[5.3rem] md:mt-[8.4rem] flex flex-col justify-center align-center mb-[2.3rem] md:mb-[5.7rem] py-[1.1rem]">
      <div className="w-[86%] md:w-[74%] mx-auto flex-inline flex justify-center align-center gap-[0.88rem] ">
        <div className="w-[9.3rem] md:w-[28.6rem]  ">
          <div className="flex rounded-full items-center px-[0.26rem] md:px-[0.81rem] md:py-[0.49rem] py-[0.16rem] inline-flex gap-0.5 md:gap-[0.19rem] bg-[#E58F172B]">
            <div className="w-[0.22rem] h-[0.22rem] md:w-[0.69rem] md:h-[0.69rem]  rounded-full bg-[var(--accent)]" />
            <p className="text-[0.22rem] md:text-[0.69rem] text-[var(--accent)] leading-[150%] ">
              Our Story
            </p>
          </div>
          <h2 className="text-[0.69rem] md:text-[2rem] font-[500] leading-[120%] my-[0.28rem] md:my-[0.81rem] ">
            Why we started
          </h2>
          <p className="text-[var(--black-300)] text-[0.4rem] md:text-[1.3rem] ">
            We kept seeing the same story everywhere.
            <span className="block my-1 md:my-4">
              A business owner doing everything, running the operation, managing
              staff, chasing payments and still finding time to post on
              Instagram hoping something would click.
            </span>
            No strategy. No plan. Just effort and hope.
          </p>
        </div>

        {/* mobile */}
        <div className="md:hidden w-[11.3rem] h-[6.6rem] self-center ">
          <Image
            src="/market-woman.png"
            alt="market woman"
            width={180}
            height={105}
            className="w-full object-cover h-full"
          />
        </div>

        {/* desktop */}
        <div className=" hidden md:block w-[34.8rem] h-[20.4rem] self-center ">
          <Image
            src="/desktop-market-woman.png"
            alt="market woman"
            width={557}
            height={326}
            className="w-full object-cover h-full"
          />
        </div>
      </div>

      <div className="relative w-[63%] md:w-[75%] mt-[3.4rem] md:mt-[10.6rem] mx-auto mb-[1.1rem]  ">
        <h2 className="text-[0.65rem] md:text-[2rem] font-[500] leading-[120%] text-center ">
          Seil started as a simple idea
        </h2>
        <Image
          src="/quote-up.svg"
          alt="qoute-up"
          width={14.6}
          height={14.6}
          className="e md:h-[2.8rem] md:w-[2.8rem] "
        />

        <div className="border-[0.04rem] border-[#CFCFCF] rounded w-[90%] md:w-[88.7%]  m-auto ">
          <p className="text-[0.41rem] md:text-[1.25rem] text-[var(--black-400)] leading-[130%] text-center p-[0.49rem] ">
            what if we could ask someone few questions about their business, and
            give them back a marketing strategy that actually fits, built in
            plain English, one step at a time?
          </p>
        </div>
        <Image
          src="/quote-down.svg"
          alt="qoute-down"
          width={14.6}
          height={14.6}
          className="right-0 bottom-[-0.44rem] md:bottom-[-2.2rem]  absolute md:h-[2.8rem] md:w-[2.8rem] "
        />
      </div>
    </section>
  );
};

export default WhySection;
