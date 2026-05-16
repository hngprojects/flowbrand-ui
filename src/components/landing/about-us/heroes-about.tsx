import Image from "next/image";

const HeroesAbout = () => {
  return (
    <section className="w-full h-[35.7rem] md:h-[74.9rem] bg-[#EBF0FA] overflow-hidden relative">
      <Image
        src="/left-cloud.svg"
        alt="left cloud"
        width={277}
        height={226}
        className="absolute opacity-[100%] md:width-[43.9rem] "
      />

      <div className="  relative mx-auto mt-[4.4rem] md:mt-[11.2rem] w-[92%] px-2 md:w-[65%] ">
        <h1 className="font-[500] text-[2rem] md:text-[3.8rem] leading-[110%] md:leading-[100%] text-center ">
          We built <span className="text-[var(--accent)]">Seil</span> because
          great marketing shouldn't require a marketing degree.
        </h1>
      </div>

      <Image
        src="/right-cloud.svg"
        alt="right cloud"
        width={156}
        height={174}
        className="absolute opacity-[100%] top-[11.6rem] right-0 opacity-[100%] md:width-[18rem] "
      />

      {/* mobile */}
      <div className=" md:hidden absolute mb-0 w-full mt-[4.9rem] bottom-0">
        <Image
          src="/group-of-people.png"
          alt="group of people"
          width={412}
          height={247}
          className="w-full"
        />

        <Image
          src="/stroke.png"
          alt="stroke"
          width={412}
          height={247}
          className="w-full absolute bottom-0 md:hidden "
        />
      </div>

      {/* destop */}

      <div className=" hidden  md:block absolute mb-0 w-full mt-[6.6rem] bottom-0">
        <Image
          src="/desktop-group-of-people.png"
          alt="group of people"
          width={1440}
          height={547}
          className="w-full"
        />

        <Image
          src="/desktop-stroke.png"
          alt="stroke"
          width={2024}
          height={371}
          className="hidden w-full md:block absolute bottom-[-11.6rem] "
        />
      </div>
    </section>
  );
};

export default HeroesAbout;
