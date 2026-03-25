"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Services as ServicesGrid } from "@/components/Services";
import { motion } from "framer-motion";

export default function ServicesPage() {
  return (
    <main className="min-h-screen font-body bg-slate-50">
      <Navbar />
      
      <section className="pt-40 pb-20 bg-white border-b border-slate-200 relative overflow-hidden">
        {/* Background Accents - Minimal & Sharp */}
        <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-red-50/20 rounded-full" />
        
        <div className="container mx-auto px-6 text-center relative z-10">

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-7xl font-black mb-8 text-slate-900 tracking-tight"
          >
            Specialized <span className="text-primary italic">Solutions</span>
          </motion.h1>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-bold">
            End-to-end logistics infrastructure for hazardous, critical, and complex cargo requirements.
          </p>
        </div>
      </section>

      <div className="py-20">
        <ServicesGrid />
      </div>

      <Footer />
    </main>
  );
}
