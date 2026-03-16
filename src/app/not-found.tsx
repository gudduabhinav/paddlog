"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plane, Home, ArrowLeft, Search } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] flex flex-col font-body">
      <Navbar />
      
      <div className="flex-1 flex flex-center flex-col items-center justify-center px-6 py-24 text-center relative overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div 
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" 
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          {/* Plane Animation */}
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="text-primary mb-8"
          >
            <Plane size={120} strokeWidth={1} />
          </motion.div>

          <h1 className="text-8xl md:text-9xl font-bold text-white mb-4 tracking-tighter">
            4<span className="text-primary">0</span>4
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Oops! This Shipment is <span className="text-primary italic">Off-Course</span>
          </h2>
          
          <p className="text-slate-400 max-w-md mx-auto mb-10 text-lg">
            The page you are looking for has been rerouted or never reached our departure gate. 
            Let's get you back to safety.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="red-gradient text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-2xl"
              >
                <Home size={20} />
                Back to Home
              </motion.button>
            </Link>
            
            <Link href="/services">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 backdrop-blur-md transition-all"
              >
                <Search size={20} />
                Explore Services
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
