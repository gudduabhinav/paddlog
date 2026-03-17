"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Globe2 } from "lucide-react";

const offices = [
  { city: "Hyderabad", tag: "Head Office", desc: "Hyderabad, Telangana, India" },
  { city: "Mumbai", tag: "West India Hub", desc: "Mumbai, Maharashtra, India" },
  { city: "Chennai", tag: "South India Hub", desc: "Chennai, Tamil Nadu, India" },
  { city: "Bangalore", tag: "Tech City Office", desc: "Bangalore, Karnataka, India" },
];

const regions = ["Europe", "USA", "Middle East", "Southeast Asia", "Africa", "Australia"];

export function MapSection() {
  const [isSmUp, setIsSmUp] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia("(min-width: 640px)");
    const onChange = () => setIsSmUp(mql.matches);

    onChange();

    if ("addEventListener" in mql) {
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    }

    // Safari < 14 fallback
    mql.addListener(onChange);
    return () => mql.removeListener(onChange);
  }, []);

  return (
    <section id="global" className="py-32 bg-[#040712] overflow-hidden relative font-roboto">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[#E53935]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 text-center mb-20">
        <div className="inline-flex items-center gap-2 bg-white/5 text-[#E53935] px-5 py-2 rounded-full text-xs font-bold uppercase tracking-[0.3em] mb-6 border border-white/10">
          <Globe2 size={14} />
          Global Network Protocol
        </div>
        <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter uppercase mb-2">
          International <span className="text-[#E53935]">reach</span>
        </h2>
        <p className="text-slate-500 font-medium">Connecting major industrial hubs with dangerous goods precision.</p>
      </div>

      {/* Dynamic Network Visualizer */}
      <div className="relative w-full aspect-[21/9] bg-[#02040a] border-y border-white/5 flex items-center justify-center overflow-hidden">
        <img 
          src="/global_network_landscape.png" 
          className="w-full h-full object-cover opacity-50" 
          alt="World Map" 
        />
        
        {/* Animated Flying Planes - Mixture of plane-1 and plane-2 */}
        <FlyingPlane src="/plane-1.png" from={{ x: "-10%", y: "45%" }} to={{ x: "110%", y: "35%" }} duration={isSmUp ? 16 : 10} delay={0} size={5} flip={true} />
        
        {/* Plane 2 Takeoff - From Bottom Left to Top Right */}
        <FlyingPlane src="/plane-2.png" from={{ x: "-10%", y: "90%" }} to={{ x: "110%", y: "20%" }} duration={isSmUp ? 15 : 9} delay={4} size={6} flip={false} />
        
        {isSmUp && (
          <>
            <FlyingPlane src="/plane-1.png" from={{ x: "50%", y: "15%" }} to={{ x: "110%", y: "60%" }} duration={14} delay={2} size={4.5} flip={true} className="hidden sm:block" />

            {/* Plane 2 Takeoff - From Center Bottom to Top Left */}
            <FlyingPlane src="/plane-2.png" from={{ x: "40%", y: "100%" }} to={{ x: "-20%", y: "10%" }} duration={12} delay={8} size={5} flip={true} className="hidden sm:block" />

            <FlyingPlane src="/plane-1.png" from={{ x: "80%", y: "10%" }} to={{ x: "10%", y: "50%" }} duration={20} delay={10} size={3.5} flip={false} className="hidden sm:block" />
          </>
        )}

        {/* Pulsing City Hubs */}
        <Hub x="55%" y="38%" label="Hyderabad HQ" />
        <Hub x="18%" y="28%" label="New York Hub" />
        <Hub x="48%" y="25%" label="Frankfurt Hub" />
        <Hub x="85%" y="45%" label="Sydney Hub" />
        <Hub x="65%" y="55%" label="Singapore Hub" />
      </div>

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 mt-20 relative z-10 font-roboto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {offices.map((office, i) => (
            <motion.div
              key={office.city}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 hover:border-[#E53935]/30 transition-all cursor-default group"
            >
              <div className="text-2xl font-bold text-white mb-1 group-hover:text-[#E53935] transition-colors uppercase">{office.city}</div>
              <div className="text-[#E53935] text-[10px] font-bold uppercase tracking-widest">{office.tag}</div>
              <p className="text-slate-500 text-sm mt-4 font-medium leading-relaxed">{office.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="space-y-10">
          <div className="flex flex-wrap gap-3">
            {regions.map((region) => (
              <span key={region} className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-slate-300 text-sm font-bold uppercase tracking-widest hover:bg-[#E53935] hover:text-white hover:border-[#E53935] transition-all cursor-default">
                {region}
              </span>
            ))}
          </div>
          
          <div className="grid grid-cols-3 gap-3 sm:gap-6">
            <StatSmall value="50+" label="Countries" />
            <StatSmall value="200+" label="Partners" />
            <StatSmall value="24/7" label="Uplink" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Hub({ x, y, label }: any) {
  return (
    <div className="absolute z-20" style={{ left: x, top: y }}>
      <div className="relative flex items-center justify-center">
        <div className="absolute w-8 h-8 bg-[#E53935]/20 rounded-full animate-ping" />
        <div className="w-2.5 h-2.5 bg-[#E53935] rounded-full shadow-[0_0_15px_#E53935]" />
        <div className="absolute top-4 left-4 whitespace-nowrap bg-black/80 backdrop-blur-md px-3 py-1 rounded text-[10px] font-bold text-white/60 uppercase tracking-widest border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
          {label}
        </div>
      </div>
    </div>
  );
}

function FlyingPlane({ src, from, to, duration, delay, size, flip, className = "" }: any) {
  return (
    <motion.img
      src={src}
      alt="Plane"
      className={`absolute pointer-events-none z-10 sm:filter sm:brightness-110 sm:drop-shadow-[0_0_8px_rgba(255,255,255,0.15)] ${className}`}
      style={{ width: `${size}rem`, scaleX: flip ? -1 : 1 }}
      initial={{ left: from.x, top: from.y, opacity: 0 }}
      animate={{ 
        left: [from.x, to.x], 
        top: [from.y, to.y],
        opacity: [0, 1, 1, 0]
      }}
      transition={{ 
        duration, 
        delay, 
        repeat: Infinity, 
        ease: "linear",
        times: [0, 0.1, 0.9, 1]
      }}
    />
  );
}

function StatSmall({ value, label }: any) {
  return (
    <div className="min-w-0 text-center p-3 sm:p-8 bg-white/5 border border-white/10 rounded-[2rem] hover:border-[#E53935]/50 transition-all">
      <div className="text-2xl sm:text-3xl font-bold text-white mb-1 uppercase tracking-tighter leading-none">{value}</div>
      <div className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-[0.12em] sm:tracking-[0.2em] leading-tight break-words">{label}</div>
    </div>
  );
}
