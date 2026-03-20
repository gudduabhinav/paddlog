"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, PackageOpen, FileCheck, Truck, MapPinCheck, Plane } from "lucide-react";

const steps = [
  { title: "Inquiry",       desc: "Share your cargo details with our DG experts.",      icon: Search,      gradient: "from-blue-500 to-cyan-500"    },
  { title: "Packaging",     desc: "UN certified packing for maximum safety.",            icon: PackageOpen, gradient: "from-red-500 to-rose-600"     },
  { title: "Documentation", desc: "Complete DGD and regulatory paperwork.",               icon: FileCheck,   gradient: "from-slate-600 to-slate-800"  },
  { title: "Shipping",      desc: "Global air & sea freight with proactive status updates.", icon: Truck,    gradient: "from-indigo-500 to-blue-600"  },
  { title: "Delivery",      desc: "Safe, on-time delivery to any destination.",           icon: MapPinCheck, gradient: "from-emerald-500 to-teal-500" },
];

export function ProcessSection() {
  return (
    <section className="py-24 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.08),transparent_28%),linear-gradient(180deg,#ffffff_0%,#f8fafc_55%,#eef4ff_100%)] text-slate-900 overflow-hidden relative border-y border-slate-200">
      {/* Background animation */}
      <motion.div
        className="absolute top-10 right-10 text-slate-300/30"
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      >
        <Plane size={400} />
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white text-slate-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-slate-200 shadow-sm"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            How It Works
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Our <span className="text-primary">Seamless</span> Process
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 max-w-xl mx-auto"
          >
            Five simple steps to ensure your dangerous goods reach their destination safely and on time.
          </motion.p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[60px] left-0 w-full h-0.5 bg-slate-200 z-0">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-blue-500 via-red-500 to-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  className="flex flex-col items-center group"
                >
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  className={`w-[120px] h-[120px] bg-gradient-to-br ${step.gradient} rounded-3xl flex items-center justify-center mb-6 shadow-[0_18px_40px_rgba(148,163,184,0.24)] group-hover:shadow-[0_22px_48px_rgba(239,68,68,0.22)] transition-shadow relative`}
                  >
                    <Icon size={44} className="text-white" />
                    <div className="absolute -top-2 -right-2 bg-white text-slate-900 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-md border border-slate-200">
                      {index + 1}
                    </div>
                  </motion.div>
                  <h4 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{step.title}</h4>
                  <motion.div
                    className="w-8 h-1 bg-primary mb-3 rounded-full"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 + 0.3 }}
                  />
                  <p className="text-slate-500 text-sm text-center px-2 leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
