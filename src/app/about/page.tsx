"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Shield, Target, Users, MapPin } from "lucide-react";

export default function About() {
  return (
    <main className="min-h-screen pt-24 font-body">
      <Navbar />
      
      {/* Hero */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6 font-heading"
          >
            Paddlog <span className="text-primary italic">DG Simplified</span>
          </motion.h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Founded in 2022 in Hyderabad, PADDLOG DG Solutions has quickly established itself as a pioneer 
            in hazardous materials handling, focusing on safety, innovation, and compliant supply chain management.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="p-10 rounded-[3rem] bg-primary/5 border border-primary/10">
            <h2 className="text-3xl font-bold mb-4 font-heading text-primary">Our Mission</h2>
            <p className="text-lg text-slate-700">
              To provide safe, efficient, and cost-effective logistics solutions for hazardous materials 
              and general cargo, ensuring compliance and reliability at every step.
            </p>
          </div>
          <div className="p-10 rounded-[3rem] bg-secondary/5 border border-secondary/10">
            <h2 className="text-3xl font-bold mb-4 font-heading text-secondary">Our Vision</h2>
            <p className="text-lg text-slate-700">
              To be the global leader in dangerous goods logistics, recognized for our commitment 
              to safety, innovation, and customer satisfaction.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <ValueCard 
              icon={<Shield className="text-primary" size={40} />}
              title="Uncompromising Safety"
              text="We adhere to the strictest international standards for dangerous goods handling."
            />
            <ValueCard 
              icon={<Target className="text-secondary" size={40} />}
              title="Global Compliance"
              text="Our expertise ensures your cargo meets every regulatory requirement, anywhere in the world."
            />
            <ValueCard 
              icon={<Users className="text-accent" size={40} />}
              title="Expert Team"
              text="Our specialists are certified and trained in the latest DG logistics protocols."
            />
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-slate-900">
              Our <span className="text-primary">Journey</span>
            </h2>
          </div>

          <div className="relative border-l md:border-l-0 md:border-transparent ml-4 md:ml-0">
            {/* Animated Center Tree Line */}
            <motion.div 
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute left-0 border-l border-slate-200 md:border-transparent md:bg-slate-200 md:left-1/2 top-0 w-px -translate-x-1/2" 
            />
            
            {/* 2022 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between mb-16 md:mb-24">
              <div className="hidden md:block w-1/2 pr-8 text-right">
                <TimelineCard 
                  year="2022" 
                  title="Founded in Hyderabad" 
                  desc="Paddlog DG Solutions started operations in Hyderabad as a specialized DG logistics provider." 
                  direction="left"
                />
              </div>
              <TimelineDot delay={0.2} />
              <div className="md:hidden w-full pl-8">
                 <TimelineCard 
                  year="2022" 
                  title="Founded in Hyderabad" 
                  desc="Paddlog DG Solutions started operations in Hyderabad as a specialized DG logistics provider." 
                  direction="right"
                />
              </div>
              <div className="hidden md:block w-1/2 pl-8" />
            </div>

            {/* 2023 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between mb-16 md:mb-24">
              <div className="hidden md:block w-1/2 pr-8" />
              <TimelineDot delay={0.4} />
              <div className="w-full pl-8 md:w-1/2 md:pl-8 text-left">
                <TimelineCard 
                  year="2023" 
                  title="Expanded to Mumbai" 
                  desc="Opened Mumbai branch to serve western India's pharmaceutical and chemical industries." 
                  direction="right"
                />
              </div>
            </div>

            {/* 2024 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between mb-16 md:mb-24">
              <div className="hidden md:block w-1/2 pr-8 text-right">
                <TimelineCard 
                  year="2024" 
                  title="Chennai & Bangalore" 
                  desc="Extended our network to South India with offices in Chennai and Bangalore." 
                  direction="left"
                />
              </div>
              <TimelineDot delay={0.6} />
              <div className="md:hidden w-full pl-8">
                <TimelineCard 
                  year="2024" 
                  title="Chennai & Bangalore" 
                  desc="Extended our network to South India with offices in Chennai and Bangalore." 
                  direction="right"
                />
              </div>
              <div className="hidden md:block w-1/2 pl-8" />
            </div>

            {/* 2025 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between">
              <div className="hidden md:block w-1/2 pr-8" />
              <TimelineDot delay={0.8} />
              <div className="w-full pl-8 md:w-1/2 md:pl-8 text-left">
                <TimelineCard 
                  year="2025" 
                  title="500+ Clients" 
                  desc="Crossed 500 active clients and 10,000+ successful hazardous shipments across India." 
                  direction="right"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-slate-900">
              Our <span className="text-primary italic">Locations</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 px-4 md:px-0">
            <LocationCard 
              city="Hyderabad" 
              tag="Head Office" 
              desc="Our headquarters — managing operations across Telangana and Andhra Pradesh." 
            />
            <LocationCard 
              city="Mumbai" 
              tag="Branch Office" 
              desc="Serving Maharashtra's pharmaceutical and chemical export hubs." 
            />
            <LocationCard 
              city="Chennai" 
              tag="Branch Office" 
              desc="Covering Tamil Nadu's industrial corridors and port operations." 
            />
            <LocationCard 
              city="Bangalore" 
              tag="Branch Office" 
              desc="Supporting Karnataka's tech and biotech industry logistics needs." 
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function TimelineCard({ year, title, desc, direction }: { year: string; title: string; desc: string; direction: "left" | "right" }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: direction === "left" ? 50 : -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="bg-white p-8 rounded-2xl shadow-premium border border-slate-100 hover:shadow-red-glow transition-all duration-300"
    >
      <div className="text-primary font-bold text-xl mb-2">{year}</div>
      <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm md:text-base">{desc}</p>
    </motion.div>
  );
}

function TimelineDot({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div 
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className="absolute left-[-5px] md:left-1/2 top-10 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-3 h-3 bg-primary rounded-full ring-4 ring-white z-10" 
    />
  );
}

function LocationCard({ city, tag, desc }: { city: string; tag: string; desc: string }) {
  return (
    <div className="bg-white p-8 lg:p-10 rounded-[2rem] shadow-premium border border-slate-100 text-center flex flex-col items-center hover:shadow-red-glow transition-all duration-300">
      <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
        <MapPin size={24} />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-2">{city}</h3>
      <p className="text-primary font-semibold text-sm mb-4">{tag}</p>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function ValueCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="p-10 rounded-[3rem] bg-white shadow-premium border border-slate-100 hover:shadow-red-glow transition-all duration-300">
      <div className="mb-6">{icon}</div>
      <h3 className="text-2xl font-bold mb-4 font-heading">{title}</h3>
      <p className="text-slate-600 leading-relaxed text-lg">{text}</p>
    </div>
  );
}
