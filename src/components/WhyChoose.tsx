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
    gradient: "from-red-500 to-rose-600",
  },
  {
    title: "Global Freight Network",
    desc: "Seamless connectivity across 150+ countries worldwide.",
    icon: Globe2,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Certified Packaging",
    desc: "100% compliant UN-certified materials for every shipment.",
    icon: Award,
    gradient: "from-amber-500 to-orange-500",
  },
  {
    title: "Fast Customs Clearance",
    desc: "Strategic brokerage for rapid border processing.",
    icon: Zap,
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    title: "Secure Warehousing",
    desc: "Highly monitored facilities for specialized cargo needs.",
    icon: Lock,
    gradient: "from-purple-500 to-indigo-600",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function WhyChoose() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative floating elements */}
      <motion.div
        className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-red-50 blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 -left-20 w-60 h-60 rounded-full bg-blue-50 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-red-50 text-red-500 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-red-100"
              >
                <span className="h-2 w-2 rounded-full bg-red-500" />
                Why Choose Us
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                Why Industry Leaders Choose{" "}
                <span className="text-secondary">Padd</span>
                <span className="text-primary">log</span>
              </h2>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                We don't just move cargo; we mitigate risk. Our specialized approach to logistics
                ensures that your dangerous goods are handled with the precision and care they require.
              </p>

              {/* Animated quote card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative overflow-hidden"
              >
                <motion.div
                  className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-500 to-orange-400 rounded-full"
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  style={{ transformOrigin: "top" }}
                />
                <p className="italic font-medium text-slate-700 pl-4">
                  "One of the few providers with deep expertise in hazardous material handling from end-to-end."
                </p>
                <div className="mt-4 text-sm font-bold text-primary pl-4">— Trusted by Toshiba, Shell & Rafael</div>
              </motion.div>

              {/* CTA Link */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-8"
              >
                <Link href="/about" prefetch className="group inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                  Learn More About Us
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Feature cards with stagger */}
          <motion.div
            className="lg:w-1/2 grid grid-cols-1 gap-4 w-full"
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
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-5 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-lg hover:border-primary/20 transition-all group cursor-pointer"
                >
                  <div className={`bg-gradient-to-br ${feature.gradient} p-3.5 rounded-xl text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={26} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold mb-0.5 group-hover:text-primary transition-colors">{feature.title}</h4>
                    <p className="text-slate-500 text-sm">{feature.desc}</p>
                  </div>
                  <ArrowRight size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
