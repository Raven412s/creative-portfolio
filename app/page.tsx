
import AboutSection from "@/components/pages-and-sections/home-page/about-section";
import BookletSection from "@/components/pages-and-sections/home-page/booklet-section";
import HeroSection from "@/components/pages-and-sections/home-page/hero-section";
import InfoSection from "@/components/pages-and-sections/home-page/info-section";


export default function Home() {
  return (
    <main className="w-full h-full">
      <HeroSection />
      <AboutSection />
      <InfoSection />
      <BookletSection />
    </main>

  );
}
