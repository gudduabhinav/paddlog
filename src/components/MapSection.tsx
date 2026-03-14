"use client";

import { useState } from "react";
import { motion, easeInOut } from "framer-motion";
import { Globe2, Ship, Plane, Truck } from "lucide-react";

const offices = [
  { city: "Hyderabad", tag: "Head Office", desc: "Hyderabad, Telangana, India" },
  { city: "Mumbai", tag: "West India Hub", desc: "Mumbai, Maharashtra, India" },
  { city: "Chennai", tag: "South India Hub", desc: "Chennai, Tamil Nadu, India" },
  { city: "Bangalore", tag: "Tech City Office", desc: "Bangalore, Karnataka, India" },
];

const regions = ["Europe", "USA", "Middle East", "Southeast Asia", "Africa", "Australia"];

export function MapSection() {
  return (
    <section className="py-24 bg-[#0a0f1e] overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-3 mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-white/5 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-4 border border-white/10">
            <Globe2 size={14} />
            Global Reach
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white">
            Our <span className="text-primary italic">Global</span>{" "}
            <span className="text-white/40">Network</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto font-medium">
            Bridging continents with precision logistics. Connecting India's industries to every major global hub.
          </p>
        </motion.div>
      </div>

      {/* FULL WIDTH DYNAMIC BANNER - NO CROPPING */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative w-full group mt-12 bg-[#040712]"
      >
        <div className="relative w-full aspect-[16/9] md:aspect-[2.5/1] lg:aspect-[3.2/1] overflow-hidden border-y border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex items-center justify-center">
          <img
            src="/global_network_landscape.png"
            alt="Global logistics network landscape"
            className="w-full h-full object-fill opacity-90 transition-transform duration-[30s] ease-linear"
            loading="lazy"
          />

          {/* Pulsing location hubs */}
          {[
            { left: "55%", top: "35%", label: "India Hub" },
            { left: "15%", top: "25%", label: "North America" },
            { left: "45%", top: "22%", label: "Europe" },
            { left: "82%", top: "45%", label: "Australia" },
          ].map((dot, i) => (
            <motion.div
              key={i}
              className="absolute h-4 w-4 rounded-full bg-primary shadow-[0_0_20px_#ef4444] z-20"
              style={{ left: dot.left, top: dot.top }}
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
              transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
            >
              <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-50" />
            </motion.div>
          ))}

          {/* FLEET OF CARGO PLANES - Diverse Directions */}
          
          {/* FLEET OF CARGO PLANES - Diverse Directions & Staggered Departure */}
          
          {/* FLEET OF CARGO PLANES - Diverse Directions & Staggered Departure */}
          
          {/* USER'S ORIGINAL COORDINATES - STAGGERED & DISPERSED */}
          {/* Plane 1 faces Left by default. Plane 2 faces Right by default. */}
          
          {/* Movement: Right to Left -> No flip for plane-1, flip for plane-2 */}
          <FlyingPlane src="/plane-1.png" from={{ x: "10%", y: "10%" }} to={{ x: "-200%", y: "-40%" }} duration={15} size={6} delay={0} flip={false} />
          <FlyingPlane src="/plane-1.png" from={{ x: "5%", y: "20%" }} to={{ x: "-120%", y: "40%" }} duration={14} size={5} delay={2} flip={false} />
          <FlyingPlane src="/plane-1.png" from={{ x: "120%", y: "40%" }} to={{ x: "-8%", y: "-20%" }} duration={16} size={5} delay={4} flip={false} />
          <FlyingPlane src="/plane-1.png" from={{ x: "5%", y: "20%" }} to={{ x: "-120%", y: "40%" }} duration={18} size={5} delay={6} flip={false} />
          <FlyingPlane src="/plane-2.png" from={{ x: "100%", y: "-80%" }} to={{ x: "30%", y: "40%" }} duration={15} size={8} delay={1} flip={true} />

          {/* ADDITIONAL PLANES - NOSE FIRST FLOW */}
          {/* Movement: Right to Left */}
          <FlyingPlane src="/plane-1.png" from={{ x: "110%", y: "50%" }} to={{ x: "-10%", y: "45%" }} duration={12} size={6} delay={3} flip={false} />
          <FlyingPlane src="/plane-2.png" from={{ x: "110%", y: "30%" }} to={{ x: "-10%", y: "35%" }} duration={14} size={6} delay={5} flip={true} />
          <FlyingPlane src="/plane-1.png" from={{ x: "70%", y: "-10%" }} to={{ x: "60%", y: "110%" }} duration={20} size={5} delay={7} flip={false} />
          
          {/* Movement: Left to Right */}
          <FlyingPlane src="/plane-2.png" from={{ x: "20%", y: "-10%" }} to={{ x: "30%", y: "110%" }} duration={22} size={5} delay={9} flip={false} />
          <FlyingPlane src="/plane-1.png" from={{ x: "120%", y: "20%" }} to={{ x: "-20%", y: "25%" }} duration={10} size={4} delay={0.5} flip={false} />
          <FlyingPlane src="/plane-2.png" from={{ x: "120%", y: "60%" }} to={{ x: "-20%", y: "65%" }} duration={11} size={4} delay={2.5} flip={true} />
        </div>

        {/* Status cards - positioned relative to viewport edges */}
        <div className="hidden lg:block">
          <Vehicle icon={<Ship className="text-primary" />} top="70%" left="3%" label="Ocean MS-90" delay={0} />
          <Vehicle icon={<Plane className="text-primary" />} top="15%" left="94%" label="Flight PL-72" delay={0.5} />
          <Vehicle icon={<Truck className="text-primary" />} top="80%" left="88%" label="Ground Support" delay={1} />
        </div>
      </motion.div>

      <div className="container mx-auto px-6 relative z-10 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Offices */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="uppercase tracking-[0.3em] text-[10px] font-black text-primary/60">Strategic India Hubs</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {offices.map((office, i) => (
                <motion.div
                  key={office.city}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group/item relative bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-primary/30 transition-all cursor-pointer overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="text-xl font-black text-white group-hover/item:text-primary transition-colors">{office.city}</div>
                    <div className="text-primary/60 text-xs font-bold uppercase tracking-wider mt-1">{office.tag}</div>
                    <div className="text-slate-400 text-sm mt-3 leading-relaxed">{office.desc}</div>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16 group-hover/item:bg-primary/20 transition-all" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Region Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
                <Globe2 className="text-primary" size={20} />
              </div>
              <span className="text-2xl font-black text-white">Global Service Network</span>
            </div>

            <div className="flex flex-wrap gap-3">
              {regions.map((region, i) => (
                <motion.span
                  key={region}
                  className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm font-bold hover:bg-primary hover:text-white hover:border-primary transition-all cursor-pointer"
                  whileHover={{ y: -5 }}
                >
                  {region}
                </motion.span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { value: "50+", label: "Countries" },
                { value: "200+", label: "Partners" },
                { value: "24/7", label: "Operations" },
              ].map((stat, i) => (
                <div key={stat.label} className="relative group/stat p-6 rounded-2xl bg-white/5 border border-white/10 text-center hover:border-primary/50 transition-all">
                  <div className="text-3xl font-black text-primary mb-1">{stat.value}</div>
                  <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</div>
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-primary scale-x-0 group-hover/stat:scale-x-100 transition-transform origin-center" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Vehicle({ icon, top, left, label, delay = 0 }: { icon: React.ReactNode; top: string; left: string; label: string; delay?: number }) {
  return (
    <motion.div
      className="absolute z-20 group/v"
      style={{ top, left }}
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: delay + 0.3, type: "spring", stiffness: 200 }}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="flex flex-col items-center"
      >
        <div className="bg-[#0a0f1e] rounded-2xl p-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/10 backdrop-blur-md">
          {icon}
        </div>
        <div className="mt-2 bg-primary/10 border border-primary/20 px-2 py-0.5 rounded text-[9px] font-black text-primary uppercase tracking-tighter opacity-0 group-hover/v:opacity-100 transition-opacity">
          {label}
        </div>
      </motion.div>
    </motion.div>
  );
}

function FlyingPlane({
  src, from, to, duration, size = 4, flip = false, delay = 0
}: {
  src: string;
  from: { x: string; y: string }; to: { x: string; y: string };
  duration: number; size?: number; flip?: boolean; delay?: number;
}) {
  return (
    <motion.img
      src={src}
      alt="Flying Plane"
      className="absolute pointer-events-none z-50 filter brightness-125 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
      style={{
        width: `${size}rem`,
        scaleX: flip ? -1 : 1,
        left: from.x,
        top: from.y
      }}
      initial={{ opacity: 0 }}
      animate={{
        left: [from.x, to.x],
        top: [from.y, to.y],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear",
        delay,
        times: [0, 0.1, 0.9, 1]
      }}
    />
  );
}
