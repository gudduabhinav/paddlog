"use client";

import React from "react";
import { motion } from "framer-motion";
import { Package, FileText, Plane, Ship, ShieldCheck, Warehouse, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const services = [
  {
    title: "UN Certified Packaging",
    slug: "un-certified-packaging",
    desc: "Supply of UN certified boxes, drums, IBC tanks, hazard labels, and passive boxes for safe transport.",
    icon: Package,
    gradient: "from-red-500 to-rose-600",
    bgGlow: "bg-red-500/10",
  },
  {
    title: "DG Packing & DGD",
    slug: "dg-packing-dgd",
    desc: "Expert packing and DGD preparation ensuring 100% compliance with IATA and IMDG regulations.",
    icon: FileText,
    gradient: "from-orange-500 to-red-500",
    bgGlow: "bg-orange-500/10",
  },
  {
    title: "Freight Forwarding",
    slug: "freight-forwarding",
    desc: "Global Air and Sea freight for Hazardous, General, Temperature-controlled, and Critical shipments.",
    icon: Plane,
    gradient: "from-blue-500 to-cyan-500",
    bgGlow: "bg-blue-500/10",
  },
  {
    title: "Technical Packing",
    slug: "technical-packing",
    desc: "Specialized high-quality technical packing for Aeroparts and sensitive industrial equipment.",
    icon: Ship,
    gradient: "from-indigo-500 to-blue-600",
    bgGlow: "bg-indigo-500/10",
  },
  {
    title: "Customs Brokerage",
    slug: "customs-brokerage",
    desc: "Seamless customs clearance for hazardous goods through deep regulatory expertise.",
    icon: ShieldCheck,
    gradient: "from-emerald-500 to-teal-500",
    bgGlow: "bg-emerald-500/10",
  },
  {
    title: "Temperature Controlled",
    slug: "temperature-controlled",
    desc: "End-to-end cold chain solutions for sensitive biological and chemical materials.",
    icon: Warehouse,
    gradient: "from-amber-500 to-orange-500",
    bgGlow: "bg-amber-500/10",
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <motion.div
        className="absolute -right-32 top-10 w-80 h-80 rounded-full bg-red-100/40 blur-3xl"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -left-20 bottom-20 w-60 h-60 rounded-full bg-blue-100/30 blur-3xl"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-red-50 text-red-500 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-red-100"
          >
            <span className="h-2 w-2 rounded-full bg-red-500" />
            Our Expertise
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Our <span className="text-primary italic">Specialized</span> Services
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 max-w-2xl mx-auto text-lg"
          >
            We provide end-to-end solutions for the most complex logistics challenges,
            prioritizing safety and compliance at every step.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index }: { service: any; index: number }) {
  const Icon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -8 }}
      className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 group border border-slate-100 relative overflow-hidden"
    >
      {/* Hover glow */}
      <div className={cn("absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-3xl", service.bgGlow)} />

      <div className="relative z-10">
        <motion.div
          className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br text-white shadow-md", service.gradient)}
          whileHover={{ scale: 1.15, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Icon size={28} />
        </motion.div>
        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
          {service.title}
        </h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          {service.desc}
        </p>
        <Link
          href={`/services/${service.slug}`}
          prefetch
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 group-hover:text-primary transition-colors"
        >
          <span>Book this service</span>
          <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
