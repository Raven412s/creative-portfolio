
import { AboutSection } from "@/app/(pages)/(home)/components/about-section";
import { HeroSection } from "@/app/(pages)/(home)/components/hero-section";
import { InfoSection } from "@/app/(pages)/(home)/components/info-section";
import { DocumentsSection } from "../components/documents-section";
import { DisplaySection } from "../components/display-section";
import TestimonialsSection from "../components/testimonials-section";
import { ContactSection } from "../components/contact-section";

export function HomeView() {
    return (
        <main className="w-full h-full">
            <HeroSection />
            <AboutSection />
            <InfoSection />
            <DocumentsSection />
            <DisplaySection />
            <TestimonialsSection />
            <ContactSection />
        </main>
    )
}
