"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    name: "John Miller",
    role: "Logistics Manager",
    company: "Global Chemicals Inc.",
    content: "Paddlog has revolutionized our hazardous goods shipping. Their documentation is flawless and delivery times are exceptional.",
    rating: 5,
  },
  {
    name: "Sarah Chen",
    role: "Compliance Officer",
    company: "BioTech Solutions",
    content: "The expertise in UN certified packaging that Paddlog provides is unmatched. We feel completely safe working with them.",
    rating: 5,
  },
  {
    name: "David Ross",
    role: "COO",
    company: "Energy Dynamics",
    content: "Fast, reliable, and highly professional. Their global network makes international shipping of dangerous goods seamless.",
    rating: 5,
  },
];

export function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section id="testimonials" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Animated background quote */}
      <motion.div
        className="absolute top-0 right-0 p-20 opacity-[0.03]"
        animate={{ rotate: [0, 5, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <Quote size={300} />
      </motion.div>

      {/* Floating decorative dots */}
      <motion.div
        className="absolute left-[10%] top-[20%] w-3 h-3 rounded-full bg-red-300/30"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[15%] bottom-[25%] w-4 h-4 rounded-full bg-blue-300/30"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            What Our Clients <span className="text-primary">Say</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-600"
          >
            Trust is the foundation of dangerous goods logistics.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto relative px-4 md:px-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -40, scale: 0.96 }}
              transition={{ duration: 0.4 }}
              className="bg-white p-6 sm:p-10 md:p-16 rounded-[2rem] md:rounded-[3rem] shadow-premium border border-slate-100 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <Quote className="text-primary mx-auto mb-6" size={44} />
              </motion.div>

              {/* Star rating */}
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: testimonials[index].rating }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <Star size={18} className="text-amber-400 fill-amber-400" />
                  </motion.div>
                ))}
              </div>

              <p className="text-lg sm:text-2xl md:text-3xl font-medium text-slate-700 leading-relaxed mb-8 md:mb-10">
                &ldquo;{testimonials[index].content}&rdquo;
              </p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {/* Avatar initial */}
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {testimonials[index].name.charAt(0)}
                </div>
                <h4 className="text-2xl font-bold text-secondary">{testimonials[index].name}</h4>
                <p className="text-slate-500">{testimonials[index].role}, {testimonials[index].company}</p>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prev}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 bg-white p-4 rounded-full shadow-lg text-secondary hover:text-primary transition-all border border-slate-100 items-center justify-center"
          >
            <ChevronLeft size={24} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={next}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 bg-white p-4 rounded-full shadow-lg text-secondary hover:text-primary transition-all border border-slate-100 items-center justify-center"
          >
            <ChevronRight size={24} />
          </motion.button>

          {/* Dots */}
          <div className="flex justify-center mt-10 space-x-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  i === index ? "w-8 bg-primary" : "w-3 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
