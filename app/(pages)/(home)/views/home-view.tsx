
import {AboutSection} from "@/app/(pages)/(home)/components/about-section";
import {HeroSection} from "@/app/(pages)/(home)/components/hero-section";
import {InfoSection} from "@/app/(pages)/(home)/components/info-section";
import { InteractiveSection } from "../components/interactive-section";

export function HomeView() {
    return (
        <main className="w-full h-full">
            <HeroSection />
            <AboutSection />
            <InfoSection /> 
            {/* <InteractiveSection /> */}
        </main>
    )
}
 