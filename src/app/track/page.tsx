"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  MapPin, 
  Truck, 
  Package, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Check
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export default function TrackingPage() {
  const [trackId, setTrackId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    if (!trackId) return;
    setLoading(true);
    setResult(null);
    setError(false);

    try {
      const { data, error: sbError } = await supabase
        .from('shipments')
        .select('*')
        .eq('id', trackId.toUpperCase().trim())
        .single();

      if (sbError || !data) {
        setError(true);
      } else {
        setResult(data);
      }
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0f1e] font-body flex flex-col">
      <Navbar />

      <section className="pt-40 pb-20 relative overflow-hidden flex-grow">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[130px] rounded-full" />

        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <div className="text-center mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black mb-4 text-white"
            >
              Track Your <span className="text-primary italic">Shipment</span>
            </motion.h1>
            <p className="text-slate-400 text-lg">
              Check real-time status of your hazardous material shipments powered by Supabase.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-6 md:p-8 rounded-[2.5rem] shadow-premium border border-white/10 mb-12">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  value={trackId}
                  onChange={(e) => setTrackId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
                  placeholder="Tracking ID (e.g. PL-12345)"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-lg font-bold text-white placeholder:text-slate-600"
                />
              </div>
              <button 
                onClick={handleTrack}
                disabled={loading}
                className="red-gradient text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 min-w-[180px] shadow-lg hover:shadow-red-glow transition-all"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : "Track Now"}
              </button>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 p-4 bg-red-500/10 text-red-400 rounded-xl flex items-center gap-2 text-sm font-bold border border-red-500/20 italic overflow-hidden">
                  <AlertCircle size={16} /> No shipment found with this ID. Please contact support.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {result && (
              <motion.div key={result.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                
                <div className="bg-white/5 backdrop-blur-md p-8 md:p-10 rounded-[2.5rem] shadow-premium border border-white/10">
                  <div className="flex flex-wrap justify-between items-center border-b border-white/5 pb-8 mb-8">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Current Status</p>
                      <h2 className="text-3xl font-black text-primary flex items-center gap-2">
                        {result.status}
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-40"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                        </span>
                      </h2>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Tracking ID</p>
                      <p className="text-2xl font-bold text-white">{result.id}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <StatItem label="Origin" value={result.origin} icon={<MapPin className="text-primary" size={16} />} />
                    <StatItem label="Current" value={result.current_location} icon={<Truck className="text-orange-500" size={16} />} />
                    <StatItem label="Destination" value={result.destination} icon={<CheckCircle2 className="text-green-500" size={16} />} />
                    <StatItem label="Updated" value={result.last_update} icon={<Clock className="text-slate-500" size={16} />} />
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-md p-8 md:p-10 rounded-[3rem] shadow-premium border border-white/10">
                  <h3 className="text-2xl font-bold mb-10 flex items-center gap-3 text-white"><ShieldCheck className="text-primary" /> Journey Timeline</h3>
                  <div className="relative pl-10 space-y-10">
                    <div className="absolute left-[20px] top-2 bottom-2 w-0.5 bg-white/5" />
                    {result.steps?.map((s: any, i: number) => (
                      <div key={i} className="relative flex items-start gap-6">
                        <div className={cn("absolute -left-10 w-10 h-10 rounded-full border-4 border-[#0a0f1e] flex items-center justify-center z-10", s.completed ? "bg-primary" : "bg-white/10")}>
                          {s.completed && <Check size={18} className="text-white" />}
                        </div>
                        <div className="pt-1.5 ml-2">
                          <p className={cn("font-bold text-lg leading-tight", s.active ? "text-primary" : s.completed ? "text-white" : "text-slate-600")}>{s.status}</p>
                          <p className="text-slate-500 text-sm">{s.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative group overflow-hidden rounded-[3rem] p-8 text-white flex flex-col md:flex-row items-center gap-6 border border-white/10">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 group-hover:scale-110 transition-transform duration-700" />
                  <div className="relative z-10 w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center"><Package size={32} /></div>
                  <div className="relative z-10 flex-1 text-center md:text-left">
                    <h4 className="text-xl font-bold">Need detailed paperwork?</h4>
                    <p className="text-white/70">Connect with our support team for copies of SDS or Customs certificates.</p>
                  </div>
                  <a href="https://wa.me/919391363636" className="relative z-10 bg-white text-primary px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform">WhatsApp Us</a>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function StatItem({ label, value, icon }: any) {
  return (
    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-sm font-bold text-white leading-tight">{value}</p>
    </div>
  );
}
