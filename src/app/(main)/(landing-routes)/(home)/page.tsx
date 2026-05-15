import Features from "@/components/home/Features";
import HomeHero from "@/components/home/Hero";
import WelcomeSection from "@/components/home/WelcomeSection";
import SocialProof from "@/components/home/SocialProof";
export default function Home() {
  return (
    <>
      <HomeHero />
      <SocialProof />
      <WelcomeSection />
      <Features />
    </>
  );
}
