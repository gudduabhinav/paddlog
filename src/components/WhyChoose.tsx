"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Shield, Globe2, Award, Zap, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "DG Safety Experts",
    desc: "Over 20 years of experience in hazardous goods handling.",
    icon: Shield,
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Global Freight Network",
    desc: "Seamless connectivity across 150+ countries worldwide.",
    icon: Globe2,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Certified Packaging",
    desc: "100% compliant UN-certified materials for every shipment.",
    icon: Award,
    color: "bg-orange-50 text-orange-600",
  },
  {
    title: "Fast Customs Clearance",
    desc: "Strategic brokerage for rapid border processing.",
    icon: Zap,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Secure Warehousing",
    desc: "Highly monitored facilities for specialized cargo needs.",
    icon: Lock,
    color: "bg-slate-100 text-slate-600",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function WhyChoose() {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-24">
          <div className="lg:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-12"
            >
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-900 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-slate-200">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  Why Choose Paddlog
                </div>

                <h2 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight text-slate-900">
                  Trust the Leaders in <br />
                  <span className="text-primary">Dangerous Goods</span>
                </h2>
                
                <p className="text-xl text-slate-500 leading-relaxed font-medium max-w-lg">
                  We don't just move cargo; we manage high-stakes risk. Our unique protocols ensure that every ounce of hazardous material is handled with surgical precision.
                </p>
              </div>

              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl group">
                 <img 
                   src="/dg-air-new.png" 
                   alt="Dangerous Goods Air Freight" 
                   className="w-full h-[400px] object-cover group-hover:scale-110 transition-transform duration-1000"
                 />
                 <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="text-white font-black text-xl mb-1 tracking-tight">Rapid Air Link</div>
                    <div className="text-white/70 text-sm font-bold">24-hour HAZMAT escalation available.</div>
                 </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:w-1/2 w-full">
            <motion.div
              className="grid grid-cols-1 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ x: 10 }}
                    className="flex flex-col items-start gap-5 rounded-[2.5rem] border border-slate-100 bg-slate-50 p-6 shadow-sm transition-all group cursor-pointer hover:shadow-premium sm:flex-row sm:gap-8 sm:p-10"
                  >
                    <div className={`${feature.color} rounded-2xl p-4 shadow-sm transition-all duration-500 group-hover:bg-primary group-hover:text-white sm:p-5`}>
                      <Icon size={32} />
                    </div>
                    <div className="min-w-0 flex-1 space-y-2">
                      <h4 className="text-2xl font-bold text-slate-900 transition-colors group-hover:text-primary">{feature.title}</h4>
                      <p className="max-w-[18rem] text-base font-medium leading-relaxed text-slate-500 sm:max-w-none sm:text-lg">
                        {feature.desc}
                      </p>
                    </div>
                    <div className="hidden pt-2 sm:block">
                      <ArrowRight size={24} className="text-slate-200 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

