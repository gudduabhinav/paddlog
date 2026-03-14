"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "What exactly are 'Dangerous Goods'?",
    answer: "Dangerous Goods (DG) are substances or articles that pose a risk to health, safety, property, or the environment. This includes chemicals, batteries, gases, flammable liquids, and infectious substances. They require specialized handling and packaging under IATA (Air) and IMDG (Sea) regulations."
  },
  {
    question: "Do you provide UN Certified packaging?",
    answer: "Yes, we provide a full range of UN Certified packaging materials, including 4G/4GV boxes, drums, and IBC tanks. Every package we supply has undergone rigorous pressure and drop testing to meet international safety standards."
  },
  {
    question: "How long does it take to prepare DG documentation?",
    answer: "Typically, we can prepare a Dangerous Goods Declaration (DGD) within 4-8 hours of receiving the MSDS (Material Safety Data Sheet). Our experts ensure 100% accuracy to prevent rejections at terminal gates."
  },
  {
    question: "Can you ship hazardous items internationally by air?",
    answer: "Absolutely. We are experts in IATA Dangerous Goods Regulations. We handle everything from classification to final uplift on freighter aircraft, ensuring your cargo reaches its global destination without compliance delays."
  },
  {
    question: "What is an MSDS and why do I need it?",
    answer: "An MSDS (Material Safety Data Sheet) is a document that provides detailed information about a chemical's properties, hazards, and safety precautions. It is mandatory for us to classify your cargo and determine the correct UN packaging and shipping requirements."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-slate-100 text-slate-500 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-slate-200"
          >
            <HelpCircle size={14} />
            Got Questions?
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Frequently Asked <span className="text-primary italic">Questions</span>
          </motion.h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Everything you need to know about our specialized dangerous goods logistics services.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={cn(
                  "rounded-[2rem] border transition-all duration-300 overflow-hidden",
                  isOpen ? "border-primary bg-primary/[0.02] shadow-lg" : "border-slate-100 bg-white hover:border-slate-300 shadow-sm"
                )}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-6 md:p-8 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className={cn(
                    "text-lg md:text-xl font-bold transition-colors",
                    isOpen ? "text-primary" : "text-slate-900"
                  )}>
                    {faq.question}
                  </span>
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                    isOpen ? "bg-primary text-white rotate-180" : "bg-slate-50 text-slate-400"
                  )}>
                    {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                  </div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 md:px-8 pb-8 text-slate-600 text-lg leading-relaxed border-t border-slate-50 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
