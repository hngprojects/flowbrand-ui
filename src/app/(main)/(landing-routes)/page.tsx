import Hero from "@/components/landing/home/Hero";
import SocialProof from "@/components/landing/home/SocialProof";
import WelcomeSection from "@/components/landing/home/Welcome";
import Features from "@/components/landing/home/Features";
import Testimonials from "@/components/landing/home/Testimonial";
import FaqSection from "@/components/landing/home/Faq";
import Solution from "@/components/landing/home/Solution";

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
