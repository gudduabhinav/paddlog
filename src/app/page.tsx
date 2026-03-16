"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ClientMarquee } from "@/components/ClientMarquee";
import { Services } from "@/components/Services";
import { DGClassesVisualizer } from "@/components/DGClassesVisualizer";
import { WhyChoose } from "@/components/WhyChoose";
import { ProcessSection } from "@/components/ProcessSection";
import { MapSection } from "@/components/MapSection";
import { Testimonials } from "@/components/Testimonials";
import { FAQSection } from "@/components/FAQSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

export default function Home() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from('site_settings').select('*');
      if (data) {
        const settingsMap = data.reduce((acc: any, curr: any) => {
          acc[curr.key] = curr.value;
          return acc;
        }, {});
        setSettings(settingsMap);
      }
      setLoading(false);
    }
    fetchSettings();

    // Real-time subscription for "Super Power" feel
    const subscription = supabase
      .channel('site_settings_changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'site_settings' }, () => {
        fetchSettings();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const isVisible = (section: string) => {
    if (!settings || !settings.section_visibility) return true;
    return settings.section_visibility[section] !== false;
  };

  const branding = settings?.branding || { logo_text: "PADDLOG", accent_color: "#ef4444" };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      {isVisible('hero') && <Hero />}
      {isVisible('marquee') && <ClientMarquee />}
      {isVisible('services') && <Services />}
      {isVisible('dg_visualizer') && <DGClassesVisualizer />}
      {isVisible('why_choose') && <WhyChoose />}
      {isVisible('process') && <ProcessSection />}
      {isVisible('map') && <MapSection />}
      {isVisible('testimonials') && <Testimonials />}
      {isVisible('faq') && <FAQSection />}
      {isVisible('cta') && <CTASection />}
      <Footer />
    </main>
  );
}
