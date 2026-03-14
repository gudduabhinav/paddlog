import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ClientMarquee } from "@/components/ClientMarquee";
import { Services } from "@/components/Services";
import { WhyChoose } from "@/components/WhyChoose";
import { ProcessSection } from "@/components/ProcessSection";
import { MapSection } from "@/components/MapSection";
import { Testimonials } from "@/components/Testimonials";
import { FAQSection } from "@/components/FAQSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <ClientMarquee />
      <Services />
      <WhyChoose />
      <ProcessSection />
      <MapSection />
      <Testimonials />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
