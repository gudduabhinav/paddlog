"use client";

import React from "react";
import { motion } from "framer-motion";
import { Package, FileText, Plane, Box, ShieldCheck, Warehouse, ArrowRight } from "lucide-react";
import Link from "next/link";

const services = [
  {
    title: "UN Certified Packaging",
    slug: "un-certified-packaging",
    desc: "Supply of UN certified boxes, drums, IBC tanks, and hazard labels for compliant transport.",
    icon: Package,
    image: "/un-certified-packaging-dg.png"
  },
  {
    title: "DG Packing & DGD",
    slug: "dg-packing-dgd",
    desc: "Expert packing and DGD preparation ensuring 100% compliance with IATA and IMDG regulations.",
    icon: FileText,
    image: "/dg-hero-new.png"
  },
  {
    title: "Freight Forwarding",
    slug: "freight-forwarding",
    desc: "Global Air & Sea transportation for Hazardous, General, and Critical shipments.",
    icon: Plane,
    image: "/dg-air-new.png"
  },
  {
    title: "Aeroparts & Special Packing",
    slug: "aeroparts-packing",
    desc: "Precision packing and verified handling for aviation components and technical equipment.",
    icon: Box,
    image: "/dg-sea-new.png"
  },
  {
    title: "Customs Brokerage",
    slug: "customs-brokerage",
    desc: "Seamless customs clearance and regulatory expertise for hazardous and specialized goods.",
    icon: ShieldCheck,
    image: "/dg-customs-new.png"
  },
  {
    title: "Warehousing & Storage",
    slug: "warehousing-storage",
    desc: "Secure facilities with 24/7 security and climate control for sensitive materials and cargo.",
    icon: Warehouse,
    image: "/logistics_scene.png"
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 bg-[#f8fafc] relative overflow-hidden">
      <div className="container mx-auto px-6 text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8"
          >
            Specialized Capabilities
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black mb-6 text-slate-900 tracking-tight"
          >
            Hazardous <span className="text-primary">Logistics</span> Solutions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 max-w-2xl mx-auto text-xl leading-relaxed font-bold"
          >
            UN-certified logistics infrastructure designed for absolute compliance and safety.
          </motion.p>
      </div>

      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <ServiceCard key={index} service={service} index={index} />
        ))}
      </div>
    </section>
  );
}

function ServiceCard({ service, index }: { service: any; index: number }) {
  const Icon = service.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      className="bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 group border border-slate-200 overflow-hidden flex flex-col"
    >
      {service.image && (
        <div className="h-52 overflow-hidden relative">
          <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-60" />
          <div className="absolute bottom-4 left-6"><div className="text-[9px] font-black uppercase text-white tracking-widest bg-primary px-3 py-1 rounded-full shadow-lg">Verified</div></div>
        </div>
      )}
      <div className="p-8 flex-grow">
        <div className="flex justify-between items-start mb-6">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-900 text-white shadow-lg group-hover:bg-primary transition-colors">
            <Icon size={24} />
          </div>
          <ArrowRight size={20} className="text-slate-200 group-hover:text-primary transition-colors" />
        </div>
        <h3 className="text-2xl font-black mb-3 text-slate-900 tracking-tight group-hover:text-primary transition-colors">{service.title}</h3>
        <p className="text-slate-500 mb-8 leading-relaxed text-sm font-bold">{service.desc}</p>
        <Link
          href={`/book?service=${service.slug}`}
          className="group/link inline-flex items-center gap-2 rounded-full border border-slate-900 bg-slate-900 px-5 py-3 text-[10px] font-black uppercase tracking-[0.22em] text-white shadow-[0_16px_35px_-20px_rgba(15,23,42,0.85)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:shadow-[0_20px_45px_-24px_rgba(239,68,68,0.75)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          <span>Book Solution</span>
          <ArrowRight size={14} className="transition-transform duration-300 group-hover/link:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
}
