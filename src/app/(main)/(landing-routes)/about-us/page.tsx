"use client";
import HeroesAbout from "@/components/landing/about-us/heroes-about";
import WhySection from "@/components/landing/about-us/why-section";
import MissionSection from "@/components/landing/about-us/mission-section";
import CtaSection from "@/components/landing/about-us/cta-section";
import SocialProof from "@/components/landing/about-us/social-proof-section";

const AboutUs = () => {
  return (
    <section className="w-full bg-[#FFFFFF]">
      <HeroesAbout />
      <SocialProof />
      <WhySection />
      <MissionSection />
      <CtaSection />
    </section>
  );
};

export default AboutUs;
