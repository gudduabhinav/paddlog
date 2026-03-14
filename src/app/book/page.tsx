"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, FileText, Plane, Ship, ShieldCheck, Warehouse,
  ArrowRight, ArrowLeft, CheckCircle2, Truck, Check, AlertCircle,
  User, Mail, Phone, Building2, MapPin, Box, Weight, Search, Download
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import jsPDF from "jspdf";
import { sendWhatsAppNotification } from "@/lib/whatsapp";

const services = [
  { 
    id: "un-certified", 
    title: "UN Certified Packaging", 
    desc: "UN-approved boxes, drums & IBC tanks", 
    icon: Package, 
    gradient: "from-red-500 to-rose-600",
    docs: ["Product MSDS", "Quantities Required", "UN Rating Specs"],
    fields: ["boxType", "quantity", "unRating"]
  },
  { 
    id: "dg-packing", 
    title: "DG Packing & DGD", 
    desc: "Expert dangerous goods documentation", 
    icon: FileText, 
    gradient: "from-orange-500 to-red-500",
    docs: ["MSDS (Mandatory)", "Shippers Declaration", "Packaging List"],
    fields: ["cargoType", "unNumber", "packingGroup"]
  },
  { 
    id: "air-freight", 
    title: "Air Freight", 
    desc: "Fast & safe air cargo worldwide", 
    icon: Plane, 
    gradient: "from-blue-500 to-cyan-500",
    docs: ["IATA DGD", "Commercial Invoice", "MSDS", "Air Waybill"],
    fields: ["origin", "destination", "weight", "cargoType", "unNumber"]
  },
  { 
    id: "sea-freight", 
    title: "Sea Freight", 
    desc: "Cost-effective ocean logistics", 
    icon: Ship, 
    gradient: "from-indigo-500 to-blue-600",
    docs: ["IMDG Declaration", "Bill of Lading", "MSDS", "Container Load Plan"],
    fields: ["origin", "destination", "containerType", "unNumber"]
  },
  { 
    id: "customs", 
    title: "Customs Brokerage", 
    desc: "Hassle-free customs clearance", 
    icon: ShieldCheck, 
    gradient: "from-emerald-500 to-teal-500",
    docs: ["Import/Export License", "IEC Code", "KYC Documents"],
    fields: ["entryPoint", "commodityType", "isImport"]
  },
  { 
    id: "warehousing", 
    title: "Warehousing", 
    desc: "Secure, monitored storage solutions", 
    icon: Warehouse, 
    gradient: "from-purple-500 to-indigo-600",
    docs: ["Stock List", "Storage Duration", "MSDS (for DG)"],
    fields: ["duration", "storageType", "isDG"]
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
  const [lastBookingId, setLastBookingId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<any>({
    serviceId: "", name: "", company: "", email: "",
    phone: "", pickup: "", delivery: "", cargo: "",
    quantity: "", weight: "", notes: "",
    boxType: "", unRating: "", unNumber: "", packingGroup: "",
    origin: "", destination: "", containerType: "", entryPoint: "",
    commodityType: "", isImport: "true", duration: "", storageType: "", isDG: "true"
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

  const generateTrackingId = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = 'PL-';
    for (let i = 0; i < 5; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Required";
    if (!formData.email.trim()) errs.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Invalid";
    if (!formData.phone.trim()) errs.phone = "Required";
    
    const currentService = services.find(s => s.id === formData.serviceId);
    if (currentService) {
      if (currentService.fields.includes("origin") && !formData.origin) errs.origin = "Required";
      if (currentService.fields.includes("destination") && !formData.destination) errs.destination = "Required";
      if (currentService.fields.includes("unNumber") && !formData.unNumber) errs.unNumber = "Required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const generatePDF = (trackingId: string) => {
    const doc = new jsPDF();
    const primaryColor = [225, 29, 72]; // #e11d48
    const darkColor = [10, 15, 30];

    // Header Color Bar
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 40, 'F');

    // Logo Text (since image might need CORS, let's use text fallback for now or dataURI)
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(30);
    doc.setFont("helvetica", "bold");
    doc.text("PADDLOG", 20, 25);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("DANGEROUS GOODS LOGISTICS SPECIALIST", 20, 32);

    // Booking ID / Tracking ID section
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFontSize(12);
    doc.text("BOOKING CONFIRMATION & TRACKING ID", 20, 55);
    
    doc.setFontSize(24);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(trackingId, 20, 70);

    // Customer Details
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(10);
    doc.text("CUSTOMER DETAILS", 20, 90);
    doc.setDrawColor(226, 232, 240);
    doc.line(20, 92, 190, 92);

    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFontSize(11);
    doc.text(`Name: ${formData.name}`, 20, 102);
    doc.text(`Email: ${formData.email}`, 20, 110);
    doc.text(`Phone: ${formData.phone}`, 20, 118);
    if(formData.company) doc.text(`Company: ${formData.company}`, 20, 126);

    // Service Details
    const serviceTitle = services.find(s => s.id === formData.serviceId)?.title || "General Logistics";
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(10);
    doc.text("SERVICE DETAILS", 20, 145);
    doc.line(20, 147, 190, 147);

    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text(`Service Type: ${serviceTitle}`, 20, 157);
    if(formData.origin) doc.text(`Origin: ${formData.origin}`, 20, 165);
    if(formData.destination) doc.text(`Destination: ${formData.destination}`, 20, 173);
    if(formData.unNumber) doc.text(`UN Number: ${formData.unNumber}`, 20, 181);
    if(formData.quantity) doc.text(`Quantity: ${formData.quantity}`, 20, 189);

    // Footer Info
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 260, 210, 37, 'F');
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(9);
    doc.text("Visit www.paddlog.com/track and enter your Tracking ID for real-time updates.", 105, 275, { align: "center" });
    doc.text("This is an electronically generated document. No signature required.", 105, 282, { align: "center" });

    doc.save(`Paddlog_Booking_${trackingId}.pdf`);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    const trackingId = generateTrackingId();

    try {
      // 1. Create the booking record
      const { error: bookingErr } = await supabase.from('bookings').insert([{
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        service_type: formData.serviceId,
        service_details: formData,
        status: 'pending'
      }]);

      if (bookingErr) throw bookingErr;

      // 2. Create the shipment record for tracking
      const { error: shipmentErr } = await supabase.from('shipments').insert([{
        id: trackingId,
        status: "Booking Confirmed",
        current_location: formData.origin || "Pickup Point",
        origin: formData.origin || "Not Specified",
        destination: formData.destination || "Not Specified",
        last_update: "Just Now",
        steps: [
          { status: "Booking Confirmed", date: "Today", completed: true, active: true },
          { status: "Package Pickup", date: "Scheduled", completed: false },
          { status: "DG Classification", date: "Pending", completed: false },
          { status: "In Transit", date: "Pending", completed: false }
        ]
      }]);

      if (shipmentErr) throw shipmentErr;

      // 3. Send WhatsApp Notification to Client (Sub-block to prevent main flow failure)
      try {
        console.log("Attempting WhatsApp notification...");
        const waResult = await sendWhatsAppNotification(formData.phone, formData.name, "booking_confirmation");
        console.log("WhatsApp Result:", waResult);
      } catch (waErr) {
        console.error("WhatsApp Step Error:", waErr);
      }

      setLastBookingId(trackingId);
      setStep(4);
      
      // Auto-download PDF
      generatePDF(trackingId);

    } catch (err: any) {
      console.error("Booking Error Detail:", err);
      if (err.message) console.error("Error Message:", err.message);
      if (err.details) console.error("Error Details:", err.details);
      if (err.hint) console.error("Error Hint:", err.hint);
      alert("Failed to confirm booking. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 1 && !formData.serviceId) return;
    if (step === 2 && !validate()) return;
    if (step === 3) {
      handleSubmit();
      return;
    }
    setStep(s => s + 1);
  };

  const selectedService = services.find(s => s.id === formData.serviceId);

  return (
    <main className="min-h-screen bg-[#0a0f1e] font-body flex flex-col">
      <Navbar />

      <div className="relative pt-28 pb-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1e] via-[#12172b] to-[#0a0f1e]" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-black text-white mb-4">
            Smart <span className="text-primary italic">Booking</span>
          </motion.h1>
          <p className="text-slate-400 max-w-xl mx-auto">Our system identifies the requirements for your specific DG service automatically.</p>
        </div>
      </div>

      <section className="flex-grow pb-24 relative">
        <div className="container mx-auto px-6 max-w-6xl flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <Stepper currentStep={step} />
            <div className="mt-10 bg-white/5 backdrop-blur-sm rounded-[2.5rem] border border-white/10 p-8 md:p-12 relative min-h-[500px]">
              <AnimatePresence mode="wait">
                {step === 1 && <Step1Service key="1" selectedId={formData.serviceId} onSelect={(id: string) => updateForm("serviceId", id)} />}
                {step === 2 && <Step2Dynamic key="2" formData={formData} updateForm={updateForm} errors={errors} service={selectedService} />}
                {step === 3 && <Step3Review key="3" formData={formData} service={selectedService} />}
                {step === 4 && <Step4Done key="4" trackingId={lastBookingId} downloadPdf={() => generatePDF(lastBookingId)} />}
              </AnimatePresence>

              {step < 4 && (
                <div className="mt-10 pt-8 border-t border-white/10 flex items-center justify-between">
                  <button onClick={() => setStep(s => Math.max(1, s - 1))} className={cn("px-6 py-3 rounded-xl border border-white/20 text-white/70", step === 1 && "invisible")}>Back</button>
                  <button onClick={handleNext} disabled={loading} className="red-gradient text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2">
                    {loading ? "Processing..." : step === 3 ? "Confirm Booking" : "Next Step"}
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <AsidePanel service={selectedService} unSearch={unSearch} setUnSearch={setUnSearch} filteredUN={filteredUN} />
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Stepper({ currentStep }: { currentStep: number }) {
  const steps = ["Service", "Details", "Review", "Done"];
  return (
    <div className="flex justify-between items-center max-w-md mx-auto mb-10">
      {steps.map((s, idx) => (
        <div key={s} className="flex flex-col items-center">
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 mb-2 transition-colors", currentStep >= idx + 1 ? "bg-primary border-primary text-white" : "border-white/10 text-white/30")}>
            {currentStep > idx + 1 ? <Check size={18} /> : idx + 1}
          </div>
          <span className={cn("text-[10px] font-bold uppercase tracking-widest", currentStep >= idx + 1 ? "text-white" : "text-white/20")}>{s}</span>
        </div>
      ))}
    </div>
  );
}

function Step1Service({ selectedId, onSelect }: any) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {services.map((s) => (
        <div key={s.id} onClick={() => onSelect(s.id)} className={cn("p-6 rounded-2xl border-2 cursor-pointer transition-all", selectedId === s.id ? "border-primary bg-primary/10" : "border-white/5 bg-white/5 hover:bg-white/10")}>
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-gradient-to-br", s.gradient)}><s.icon size={20} className="text-white" /></div>
          <h3 className="text-white font-bold">{s.title}</h3>
          <p className="text-slate-400 text-xs mt-1">{s.desc}</p>
        </div>
      ))}
    </motion.div>
  );
}

function Step2Dynamic({ formData, updateForm, errors, service }: any) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DarkInput icon={User} placeholder="Full Name" value={formData.name} onChange={(v: string) => updateForm("name", v)} error={errors.name} />
        <DarkInput icon={Mail} placeholder="Email" value={formData.email} onChange={(v: string) => updateForm("email", v)} error={errors.email} />
        <DarkInput icon={Phone} placeholder="Phone" value={formData.phone} onChange={(v: string) => updateForm("phone", v)} error={errors.phone} />
        <DarkInput icon={Building2} placeholder="Company (Optional)" value={formData.company} onChange={(v: string) => updateForm("company", v)} />
      </div>

      <div className="h-px bg-white/10 my-4" />

      <h4 className="text-primary font-bold flex items-center gap-2 mb-4 uppercase text-xs tracking-widest">
        <Box size={14} /> Specific Requirements for {service?.title}
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {service?.fields.includes("origin") && <DarkInput icon={MapPin} placeholder="Origin Port/City" value={formData.origin} onChange={(v: string) => updateForm("origin", v)} error={errors.origin} />}
        {service?.fields.includes("destination") && <DarkInput icon={MapPin} placeholder="Destination Port/City" value={formData.destination} onChange={(v: string) => updateForm("destination", v)} error={errors.destination} />}
        {service?.fields.includes("unNumber") && <DarkInput icon={AlertCircle} placeholder="UN Number (e.g. UN 1263)" value={formData.unNumber} onChange={(v: string) => updateForm("unNumber", v)} error={errors.unNumber} />}
        {service?.fields.includes("quantity") && <DarkInput icon={Package} placeholder="Quantity" value={formData.quantity} onChange={(v: string) => updateForm("quantity", v)} />}
        {service?.fields.includes("weight") && <DarkInput icon={Weight} placeholder="Est. Weight (kg)" value={formData.weight} onChange={(v: string) => updateForm("weight", v)} />}
        
        {service?.fields.includes("boxType") && <DarkInput icon={Box} placeholder="Box/Packaging Type" value={formData.boxType} onChange={(v: string) => updateForm("boxType", v)} />}
        {service?.fields.includes("unRating") && <DarkInput icon={ShieldCheck} placeholder="UN Rating" value={formData.unRating} onChange={(v: string) => updateForm("unRating", v)} />}
        {service?.fields.includes("cargoType") && <DarkInput icon={Package} placeholder="Cargo Type" value={formData.cargoType} onChange={(v: string) => updateForm("cargoType", v)} />}
        {service?.fields.includes("packingGroup") && <DarkInput icon={ShieldCheck} placeholder="Packing Group (I/II/III)" value={formData.packingGroup} onChange={(v: string) => updateForm("packingGroup", v)} />}
        {service?.fields.includes("containerType") && <DarkInput icon={Ship} placeholder="Container Type" value={formData.containerType} onChange={(v: string) => updateForm("containerType", v)} />}
        {service?.fields.includes("entryPoint") && <DarkInput icon={MapPin} placeholder="Port of Entry/Exit" value={formData.entryPoint} onChange={(v: string) => updateForm("entryPoint", v)} />}
        {service?.fields.includes("commodityType") && <DarkInput icon={Box} placeholder="Commodity Type" value={formData.commodityType} onChange={(v: string) => updateForm("commodityType", v)} />}
        {service?.fields.includes("isImport") && <DarkInput icon={Plane} placeholder="Import or Export?" value={formData.isImport} onChange={(v: string) => updateForm("isImport", v)} />}
        {service?.fields.includes("duration") && <DarkInput icon={Warehouse} placeholder="Storage Duration" value={formData.duration} onChange={(v: string) => updateForm("duration", v)} />}
        {service?.fields.includes("storageType") && <DarkInput icon={Warehouse} placeholder="Storage Type" value={formData.storageType} onChange={(v: string) => updateForm("storageType", v)} />}
        {service?.fields.includes("isDG") && <DarkInput icon={AlertCircle} placeholder="Is Dangerous Goods? (Yes/No)" value={formData.isDG} onChange={(v: string) => updateForm("isDG", v)} />}
      </div>
    </motion.div>
  );
}

function Step3Review({ formData, service }: any) {
  const getFieldLabel = (field: string) => {
    const labels: Record<string, string> = {
      boxType: "Box Type", quantity: "Quantity", unRating: "UN Rating", cargoType: "Cargo Type",
      unNumber: "UN Number", packingGroup: "Packing Group", origin: "Origin", destination: "Destination",
      weight: "Weight", containerType: "Container Type", entryPoint: "Entry Point", commodityType: "Commodity Type",
      isImport: "Import/Export", duration: "Duration", storageType: "Storage Type", isDG: "Is DG"
    };
    return labels[field] || field;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className={cn("p-6 rounded-2xl bg-gradient-to-r text-white", service?.gradient)}>
        <h3 className="text-2xl font-black">{service?.title}</h3>
        <p className="opacity-80">Booking Summary</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ReviewItem label="NAME" value={formData.name} />
        <ReviewItem label="EMAIL" value={formData.email} />
        <ReviewItem label="SERVICE" value={service?.title} />
        {service?.fields.map((field: string) => (
           <ReviewItem key={field} label={getFieldLabel(field)} value={formData[field] || "—"} />
        ))}
      </div>

    </motion.div>
  );
}

function Step4Done({ trackingId, downloadPdf }: any) {
  return (
    <div className="text-center py-10">
      <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 size={40} /></div>
      <h2 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h2>
      <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-2xl inline-block">
        <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-1">Your Tracking ID</p>
        <p className="text-3xl font-black text-primary">{trackingId}</p>
      </div>
      <p className="text-slate-400 mt-6 max-w-sm mx-auto">Please download your booking summary. You can use this ID to track your shipment in real-time.</p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
        <button onClick={downloadPdf} className="bg-white text-black px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform w-full sm:w-auto justify-center">
            <Download size={18} /> Download PDF Quote
        </button>
        <button onClick={() => window.location.href = '/track'} className="border border-white/20 text-white px-8 py-3 rounded-xl hover:bg-white/10 w-full sm:w-auto">
            Track Now
        </button>
      </div>
    </div>
  );
}

function AsidePanel({ service, unSearch, setUnSearch, filteredUN }: any) {
  return (
    <aside className="lg:w-80 space-y-6">
      {service && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-md">
          <h4 className="text-white font-bold mb-4 flex items-center gap-2"><FileText size={18} className="text-primary" /> Required Documents</h4>
          <ul className="space-y-3">
            {service.docs.map((d: string) => (
              <li key={d} className="flex items-center gap-2 text-slate-400 text-sm"><CheckCircle2 size={14} className="text-emerald-500" /> {d}</li>
            ))}
          </ul>
        </motion.div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-md">
        <h4 className="text-white font-bold mb-4 flex items-center gap-2"><Search size={18} className="text-primary" /> UN Lookup Hub</h4>
        <div className="relative mb-4">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search DG (e.g. Paint)" 
            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs text-white outline-none focus:border-primary"
            value={unSearch}
            onChange={e => setUnSearch(e.target.value)}
          />
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {filteredUN.map((item: any) => (
            <div key={item.un} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/20 transition-all cursor-help group">
              <div className="flex justify-between items-center mb-1">
                <span className="text-white font-bold text-[10px]">{item.un}</span>
                <span className="text-primary font-bold text-[10px]">{item.class}</span>
              </div>
              <p className="text-slate-500 text-[10px] truncate">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

function DarkInput({ icon: Icon, placeholder, value, onChange, error }: any) {
  return (
    <div>
      <div className={cn("flex items-center gap-3 bg-white/5 border rounded-xl px-4 py-3 transition-all", error ? "border-red-500/50" : "border-white/10 focus-within:border-primary/50")}>
        <Icon size={16} className="text-slate-500" />
        <input type="text" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} className="bg-transparent flex-1 text-white placeholder-slate-500 outline-none text-sm" />
      </div>
      {error && <p className="text-red-500 text-[10px] mt-1 ml-2">{error}</p>}
    </div>
  );
}

function ReviewItem({ label, value }: any) {
  return (
    <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">{label}</span>
      <span className="text-white font-bold text-sm block truncate">{value}</span>
    </div>
  );
}
