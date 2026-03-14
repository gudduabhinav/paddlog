"use client";

import React from "react";
import { motion } from "framer-motion";

const clients = ["TOSHIBA", "SHELL", "RAFAEL", "SKYTRACK", "DRL", "HETERO"];

export function ClientMarquee() {
  return (
    <div className="py-14 bg-slate-50 border-y border-slate-100 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="container mx-auto px-6 mb-8 text-center"
      >
        <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-500 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-slate-200">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Trusted by Industry Leaders
        </div>
      </motion.div>
      <div className="flex whitespace-nowrap">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex space-x-20 items-center px-10"
        >
          {Array(4).fill(clients).flat().map((client, i) => (
            <motion.span
              key={i}
              className="text-3xl font-black text-slate-800/10 hover:text-primary/30 transition-colors cursor-default select-none"
              whileHover={{ scale: 1.1 }}
            >
              {client}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
