"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Shield, Target, Users, MapPin, Award, Package, Heart, Building } from "lucide-react";

export default function About() {
  return (
    <main className="min-h-screen font-body bg-slate-50/30">
      <Navbar />

      {/* Hero - Premium Light Section */}
      <section className="relative pt-40 md:pt-48 pb-32 bg-white overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-100/40 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center mb-8"
          >
            <div className="w-48 h-16 mb-4">
              <img 
                src="/paddlog-logo.png" 
                alt="Paddlog Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="px-4 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-500 text-[10px] font-bold uppercase tracking-[0.3em]">
              Since 2022
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-bold mb-8 font-heading text-slate-900 tracking-tight"
          >
            Paddlog <span className="text-primary">DG Simplified</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            Experts in specialized dangerous goods logistics, ensuring safe, compliant,
            and efficient transport of high-stakes cargo worldwide.
          </motion.p>
        </div>
      </section>

      {/* Stats/Intro Section */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 font-heading uppercase tracking-widest">Our Origin Story</h2>
            <p className="text-lg text-slate-600 leading-relaxed font-body">
              Founded in Hyderabad, PADDLOG DG Solutions has quickly established itself as a pioneer
              in hazardous materials handling. We started with a simple belief: that complex logistics
              should be made simple, safe, and absolute.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="p-10 rounded-[3rem] bg-primary/5 border border-primary/10">
            <h2 className="text-3xl font-bold mb-4 font-heading text-primary uppercase tracking-wider">Our Mission</h2>
            <p className="text-lg text-slate-700">
              To provide safe, efficient, and cost-effective logistics solutions for hazardous materials
              and general cargo, ensuring compliance and reliability at every step.
            </p>
          </div>
          <div className="p-10 rounded-[3rem] bg-secondary/5 border border-secondary/10">
            <h2 className="text-3xl font-bold mb-4 font-heading text-secondary uppercase tracking-wider">Our Vision</h2>
            <p className="text-lg text-slate-700">
              To be the global leader in dangerous goods logistics, recognized for our commitment
              to safety, innovation, and customer satisfaction.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-heading text-slate-900 uppercase">
              Why Choose <span className="text-primary">PADDLOG</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ValueCard
              icon={<Award className="text-primary" size={40} />}
              title="Expertise & Experience"
              text="Seasoned professionals with unparalleled knowledge in hazardous materials handling."
            />
            <ValueCard
              icon={<Shield className="text-secondary" size={40} />}
              title="Safety & Compliance"
              text="Unwavering commitment to international safety standards and strict regulatory compliance."
            />
            <ValueCard
              icon={<Package className="text-accent" size={40} />}
              title="Comprehensive Services"
              text="End-to-end logistics solutions tailored for specialized DG transport and general cargo."
            />
            <ValueCard
              icon={<Heart className="text-primary" size={40} />}
              title="Customer-Centric Approach"
              text="Dedicated to simplifying complex logistics with tailored solutions for our clients' success."
            />
            <ValueCard
              icon={<Building className="text-secondary" size={40} />}
              title="State-of-the-Art Facilities"
              text="Advanced infrastructure outfitting our operational hubs for absolute efficiency."
            />
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="py-24 bg-slate-100/50">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-slate-900 uppercase tracking-tight">
              Our <span className="text-primary">Journey</span>
            </h2>
            <p className="text-slate-500 mt-4 font-bold uppercase tracking-[0.2em] text-xs">Rapid Expansion Across India</p>
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
                  title="Expanded to Bangalore"
                  desc="Rapidly scaled operations to serve Bangalore's thriving biotech and tech corridors."
                  direction="right"
                />
              </div>
            </div>

            {/* 2024 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between mb-16 md:mb-24">
              <div className="hidden md:block w-1/2 pr-8 text-right">
                <TimelineCard
                  year="2024"
                  title="Mumbai & Chennai"
                  desc="Strengthened our West and South presence with robust hubs in Mumbai and Chennai."
                  direction="left"
                />
              </div>
              <TimelineDot delay={0.6} />
              <div className="md:hidden w-full pl-8">
                <TimelineCard
                  year="2024"
                  title="Mumbai & Chennai"
                  desc="Strengthened our West and South presence with robust hubs in Mumbai and Chennai."
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
                  title="Entry into Gujarat"
                  desc="Now serving Gujarat's industrial belt, marking our fifth major strategic expansion."
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
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-slate-900 uppercase">
              Our <span className="text-primary">Locations</span>
            </h2>
            <p className="text-slate-500 mt-4 font-bold uppercase tracking-[0.2em] text-xs">Strategically Positioned to Serve You Better</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-0">
            <LocationCard
              city="Hyderabad"
              tag="Head Office"
              desc="Global control center managing pan-India operations and strategic directions."
            />
            <LocationCard
              city="Bangalore"
              tag="Branch Office"
              desc="Strategic hub for biotech, aviation parts, and high-tech equipment logistics."
            />
            <LocationCard
              city="Mumbai"
              tag="Branch Office"
              desc="Key gateway for western India's pharmaceutical and chemical export industries."
            />
            <LocationCard
              city="Chennai"
              tag="Branch Office"
              desc="Specialized handling for South India's industrial and port-centric cargo."
            />
             <LocationCard
              city="Gujarat"
              tag="Branch Office"
              desc="Dedicated support for India's largest manufacturing and industrial hub."
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
      <h3 className="text-2xl font-bold text-slate-900 mb-2 uppercase tracking-tighter">{city}</h3>
      <p className="text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-4">{tag}</p>
      <p className="text-slate-500 text-sm leading-relaxed font-medium">{desc}</p>
    </div>
  );
}

function ValueCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="p-10 rounded-[3rem] bg-white shadow-premium border border-slate-100 hover:shadow-red-glow transition-all duration-300">
      <div className="mb-6">{icon}</div>
      <h3 className="text-2xl font-bold mb-4 font-heading uppercase tracking-tight">{title}</h3>
      <p className="text-slate-600 leading-relaxed text-lg">{text}</p>
    </div>
  );
}
