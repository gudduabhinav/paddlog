"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Globe2 } from "lucide-react";

type HubProps = {
  x: string;
  y: string;
  label: string;
};

type FlightPoint = {
  x: string;
  y: string;
};

type FlyingPlaneProps = {
  src: string;
  from: FlightPoint;
  to: FlightPoint;
  duration: number;
  delay: number;
  size: number;
  flip: boolean;
  className?: string;
};

type StatSmallProps = {
  value: string;
  label: string;
};

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
    const legacyMql = mql as MediaQueryList & {
      addListener: (listener: (event: MediaQueryListEvent) => void) => void;
      removeListener: (listener: (event: MediaQueryListEvent) => void) => void;
    };

    legacyMql.addListener(onChange);
    return () => legacyMql.removeListener(onChange);
  }, []);

  return (
    <section id="global" className="py-32 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_40%,#eef4ff_100%)] overflow-hidden relative font-roboto border-t border-slate-200">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[#E53935]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.10),transparent_55%)] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 text-center mb-20">
        <div className="inline-flex items-center gap-2 bg-white text-[#E53935] px-5 py-2 rounded-full text-xs font-bold uppercase tracking-[0.3em] mb-6 border border-slate-200 shadow-sm">
          <Globe2 size={14} />
          Global Network Protocol
        </div>
        <h2 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tighter uppercase mb-2">
          International <span className="text-[#E53935]">reach</span>
        </h2>
        <p className="text-slate-500 font-medium">Connecting major industrial hubs with dangerous goods precision.</p>
      </div>

      {/* Dynamic Network Visualizer */}
      <div className="relative w-full aspect-[21/9] bg-[linear-gradient(180deg,#f8fbff_0%,#edf3fb_100%)] border-y border-slate-200 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.4))] z-[1]" />
        <img 
          src="/global_network_landscape.png" 
          className="w-full h-full object-cover opacity-80 saturate-[0.9] brightness-110" 
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
              className="bg-white/80 border border-slate-200 p-8 rounded-[2rem] hover:bg-white hover:border-[#E53935]/30 transition-all cursor-default group shadow-[0_20px_50px_rgba(148,163,184,0.16)]"
            >
              <div className="text-2xl font-bold text-slate-900 mb-1 group-hover:text-[#E53935] transition-colors uppercase">{office.city}</div>
              <div className="text-[#E53935] text-[10px] font-bold uppercase tracking-widest">{office.tag}</div>
              <p className="text-slate-500 text-sm mt-4 font-medium leading-relaxed">{office.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="space-y-10">
          <div className="flex flex-wrap gap-3">
            {regions.map((region) => (
              <span key={region} className="px-6 py-2.5 bg-white border border-slate-200 rounded-full text-slate-600 text-sm font-bold uppercase tracking-widest hover:bg-[#E53935] hover:text-white hover:border-[#E53935] transition-all cursor-default shadow-sm">
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

function Hub({ x, y, label }: HubProps) {
  return (
    <div className="absolute z-20 group" style={{ left: x, top: y }}>
      <div className="relative flex items-center justify-center">
        <div className="absolute w-8 h-8 bg-[#E53935]/20 rounded-full animate-ping" />
        <div className="w-2.5 h-2.5 bg-[#E53935] rounded-full shadow-[0_0_15px_#E53935]" />
        <div className="absolute top-4 left-4 whitespace-nowrap bg-white/95 backdrop-blur-md px-3 py-1 rounded text-[10px] font-bold text-slate-600 uppercase tracking-widest border border-slate-200 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
          {label}
        </div>
      </div>
    </div>
  );
}

function FlyingPlane({ src, from, to, duration, delay, size, flip, className = "" }: FlyingPlaneProps) {
  return (
    <motion.img
      src={src}
      alt="Plane"
      className={`absolute pointer-events-none z-10 sm:filter sm:brightness-95 sm:drop-shadow-[0_0_8px_rgba(15,23,42,0.18)] ${className}`}
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

function StatSmall({ value, label }: StatSmallProps) {
  return (
    <div className="min-w-0 text-center p-3 sm:p-8 bg-white/80 border border-slate-200 rounded-[2rem] hover:border-[#E53935]/50 transition-all shadow-[0_20px_50px_rgba(148,163,184,0.14)]">
      <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 uppercase tracking-tighter leading-none">{value}</div>
      <div className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-[0.12em] sm:tracking-[0.2em] leading-tight break-words">{label}</div>
    </div>
  );
}
