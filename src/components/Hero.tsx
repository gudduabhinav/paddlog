"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, animate } from "framer-motion";
import { ArrowRight, ShieldCheck, Globe2, Package, Plane, Truck, Ship, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; size: number; duration: number; delay: number; opacity: number; dx: number }[]
  >([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.5 + 1,
        duration: Math.random() * 10 + 8,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.4 + 0.1,
        dx: Math.random() > 0.5 ? 18 : -18,
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: p.opacity }}
          animate={{ y: [0, -36, 0], x: [0, p.dx, 0], opacity: [p.opacity, p.opacity * 2, p.opacity] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ─── Cinematic Logistics Visual ───────────────────────────────────────────────
function GlobeVisual() {
  return (
    <div className="relative w-full max-w-[600px] h-[500px] flex items-center justify-center select-none perspective-[1500px] overflow-visible">
      {/* Base Cinematic Image with Parallax */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotateX: [0, 2, 0],
          rotateY: [0, -2, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-full h-[400px] rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
      >
        <img
          src="/logistics_scene.png"
          alt="Logistics Scene"
          className="w-full h-full object-cover object-[center_30%] scale-100 opacity-100"
        />

        {/* Animated Overlays on top of the image */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-transparent to-transparent opacity-60" />

        {/* Pulsing Hubs on the Globe */}
        <PulsingHub x="45%" y="35%" delay={0} />
        <PulsingHub x="55%" y="45%" delay={0.8} />
        <PulsingHub x="40%" y="55%" delay={1.5} />
      </motion.div>

      {/* Floating 3D Data Cards (Detached from image for 3D effect) */}
      <FloatingCard
        icon={Plane}
        label="Flight PL-702"
        status="Departing Now"
        color="#ef4444"
        className="top-0 -right-4"
        delay={0}
      />
      <FloatingCard
        icon={Truck}
        label="Truck GH-110"
        status="Customs Cleared"
        color="#f97316"
        className="bottom-4 -left-10"
        delay={1.2}
      />
      <FloatingCard
        icon={Ship}
        label="Vessel MS-Ocean"
        status="En route"
        color="#3b82f6"
        className="bottom-20 -right-12"
        delay={2.5}
      />
    </div>
  );
}

function PulsingHub({ x, y, delay }: { x: string, y: string, delay: number }) {
  return (
    <div className="absolute" style={{ left: x, top: y }}>
      <span className="relative flex h-4 w-4">
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 3, delay, repeat: Infinity }}
          className="absolute inline-flex h-full w-full rounded-full bg-red-400"
        />
        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 shadow-[0_0_15px_rgba(239,68,68,1)]" />
      </span>
    </div>
  );
}

function FloatingCard({ icon: Icon, label, status, color, className, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: [0, -15, 0], x: [0, 10, 0] }}
      transition={{
        opacity: { duration: 0.8, delay },
        y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay },
        x: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: delay + 0.5 }
      }}
      className={cn("absolute z-50 bg-[#12172b]/80 backdrop-blur-xl border border-white/10 p-4 rounded-3xl shadow-2xl min-w-[160px]", className)}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
          <Icon size={20} style={{ color }} />
        </div>
        <div>
          <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">{label}</div>
          <div className="text-white text-xs font-bold">{status}</div>
        </div>
      </div>
      <div className="absolute -bottom-1 left-4 right-4 h-0.5" style={{ backgroundColor: color, opacity: 0.3 }} />
    </motion.div>
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
    { icon: Package, label: "Shipments Handled", value: 5000, suffix: "+" },
    { icon: Globe2, label: "Countries Reached", value: 40, suffix: "+" },
    { icon: ShieldCheck, label: "Safety Compliance", value: 100, suffix: "%" },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0f1e]">
      {/* ── Background ── */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1e] via-[#12172b] to-[#0a0f1e]" />
        <div
          className="absolute inset-0 opacity-30"
          style={{ backgroundImage: "radial-gradient(ellipse 80% 60% at 70% 40%, rgba(211,47,47,0.25) 0%, transparent 70%)" }}
        />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <Particles />

      {/* ── Content ── */}
      <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-28 pb-16">
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-red-600/15 border border-red-500/30 text-red-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            Pioneers in Dangerous Goods Logistics
          </motion.div>

          {/* Headline */}
          <h1 className="text-5xl md:text-[4.5rem] font-black leading-[1.08] mb-6 tracking-tight">
            <span className="text-white">Dangerous Goods</span>
            <br />
            <motion.span
              key={wordIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45 }}
              className="bg-gradient-to-r from-red-500 via-orange-400 to-red-500 bg-clip-text text-transparent"
            >
              {words[wordIndex]}
            </motion.span>
          </h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 text-lg md:text-xl leading-relaxed mb-10 max-w-lg"
          >
            From Hyderabad to the world — we move hazardous materials and critical cargo with{" "}
            <span className="text-white font-semibold">precision, safety & speed</span>.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 mb-14"
          >
            <Link href="/book" prefetch>
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(239,68,68,0.5)" }}
                whileTap={{ scale: 0.96 }}
                className="group relative overflow-hidden bg-gradient-to-r from-red-600 to-rose-500 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 shadow-[0_8px_32px_-6px_rgba(239,68,68,0.5)]"
              >
                <span className="relative z-10">Book Service</span>
                <motion.div className="relative z-10" animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <ArrowRight size={20} />
                </motion.div>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-600 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
              </motion.button>
            </Link>

            <Link href="/services" prefetch>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="px-8 py-4 rounded-2xl font-bold text-lg border border-white/20 text-white/80 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all duration-200"
              >
                Explore Services
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="grid grid-cols-3 gap-4"
          >
            {stats.map(({ icon: Icon, label, value, suffix }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <Icon size={20} className="text-red-400 mb-2" />
                <div className="text-2xl font-black text-white">
                  <Counter to={value} suffix={suffix} />
                </div>
                <div className="text-xs text-slate-400 mt-1 leading-tight">{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* RIGHT — Globe with cargo planes */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="hidden lg:flex items-center justify-center"
        >
          <GlobeVisual />
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0f1e] via-transparent to-transparent z-10" />
    </section>
  );
}
