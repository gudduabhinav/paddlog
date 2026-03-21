"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, FileText, Plane, Box, ShieldCheck, Warehouse,
  ArrowRight, Check, User, Mail, Phone, Building2, Weight, Search, Download,
  Ruler, Layers, Home, PhoneCall, ShieldCheck as Shield, Globe, Award
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import Script from "next/script";

const services = [
  {
    id: "un-certified", title: "UN Certified Packaging",
    desc: "UN-approved boxes, drums & IBC tanks",
    icon: Package, image: "/un-certified-packaging-dg.png"
  },
  {
    id: "dg-packing", title: "DG Packing & DGD",
    desc: "Expert dangerous goods documentation",
    icon: FileText, image: "/dg-hero-new.png"
  },
  {
    id: "freight", title: "Freight Forwarding",
    desc: "Global Air & Sea freight experts",
    icon: Plane, image: "/dg-air-new.png"
  },
  {
    id: "aeroparts", title: "Aeroparts & Special Packing",
    desc: "Precision packing for Aviation items",
    icon: Box, image: "/dg-sea-new.png"
  },
  {
    id: "customs", title: "Customs Brokerage",
    desc: "Strategic clearance for hazardous cargo",
    icon: ShieldCheck, image: "/dg-customs-new.png"
  },
  {
    id: "warehousing", title: "Warehousing & Storage",
    desc: "Secure storage & 24/7 security",
    icon: Warehouse, image: "/logistics_scene.png"
  },
];

const UN_HUB_DATA = [
  { name: "Lithium Ion Batteries", un: "UN 3480", class: "Class 9", desc: "Rechargeable batteries." },
  { name: "Paint (Flammable)", un: "UN 1263", class: "Class 3", desc: "Solvent-based paints." },
  { name: "Alcoholic Beverages", un: "UN 3065", class: "Class 3", desc: "Concentrated spirits." },
  { name: "Perfumes", un: "UN 1266", class: "Class 3", desc: "Alcohol-based aromatic products." },
  { name: "Aerosols", un: "UN 1950", class: "Class 2.1", desc: "Spray cans under pressure." }
];

