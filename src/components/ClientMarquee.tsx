"use client";

import React from "react";
import { motion } from "framer-motion";

const clients = [
  {
    name: "Hanbit Automation",
    src: "/partner-logos/hanbit.png",
    accent: "#1e40af",
    logoClass: "h-7 w-auto opacity-95",
    frameClass: "border-slate-900 bg-slate-900",
  },
  {
    name: "Density Pharma",
    src: "/partner-logos/density.png",
    accent: "#15803d",
    logoClass: "h-10 w-auto",
    frameClass: "border-slate-200 bg-white",
  },
  {
    name: "Clearsynth Pharma",
    src: "/partner-logos/clearsynth-favicon.png",
    accent: "#be185d",
    logoClass: "h-12 w-12 rounded-2xl",
    frameClass: "border-slate-200 bg-slate-50",
  },
  {
    name: "PerkinElmer Belgium BV",
    src: "/partner-logos/perkinelmer.svg",
    accent: "#16a34a",
    logoClass: "h-10 w-auto",
    frameClass: "border-slate-200 bg-white",
  },
  {
    name: "Shell Petroleum",
    src: "/partner-logos/shell.svg",
    accent: "#fbbf24",
    logoClass: "h-12 w-12",
    frameClass: "border-slate-200 bg-white",
  },
  {
    name: "Cyient DLM Limited",
    src: "/partner-logos/cyient.png",
    accent: "#0f4cc9",
    logoClass: "h-8 w-auto",
    frameClass: "border-slate-200 bg-white",
  },
  {
    name: "Toshiba Switchgears",
    src: "/partner-logos/toshiba.png",
    accent: "#e11d48",
    logoClass: "h-8 w-auto",
    frameClass: "border-slate-200 bg-white",
  },
  {
    name: "Heart Hero UK",
    src: "/partner-logos/heart-heroes.png",
    accent: "#dc2626",
    logoClass: "h-9 w-auto",
    frameClass: "border-slate-200 bg-white",
  },
  {
    name: "GNAT Aviation",
    src: "/partner-logos/gnat.jpg",
    accent: "#0ea5e9",
    logoClass: "h-12 w-auto",
    frameClass: "border-slate-200 bg-white",
  },
  {
    name: "Peoplelink Unified Communications",
    src: "/partner-logos/peoplelink.webp",
    accent: "#4f46e5",
    logoClass: "h-10 w-auto",
    frameClass: "border-slate-200 bg-white",
  },
  {
    name: "Kalyani Raphael",
    src: "/partner-logos/kras.png",
    accent: "#1d4ed8",
    logoClass: "h-10 w-auto",
    frameClass: "border-slate-200 bg-white",
  },
  {
    name: "DSV Air & Sea Limited",
    src: "/partner-logos/dsv-favicon.png",
    accent: "#111827",
    logoClass: "h-12 w-12 rounded-2xl",
    frameClass: "border-slate-200 bg-slate-50",
  },
  {
    name: "DB Schenker India",
    src: "/partner-logos/dbschenker-favicon.png",
    accent: "#0f766e",
    logoClass: "h-12 w-12 rounded-2xl",
    frameClass: "border-slate-200 bg-slate-50",
  },
  {
    name: "Kintetsu Worldwide Express",
    src: "/partner-logos/kwe.svg",
    accent: "#1e40af",
    logoClass: "h-9 w-auto",
    frameClass: "border-slate-200 bg-white",
  },
  {
    name: "Ceva Freight India",
    src: "/partner-logos/ceva-favicon.png",
    accent: "#ef4444",
    logoClass: "h-12 w-12 rounded-2xl",
    frameClass: "border-slate-200 bg-slate-50",
  },
  {
    name: "DHL Logistics Private Limited",
    src: "/partner-logos/dhl.svg",
    accent: "#d11241",
    logoClass: "h-9 w-auto",
    frameClass: "border-slate-200 bg-white",
  },
  {
    name: "DHL Worldwide Express",
    src: "/partner-logos/dhl.svg",
    accent: "#d11241",
    logoClass: "h-9 w-auto",
    frameClass: "border-slate-200 bg-white",
  },
  {
    name: "Yusen Logistics",
    src: "/partner-logos/yusen.svg",
    accent: "#1e3a8a",
    logoClass: "h-9 w-auto",
    frameClass: "border-slate-200 bg-white",
  }
];

export function ClientMarquee() {
  const marqueeClients = [...clients, ...clients];

  return (
    <div className="py-20 bg-slate-50 border-y border-slate-100 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,23,42,0.02)_0%,transparent_100%)]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="container mx-auto px-6 mb-16 text-center relative z-10"
      >
        <div className="inline-flex items-center gap-2 bg-white text-slate-500 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.25em] border border-slate-200 shadow-sm mb-6">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          Trusted Partners
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
          Working With <span className="text-primary">Global</span> Entities
        </h2>
      </motion.div>

      <div className="flex whitespace-nowrap overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-slate-50 to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-slate-50 to-transparent z-10" />

        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
          className="flex space-x-12 items-center px-10"
        >
          {marqueeClients.map((client, i) => (
            <div
              key={i}
              className="flex h-40 w-[18rem] flex-shrink-0 items-center justify-end rounded-[2rem] border border-slate-100 bg-white px-7 pb-2 pt-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] transition-all duration-300 group hover:-translate-y-0.5 hover:shadow-[0_20px_45px_rgb(0,0,0,0.06)] active:scale-95"
            >
              <div className="flex w-full translate-y-3 flex-col items-center gap-3">
                <div className="flex min-h-[76px] w-full items-center justify-center">
                  <div className={`inline-flex h-[76px] w-[168px] items-center justify-center overflow-hidden rounded-[1.35rem] border px-5 py-4 ${client.frameClass}`}>
                    <img
                      src={client.src}
                      alt={client.name}
                      className={`mx-auto block max-h-full max-w-full object-contain object-center ${client.logoClass}`}
                    />
                  </div>
                </div>
                <div className="min-h-[2.8rem] text-center text-[11px] font-black uppercase leading-[1.25] tracking-[0.12em] text-slate-600">
                  {client.name}
                </div>
                <div
                  className="h-1 rounded-full transition-all duration-300 group-hover:w-20"
                  style={{ width: "2.75rem", backgroundColor: client.accent, opacity: 0.2 }}
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
