import Hero from "@/components/home/Hero";
import SocialProof from "@/components/home/SocialProof";
import WelcomeSection from "@/components/home/Welcome";
import Features from "@/components/home/Features";
import Testimonials from "@/components/home/Testimonial";
import FaqSection from "@/components/home/Faq";
import Solution from "@/components/home/Solution";

export default function Home() {
  return (
    <>
      <Hero />
      <SocialProof />
      <WelcomeSection />
      <Features />
      <Solution />
      <Testimonials />
      <FaqSection />
    </>
  );
}
