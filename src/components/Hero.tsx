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
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white font-roboto">
      {/* Background with a premium, bright logistics feel */}
      <div className="absolute inset-0 z-0 text-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(225,29,72,0.03)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_80%,rgba(59,130,246,0.03)_0%,transparent_50%)]" />
        {/* Subtle Grid Layer - Darker for visibility on light bg */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-32 pb-20">
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 text-primary px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Specialized Dangerous Goods Logistics
          </div>

          <h1 className="text-5xl md:text-[5rem] font-bold text-slate-900 leading-[1.05] mb-6 tracking-tighter">
            Dangerous Goods<br />
            <motion.span 
              key={wordIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-primary italic"
            >
              {words[wordIndex]}
            </motion.span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-lg mb-10 leading-relaxed font-medium">
            Moving hazardous materials across borders with <span className="text-slate-900 font-bold">absolute compliance</span> and surgical precision.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 mb-16">
            <Link href="/book" className="group relative bg-primary text-white px-10 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-3">
              Book Now
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/services" className="px-10 py-4 rounded-full font-bold text-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all text-center">
              Explore Services
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-8 border-t border-slate-100 pt-10">
            {stats.map(({ icon: Icon, label, value, suffix }) => (
              <div key={label}>
                <div className="text-3xl font-black text-slate-900 mb-1 tracking-tight">
                  <Counter to={value} suffix={suffix} />
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative hidden lg:block"
        >
          <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full" />
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-[3rem] blur-2xl opacity-50" />
            <img 
              src="/logistics_scene.png" 
              alt="Dangerous Goods Logistics Hub" 
              className="relative z-10 w-full h-auto rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white object-cover aspect-[4/3]"
            />
          </div>
          


          <div className="absolute -top-6 -right-6 bg-white border border-slate-100 shadow-2xl p-5 rounded-2xl z-20" style={{ animationDuration: '4s' }}>
             <ShieldCheck size={28} className="text-primary mb-1" />
             <div className="text-[10px] font-black uppercase text-slate-900 tracking-widest leading-none">Compliant</div>
          </div>
          
          <div className="absolute -bottom-8 -left-8 bg-white border border-slate-100 p-5 rounded-2xl shadow-xl z-20">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                 <Globe2 size={20} className="text-primary" />
               </div>
               <div>
                 <div className="text-xs font-black text-slate-900 tracking-wide uppercase">Global Reach</div>
                 <div className="text-[10px] text-slate-500 font-bold">150+ Countries</div>
               </div>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


