const SocialProof = () => {
  return (
    <section className="w-full mb-[84px]">
      <div className="mt-[56px]">
        <h2 className=" text-center text-[12px] text-[#8B9098] font-[400] md:font-[500]  md:text-[20px]  mb-[8px] md:mb-[26px] ">
          Used by small businesses like yours to build and grow with confidence
        </h2>

        <div className="w-full flex justify-between align-center gap-[7px]  overflow-hidden ">
          <img
            src="/repair-service.svg"
            alt="repair service"
            className="w-[80px] h-[40px] md:w-[228px] md:h-[67px]"
          />

          <img
            src="/beauty-salon.svg"
            alt="beauty salon"
            className="w-[80px] h-[40px] md:w-[239px] md:h-[67px]"
          />

          <img
            src="/bakery.svg"
            alt="bakery"
            className="w-[80px] h-[40px] md:w-[118px] md:h-[67px]"
          />

          <img
            src="/small-retail.svg"
            alt="small retail"
            className="w-[80px] h-[40px] md:w-[172px] md:h-[67px]"
          />

          <img
            src="/agency.svg"
            alt="agency"
            className="w-[80px] h-[40px] md:w-[139px] md:h-[67px]"
          />
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
