"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Services as ServicesGrid } from "@/components/Services";
import { motion } from "framer-motion";

export default function ServicesPage() {
  return (
    <main className="min-h-screen font-body">
      <Navbar />
      
      <section className="pt-40 pb-20 bg-slate-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6 font-heading"
          >
            Our Elite <span className="text-primary italic">Solutions</span>
          </motion.h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Detailed view of our specialized logistics capabilities designed for high-stakes cargo.
          </p>
        </div>
      </section>

      <ServicesGrid />

      <Footer />
    </main>
  );
}
