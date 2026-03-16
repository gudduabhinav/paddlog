"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, animate } from "framer-motion";
import { ArrowRight, ShieldCheck, Globe2, Package } from "lucide-react";
import Link from "next/link";

// ─── Animated Counter ────────────────────────────────────────────────────────
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const controls = animate(0, to, {
      duration: 2,
      ease: "easeOut",
      onUpdate(value) {
        if (ref.current) ref.current.textContent = Math.round(value) + suffix;
      },
    });
    return controls.stop;
  }, [to, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

// ─── Floating Particles ───────────────────────────────────────────────────────
function Particles() {
  const [particles, setParticles] = useState<any[]>([]);
  useEffect(() => {
    setParticles(Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 10 + 10,
    })));
  }, []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -100, 0], opacity: [0, 1, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}

// ─── Main Hero ────────────────────────────────────────────────────────────────
export function Hero() {
  const words = ["Simplified.", "Secured.", "Delivered."];
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { icon: Package, label: "Total Shipments", value: 5000, suffix: "+" },
    { icon: Globe2, label: "Global Presence", value: 40, suffix: "+" },
    { icon: ShieldCheck, label: "Safety Rating", value: 100, suffix: "%" },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0f1e] font-roboto">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1e] via-[#12172b] to-[#0a0f1e]" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(229,57,53,0.2)_0%,transparent_70%)]" />
        {/* Grid Layer */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
      </div>

      <Particles />

      <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-28 pb-16">
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-[#E53935]/10 border border-[#E53935]/20 text-[#E53935] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
            <span className="w-2 h-2 bg-[#E53935] rounded-full animate-pulse" />
            Specialized Dangerous Goods Logistics
          </div>

          <h1 className="text-5xl md:text-[4.5rem] font-bold text-white leading-[1.05] mb-6 tracking-tighter">
            Dangerous Goods<br />
            <motion.span 
              key={wordIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-[#E53935] to-[#B71C1C] bg-clip-text text-transparent"
            >
              {words[wordIndex]}
            </motion.span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-lg mb-10 leading-relaxed font-medium">
            Moving hazardous materials across borders with <span className="text-white">absolute compliance</span> and surgical precision.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 mb-16">
            <Link href="/book" className="group relative bg-[#E53935] text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(229,57,53,0.3)] flex items-center justify-center gap-3">
              Book Now
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/services" className="px-10 py-5 rounded-2xl font-bold text-lg border border-white/10 text-white/80 hover:bg-white/5 transition-all text-center">
              Explore
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {stats.map(({ icon: Icon, label, value, suffix }) => (
              <div key={label}>
                <div className="text-3xl font-bold text-white mb-1 tracking-tight">
                  <Counter to={value} suffix={suffix} />
                </div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative hidden lg:block"
        >
          <div className="absolute inset-0 bg-[#E53935]/5 blur-[120px] rounded-full" />
          <img 
            src="/logistics_scene.png" 
            alt="Logistics" 
            className="relative z-10 w-full h-auto rounded-[4rem] shadow-2xl border border-white/5"
          />
          {/* Floating badges */}
          <div className="absolute -top-6 -right-6 bg-slate-900/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl z-20 animate-bounce group" style={{ animationDuration: '4s' }}>
             <ShieldCheck size={32} className="text-[#E53935] mb-2" />
             <div className="text-[10px] font-bold uppercase text-white tracking-widest leading-none">Compliant</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
