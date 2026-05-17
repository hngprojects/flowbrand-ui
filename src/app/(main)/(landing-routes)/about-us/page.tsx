"use client";
import Hero from "@/components/landing/about-us/hero";
import WhyWeStarted from "@/components/landing/about-us/WhyWeStarted";
import MissionSection from "@/components/landing/about-us/mission";
import CtaSection from "@/components/landing/about-us/cta-section";
import SocialProof from "@/components/landing/home/SocialProof";
import SimpleIdea from "@/components/landing/about-us/SimpleIdea";

const AboutUs = () => {
  return (
    <section className="w-full bg-[#FFFFFF]">
      <Hero />
      <SocialProof />
      <WhyWeStarted />
      <SimpleIdea />
      <MissionSection />
      <CtaSection />
    </section>
  );
};

export default AboutUs;