export default function BookServicePage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showUNHub, setShowUNHub] = useState(false);
  const [formData, setFormData] = useState<any>({
    serviceId: "", name: "", company: "", email: "", phone: "",
    commodity: "", msds: "Available", weight: "", dimensions: "",
    quantity: "", collection_address: "", is_packed: "Yes"
  });

  const [unSearch, setUnSearch] = useState("");
  const filteredUN = UN_HUB_DATA.filter(item =>
    item.name.toLowerCase().includes(unSearch.toLowerCase()) ||
    item.un.toLowerCase().includes(unSearch.toLowerCase())
  );

  const updateForm = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    ["name", "company", "email", "phone", "commodity", "weight", "dimensions", "quantity", "collection_address"].forEach(f => {
      if (!formData[f]?.trim()) errs[f] = "Required";
    });
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Invalid";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !formData.serviceId) return;
    if (step === 2 && !validate()) return;
    setStep(s => s + 1);
  };

  const selectedService = services.find(s => s.id === formData.serviceId);

  return (
    <main className="min-h-screen bg-[#f8fafc] font-body relative">
      <Navbar />
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div className="pt-32 pb-12 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">Expert <span className="text-primary italic">DG Booking</span> Portal</h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-4">Safe. Compliant. Certified.</p>
        </div>
      </div>

      <section className="py-12 border-t border-slate-100">
        <div className="container mx-auto px-6 max-w-[1280px] grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Booking Panel */}
          <div className="lg:col-span-8">
            <Stepper currentStep={step} />

            <div className="mt-8 bg-white border border-slate-200 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] rounded-[3rem] p-8 md:p-14 min-h-[650px] flex flex-col justify-between">
              <AnimatePresence mode="wait">
                {step === 1 && <Step1Service key="1" selectedId={formData.serviceId} onSelect={(id: string) => updateForm("serviceId", id)} />}
                {step === 2 && <Step2Details key="2" formData={formData} updateForm={updateForm} errors={errors} />}
                {step === 3 && <Step3Review key="3" formData={formData} service={selectedService} />}
                {step === 4 && <Step4Done key="4" />}
              </AnimatePresence>

              {step < 4 && (
                <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
                  <button onClick={() => setStep(s => Math.max(1, s - 1))} className={cn("px-10 py-5 rounded-2xl border border-slate-200 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all", (step === 1) && "invisible")}>Back</button>
                  <button onClick={handleNext} disabled={loading} className="group/btn relative inline-flex items-center gap-3 red-gradient text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.15em] text-[10px] shadow-[0_15px_30px_-10px_rgba(239,68,68,0.5)] active:scale-95 transition-all">
                    {step === 3 ? "Submit Requirement" : "Next Step"}
                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar: Premium Trust & Tools */}
          <div className="lg:col-span-4 space-y-6">

            {/* 24/7 Helpline Card */}
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 translate-x-4 -translate-y-4">
                <PhoneCall size={120} />
              </div>
              <h4 className="text-lg font-black uppercase mb-2 relative z-10">Need Assistance?</h4>
              <p className="text-slate-400 text-xs font-bold mb-8 relative z-10 leading-relaxed">Our DG specialists are available 24/7 for urgent enquiries.</p>
              <a href="tel:+917093777026" className="flex items-center gap-4 bg-white/10 hover:bg-white/20 p-4 rounded-2xl transition-all group relative z-10">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white">
                  <PhoneCall size={20} />
                </div>
                <div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Speak to Experts</div>
                  <div className="text-sm font-black">+91 7093777026</div>
                </div>
              </a>
            </div>

            {/* Why Choose Us Badges */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 mb-2">Paddlog Assurance</h4>

              <div className="flex gap-4 items-start">
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600"><Shield size={20} /></div>
                <div><h5 className="text-sm font-black text-slate-900">Fully Insured</h5><p className="text-xs text-slate-400 font-bold">End-to-end cargo insurance.</p></div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><Award size={20} /></div>
                <div><h5 className="text-sm font-black text-slate-900">Certified Experts</h5><p className="text-xs text-slate-400 font-bold">IATA/IMDG/ADR specialists.</p></div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 bg-purple-50 rounded-xl text-purple-600"><Globe size={20} /></div>
                <div><h5 className="text-sm font-black text-slate-900">Global Reach</h5><p className="text-xs text-slate-400 font-bold">Network across 180+ countries.</p></div>
              </div>
            </div>

            {/* UN Hub Tool (Better UI) */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm relative">
              <button
                onClick={() => setShowUNHub(!showUNHub)}
                className="flex items-center justify-between w-full"
              >
                <div className="flex items-center gap-3">
                  <Search size={18} className="text-primary" />
                  <h4 className="text-sm font-black text-slate-900 uppercase">UN Hub Tool</h4>
                </div>
                <div className={cn("transition-transform", showUNHub ? "rotate-180" : "")}><ArrowRight size={14} className="rotate-90" /></div>
              </button>

              <AnimatePresence>
                {showUNHub && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-8">
                      <input
                        type="text" placeholder="Search UN No. or Commodity..."
                        className="w-full bg-[#f8fafc] border border-slate-100 rounded-xl py-4 px-6 text-sm mb-6 outline-none focus:border-slate-300 transition-colors placeholder:text-slate-300 font-bold"
                        value={unSearch} onChange={e => setUnSearch(e.target.value)}
                      />
                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {filteredUN.map((item: any) => (
                          <div key={item.un} className="p-4 bg-[#f8fafc] rounded-xl border border-slate-100">
                            <div className="text-[9px] font-black text-primary uppercase mb-1">{item.un}</div>
                            <div className="text-xs font-black text-slate-900">{item.name}</div>
                            <div className="text-[8px] text-slate-400 mt-1 font-bold">{item.class} • {item.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {!showUNHub && <p className="text-[10px] text-slate-400 mt-4 font-bold italic line-clamp-1">Quickly check hazardous material classifications...</p>}
            </div>

          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function Stepper({ currentStep }: { currentStep: number }) {
  const steps = ["Source Service", "Cargo Details", "Review & Finalize", "Transmission"];
  return (
    <div className="flex justify-between items-center max-w-[800px] mx-auto mb-4 relative px-4">
      <div className="absolute top-6 left-12 right-12 h-[3px] bg-slate-100 -z-0" />
      <div
        className="absolute top-6 left-12 h-[3px] bg-primary z-1 transition-all duration-700"
        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 66}%` }}
      />
      {steps.map((s, idx) => (
        <div key={idx} className="flex flex-col items-center relative z-10 w-1/4">
          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center font-black border-2 transition-all duration-500",
            currentStep >= idx + 1 ? "bg-white border-primary text-primary shadow-[0_0_20px_rgba(239,68,68,0.2)]" : "bg-slate-50 border-slate-100 text-slate-300")}>
            {currentStep > idx + 1 ? <Check size={18} strokeWidth={4} /> : idx + 1}
          </div>
          <span className={cn("text-[9px] font-black uppercase tracking-widest mt-4 text-center px-1", currentStep >= idx + 1 ? "text-slate-900" : "text-slate-400")}>{s}</span>
        </div>
      ))}
    </div>
  );
}

function Step1Service({ selectedId, onSelect }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((s) => (
        <div
          key={s.id} onClick={() => onSelect(s.id)}
          className={cn("group p-8 rounded-[2.5rem] border-2 transition-all duration-300 cursor-pointer relative",
            selectedId === s.id ? "border-primary bg-primary/[0.02] shadow-xl" : "border-slate-50 bg-[#fbfcfd] hover:bg-white hover:border-slate-100 hover:shadow-lg")}
        >
          <div className={cn("w-14 h-14 rounded-2xl mb-6 flex items-center justify-center transition-all",
            selectedId === s.id ? "bg-primary text-white" : "bg-white border border-slate-100 text-slate-400 group-hover:text-primary")}>
            <s.icon size={28} strokeWidth={2.5} />
          </div>
          <h3 className="text-sm font-black text-slate-900 mb-2 uppercase tracking-wide">{s.title}</h3>
          <p className="text-slate-400 text-[10px] font-bold leading-relaxed">{s.desc}</p>
          {selectedId === s.id && (
            <div className="absolute top-6 right-6 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center ring-4 ring-red-50">
              <Check size={10} strokeWidth={4} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Step2Details({ formData, updateForm, errors }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
      <PremiumInput icon={User} placeholder="Full Name" value={formData.name} onChange={(v: string) => updateForm("name", v)} error={errors.name} />
      <PremiumInput icon={Building2} placeholder="Company Name" value={formData.company} onChange={(v: string) => updateForm("company", v)} error={errors.company} />
      <PremiumInput icon={Mail} placeholder="E-Mail" value={formData.email} onChange={(v: string) => updateForm("email", v)} error={errors.email} />
      <PremiumInput icon={Phone} placeholder="Contact Number" value={formData.phone} onChange={(v: string) => updateForm("phone", v)} error={errors.phone} />
      <PremiumInput icon={Package} placeholder="Commodity" value={formData.commodity} onChange={(v: string) => updateForm("commodity", v)} error={errors.commodity} />

      <div className="space-y-3">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          MSDS Status
        </span>
        <select value={formData.msds} onChange={(e) => updateForm("msds", e.target.value)} className="w-full bg-[#f8fafc] border border-slate-100 rounded-2xl px-6 py-5 font-bold text-xs uppercase tracking-widest outline-none focus:border-primary transition-all cursor-pointer">
          <option>Available</option><option>Not Available</option><option>Technical Support Req.</option>
        </select>
      </div>

      <PremiumInput icon={Weight} placeholder="Weight" value={formData.weight} onChange={(v: string) => updateForm("weight", v)} error={errors.weight} />
      <PremiumInput icon={Ruler} placeholder="Dimensions" value={formData.dimensions} onChange={(v: string) => updateForm("dimensions", v)} error={errors.dimensions} />
      <PremiumInput icon={Layers} placeholder="Quantity" value={formData.quantity} onChange={(v: string) => updateForm("quantity", v)} error={errors.quantity} />
      <PremiumInput icon={Home} placeholder="Collection Address" value={formData.collection_address} onChange={(v: string) => updateForm("collection_address", v)} error={errors.collection_address} />
    </div>
  );
}

function Step3Review({ formData, service }: any) {
  return (
    <div className="space-y-8">
      <div className="p-10 rounded-[2.5rem] bg-slate-900 text-white flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5"><Package size={150} /></div>
        <div className="relative z-10 text-center md:text-left">
          <div className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-2">Selected Solution</div>
          <h3 className="text-3xl font-black">{service?.title}</h3>
        </div>
        <div className="relative z-10 text-center md:text-right">
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Estimated Response</div>
          <h3 className="text-2xl font-black text-emerald-400">Within 15 Mins</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Contact Person", val: formData.name },
          { label: "Organization", val: formData.company },
          { label: "Phone", val: formData.phone },
          { label: "Commodity", val: formData.commodity },
          { label: "Cargo Weight", val: formData.weight },
          { label: "Pickup Location", val: formData.collection_address },
        ].map((item, i) => (
          <div key={i} className="bg-[#f8fafc] border border-slate-100 p-6 rounded-2xl">
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block mb-2">{item.label}</span>
            <span className="text-slate-900 font-black text-xs block truncate uppercase">{item.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step4Done() {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center py-20"
    >
      <div className="w-24 h-24 bg-emerald-500 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-xl shadow-emerald-500/20">
        <Check size={48} strokeWidth={4} />
      </div>
      <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight uppercase italic">Requirement Sent!</h2>
      <p className="text-slate-500 max-w-md mx-auto font-bold mb-10">Your enquiry has been assigned to a senior DG specialist. We will contact you within the next 15 minutes.</p>
      <button onClick={() => window.location.href = '/'} className="red-gradient text-white px-12 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Return to Dashboard</button>
    </motion.div>
  );
}

function PremiumInput({ icon: Icon, placeholder, value, onChange, error }: any) {
  return (
    <div className="space-y-3">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        {placeholder}
      </span>
      <div className={cn(
        "flex items-center gap-5 bg-[#f8fafc] border border-slate-100 rounded-2xl px-6 py-5 transition-all outline-none",
        error ? "border-red-400 ring-4 ring-red-50" : "focus-within:border-primary focus-within:bg-white focus-within:shadow-xl focus-within:shadow-slate-200/50"
      )}>
        <Icon size={18} className={cn("transition-colors", error ? "text-red-400" : "text-slate-300 group-focus-within:text-primary")} />
        <input
          type="text" placeholder={placeholder} value={value}
          onChange={e => onChange(e.target.value)}
          className="bg-transparent flex-1 text-slate-900 font-bold outline-none text-xs uppercase tracking-widest placeholder:text-slate-200"
        />
      </div>
      {error && <p className="text-[10px] text-red-500 font-bold ml-1">{error} is mandatory</p>}
    </div>
  );
}
