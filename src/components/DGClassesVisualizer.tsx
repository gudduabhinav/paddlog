"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Wind, Droplets, Flame, Sun, Skull, Radiation, FlaskConical, Box } from "lucide-react";

const dgClasses = [
  {
    id: 1,
    title: "Explosives",
    icon: Zap,
    color: "bg-orange-500",
    shadow: "shadow-orange-500/20",
    examples: "Ammunition, Fireworks, Flares",
    desc: "Materials that can rapidly detonate or catch fire.",
  },
  {
    id: 2,
    title: "Gases",
    icon: Wind,
    color: "bg-emerald-500",
    shadow: "shadow-emerald-500/20",
    examples: "Aerosols, Helium, Oxygen",
    desc: "Compressed, liquefied, or dissolved hazardous gases.",
  },
  {
    id: 3,
    title: "Flammable Liquids",
    icon: Droplets,
    color: "bg-red-500",
    shadow: "shadow-red-500/20",
    examples: "Paint, Alcohol, Petrol",
    desc: "Liquids that give off flammable vapors easily.",
  },
  {
    id: 4,
    title: "Flammable Solids",
    icon: Flame,
    color: "bg-rose-500",
    shadow: "shadow-rose-500/20",
    examples: "Matches, Sulfur, Sodium",
    desc: "Highly combustible solids that can easily ignite.",
  },
  {
    id: 5,
    title: "Oxidizing Substances",
    icon: Sun,
    color: "bg-yellow-500",
    shadow: "shadow-yellow-500/20",
    examples: "Hydrogen Peroxide, Nitrates",
    desc: "Substances that yield oxygen, increasing fire risks.",
  },
  {
    id: 6,
    title: "Toxic & Infectious",
    icon: Skull,
    color: "bg-slate-700",
    shadow: "shadow-slate-700/20",
    examples: "Pesticides, Medical Waste",
    desc: "Substances liable to cause death, injury, or illness.",
  },
  {
    id: 7,
    title: "Radioactive",
    icon: Radiation,
    color: "bg-amber-600",
    shadow: "shadow-amber-600/20",
    examples: "Medical Isotopes, X-Ray Env",
    desc: "Materials emitting dangerous ionizing radiation.",
  },
  {
    id: 8,
    title: "Corrosives",
    icon: FlaskConical,
    color: "bg-slate-800",
    shadow: "shadow-slate-800/20",
    examples: "Battery Acid, Mercury, Bleach",
    desc: "Chemicals that destroy living tissue or metal.",
  },
  {
    id: 9,
    title: "Miscellaneous",
    icon: Box,
    color: "bg-blue-600",
    shadow: "shadow-blue-600/20",
    examples: "Lithium Batteries, Dry Ice",
    desc: "Other hazards that don't fit the previous 8 classes.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function DGClassesVisualizer() {
  return (
    <section className="py-24 bg-[#0a0f1e] relative overflow-hidden border-y border-white/5">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white/5 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-6 border border-white/10"
          >
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Hazmat Classification
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold mb-6 text-white"
          >
            The 9 Classes of <span className="text-primary italic">Dangerous Goods</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg leading-relaxed font-medium"
          >
            Expert handling for every classification level. We ensure 100% compliance with international safety protocols for all hazardous materials.
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {dgClasses.map((c) => (
            <motion.div
              key={c.id}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white/5 backdrop-blur-sm rounded-[2.5rem] p-10 border border-white/10 hover:border-primary/40 hover:bg-white/[0.08] transition-all duration-500 relative overflow-hidden group cursor-default"
            >
              {/* Background Number */}
              <div className="absolute -right-6 -bottom-10 text-[160px] font-bold text-white/[0.03] select-none transition-all duration-700 group-hover:text-primary/10 group-hover:-translate-y-4">
                {c.id}
              </div>

              <div className="relative z-10">
                <div className={`w-16 h-16 ${c.color} ${c.shadow} rounded-2xl flex items-center justify-center text-white mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  <c.icon size={32} />
                </div>

                <div className="inline-block px-4 py-1.5 bg-white/5 text-slate-400 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6 border border-white/5">
                  Category {c.id}
                </div>

                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors">{c.title}</h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium">
                  {c.desc}
                </p>

                <div className="pt-6 border-t border-white/10">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] block mb-2 opacity-80">
                    Industrial Examples:
                  </span>
                  <span className="text-sm font-bold text-slate-300">
                    {c.examples}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

