import Hero from "@/components/landing/about-us/hero";
import WhyWeStarted from "@/components/landing/about-us/WhyWeStarted";
import MissionSection from "@/components/landing/about-us/mission";
import SocialProof from "@/components/landing/home/SocialProof";
import SimpleIdea from "@/components/landing/about-us/SimpleIdea";
import CreateSection from "@/components/landing/home/Create";

const AboutUs = () => {
  return (
    <section className="w-full bg-[#FFFFFF]">
      <Hero />
      <SocialProof />
      <WhyWeStarted />
      <SimpleIdea />
      <MissionSection />
      <CreateSection />
    </section>
  );
};

export default AboutUs;
