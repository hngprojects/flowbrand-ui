import Features from "@/components/home/Features";
import HomeHero from "@/components/home/Hero";
import WelcomeSection from "@/components/home/WelcomeSection";
import SocialProof from "@/components/home/SocialProof";
import Testimonial from "@/components/home/Testimonial";
import FaqSection from "@/components/home/Faq";
import Solution from "@/components/home/Solution";

export default function Home() {
  return (
    <>
      <HomeHero />
      <SocialProof />
      <WelcomeSection />
      <Features />
      <Solution />
      <Testimonial />
      <FaqSection />
    </>
  );
}
