"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquare, Plane, Shield, Globe2 } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-[4rem] group shadow-2xl"
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
             <img 
               src="/dg-sea-new.png" 
               alt="Global Sea Freight" 
               className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[15s] ease-linear"
             />
             <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/70" />
          </div>

          <div className="relative z-10 px-12 md:px-24 py-20 text-center md:text-left">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-md border border-primary/30 text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-8 shadow-xl"
              >
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Specialized Handling
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tight"
              >
                Need <span className="text-primary">Expert</span> <br />
                DG Shipping Solutions?
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-white/70 text-xl max-w-2xl mb-12 font-medium leading-relaxed"
              >
                Our certified specialist team is ready to handle your most challenging 
                logistics requirements. Get a fully compliant quote within 2 Hours.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-8"
              >
                <Link href="/book" prefetch>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(225,29,72,0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative overflow-hidden red-gradient text-white px-12 py-5 rounded-3xl font-black text-xl shadow-2xl flex items-center space-x-3 w-full sm:w-auto justify-center"
                  >
                    <span>Book Service Now</span>
                    <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
                <Link href="/contact" prefetch>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-12 py-5 rounded-3xl font-black text-xl transition-all flex items-center space-x-3 w-full sm:w-auto justify-center hover:bg-white/20"
                  >
                    <MessageSquare size={24} className="text-primary" />
                    <span>Speak to Specialists</span>
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Decorative Corner element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[120px] rounded-full opacity-50 pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/20 blur-[130px] rounded-full opacity-30 pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}
