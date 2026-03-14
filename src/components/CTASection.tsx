"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquare, Plane, Shield, Globe2 } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="blue-gradient rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl"
        >
          {/* Animated Background effects */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/10 blur-[100px] rounded-full" />

          {/* Floating icons */}
          <motion.div
            className="absolute top-8 left-10 text-white/10"
            animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Plane size={80} />
          </motion.div>
          <motion.div
            className="absolute bottom-12 right-14 text-white/10"
            animate={{ y: [0, -10, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <Shield size={60} />
          </motion.div>
          <motion.div
            className="absolute top-14 right-20 text-white/10"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <Globe2 size={50} />
          </motion.div>

          <div className="relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight"
            >
              Need <span className="text-primary italic">Safe</span> Dangerous Goods Shipping?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/70 text-xl max-w-2xl mx-auto mb-12"
            >
              Our experts are ready to handle your most challenging logistics requirements.
              Get a compliant quote within 24 hours.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Link href="/book" prefetch>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(224,36,36,0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative overflow-hidden red-gradient text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl flex items-center space-x-3 w-full sm:w-auto justify-center"
                >
                  <span className="relative z-10">Book Service</span>
                  <motion.div
                    className="relative z-10"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight size={24} />
                  </motion.div>
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                </motion.button>
              </Link>
              <Link href="/contact" prefetch>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white/20 transition-all flex items-center space-x-3 w-full sm:w-auto justify-center"
                >
                  <MessageSquare size={24} />
                  <span>Contact Our Experts</span>
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
