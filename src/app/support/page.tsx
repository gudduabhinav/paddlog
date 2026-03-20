"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MessageCircle,
  Clock,
  ShieldCheck,
  Headphones,
  ChevronRight,
  Globe,
  Zap,
  CheckCircle2,
  Users,
  ArrowRight,
  ExternalLink,
  ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Support() {
  return (
    <main className="min-h-screen bg-white font-body flex flex-col text-slate-900 overflow-hidden">
      <Navbar />

      {/* Hero Section - Compact & Authoritative */}
      <section className="relative pt-44 pb-16 overflow-hidden bg-slate-50/50">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-3xl text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-8"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                Global Control Center Active
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter text-slate-900 mb-6"
              >
                24/7 Expert <br />
                <span className="text-primary">Assistance.</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-slate-500 text-lg md:text-xl leading-relaxed font-medium max-w-2xl mx-auto lg:mx-0"
              >
                Immediate coordination for high-risk cargo, documentation review, and emergency logistics clearance. No wait times, just solutions.
              </motion.p>
            </div>

            {/* Performance Snapshot */}
            <div className="flex flex-col gap-6 w-full lg:w-auto">
               {[
                 { label: "Compliance Verified", value: "100%", sub: "UN Standards", icon: ShieldCheck },
                 { label: "Rapid Response", value: "< 2hr", sub: "Global Average", icon: Clock },
               ].map((stat, i) => (
                 <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:border-primary/20 transition-all">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-primary border border-slate-100 group-hover:bg-primary/5 transition-colors">
                       <stat.icon size={28} />
                    </div>
                    <div>
                       <div className="text-2xl font-black text-slate-900">{stat.value}</div>
                       <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* EMERGENCY FIRST - The Most Important Thing */}
      <section className="py-12 relative z-20 -mt-8">
        <div className="container mx-auto px-6">
           <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-1 rounded-[3.5rem] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-2xl relative overflow-hidden group"
          >
            <div className="bg-slate-900 rounded-[3.3rem] p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(225,29,72,0.15),transparent)] pointer-events-none" />
               
               <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-primary">
                     <ShieldAlert size={32} className="animate-pulse" />
                  </div>
                  <div className="text-center md:text-left">
                     <h3 className="text-2xl md:text-3xl font-black text-white mb-1">Emergency Escalation</h3>
                     <p className="text-slate-400 text-sm md:text-base font-medium">Bypasses all queues for spills, leaks, or safety incidents.</p>
                  </div>
               </div>

               <div className="relative z-10">
                  <button 
                    onClick={() => {
                      const msg = encodeURIComponent("EMERGENCY SAFETY INCIDENT: I require immediate assistance. Please connect me to a senior safety specialist.");
                      window.location.href = `https://wa.me/917386107071?text=${msg}`;
                    }}
                    className="bg-white text-slate-900 px-10 py-5 rounded-2.5xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-3"
                  >
                    Open SOS Channel
                    <ArrowRight size={18} />
                  </button>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Support Methods - Sleek & Functional */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {/* Global Hotline */}
             <div className="bg-slate-50/50 border border-slate-100 p-8 rounded-[3rem] hover:bg-white transition-all group hover:shadow-xl hover:border-primary/10">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-8">
                   <Phone size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 tracking-tight">Global Hotline</h3>
                <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">Immediate voice coordination for urgent shipment bottlenecks.</p>
                <div className="space-y-3">
                   {[
                     { label: "Bangalore", value: "+91 73861 07071", href: "tel:+917386107071" },
                     { label: "Hyderabad", value: "+91 70937 77026", href: "tel:+917093777026" }
                   ].map((link, i) => (
                     <a key={i} href={link.href} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-primary/30 transition-all group/item shadow-sm">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{link.label}</span>
                        <span className="font-bold text-slate-900 group-hover/item:text-primary">{link.value}</span>
                     </a>
                   ))}
                </div>
             </div>

             {/* WhatsApp Chat */}
             <div className="bg-slate-900 p-8 rounded-[3rem] text-white overflow-hidden relative group hover:shadow-red-glow transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 blur-[40px] rounded-full" />
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-primary mb-8 border border-white/10">
                   <MessageCircle size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight">Instant Chat</h3>
                <p className="text-white/60 text-sm font-medium mb-12 leading-relaxed">Real-time document verification and safety compliance via WhatsApp.</p>
                <button 
                  onClick={() => window.location.href = "https://wa.me/917386107071"}
                  className="w-full bg-white text-slate-900 p-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all shadow-lg flex items-center justify-center gap-3 group/btn"
                >
                  Start Global Chat
                  <ExternalLink size={16} className="group-hover/btn:rotate-45 transition-transform" />
                </button>
             </div>

             {/* Email Review */}
             <div className="bg-slate-50/50 border border-slate-100 p-8 rounded-[3rem] hover:bg-white transition-all group hover:shadow-xl hover:border-primary/10">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-8">
                   <Mail size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 tracking-tight">Expert Review</h3>
                <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">Submit MSDS and manifests for immediate specialized check.</p>
                <div className="space-y-3">
                   {[
                     { label: "Ops & Sales", value: "Blrops@paddlog.com", href: "mailto:Blrops@paddlog.com" },
                     { label: "Technical", value: "Hydops@paddlog.com", href: "mailto:Hydops@paddlog.com" }
                   ].map((link, i) => (
                     <a key={i} href={link.href} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-primary/30 transition-all group/item shadow-sm">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{link.label}</span>
                        <span className="font-bold text-slate-900 group-hover/item:text-primary">{link.value}</span>
                     </a>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Response Workflow */}
      <section className="py-24 bg-slate-50/30">
        <div className="container mx-auto px-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-slate-100 pt-16">
              {[
                { step: "01", title: "Immediate Access", desc: "Consult directly with a certified DG specialist within minutes." },
                { step: "02", title: "Risk Assessment", desc: "Real-time evaluation of hazardous cargo documentation." },
                { step: "03", title: "Global Clearance", desc: "Coordinated priority handling across checkpoints." }
              ].map((item, i) => (
                <div key={i} className="relative">
                   <div className="text-6xl font-black text-slate-100 absolute -top-10 -left-2 select-none">{item.step}</div>
                   <div className="relative z-10">
                      <h4 className="text-xl font-bold mb-3 text-slate-900 tracking-tight">{item.title}</h4>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
