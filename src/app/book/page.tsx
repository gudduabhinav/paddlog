"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, FileText, Plane, Ship, ShieldCheck, Warehouse,
  ArrowRight, CheckCircle2, Check, AlertCircle,
  User, Mail, Phone, Building2, MapPin, Box, Weight, Search, Download,
  CreditCard, RefreshCcw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { createPaymentOrder } from "./payment-actions";
import Script from "next/script";

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<any>({
    serviceId: "", name: "", company: "", email: "",
    phone: "", pickup: "", delivery: "", cargo: "",
    quantity: "", weight: "", notes: "",
    boxType: "", unRating: "", unNumber: "", packingGroup: "",
    origin: "", destination: "", containerType: "", entryPoint: "",
    commodityType: "", isImport: "true", duration: "", storageType: "", isDG: "true",
    cargoType: ""
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

  const generatePDF = () => {
    const serviceTitle = services.find(s => s.id === formData.serviceId)?.title || "General Logistics";
    const logoUrl = window.location.origin + '/logo.png';
    const bookingRef = `PL-${Date.now().toString().slice(-8)}`;
    const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

    const fieldLabels: Record<string, string> = {
      boxType: 'Packaging Type', quantity: 'Quantity', unRating: 'UN Rating',
      cargoType: 'Cargo Type', unNumber: 'UN Number', packingGroup: 'Packing Group',
      origin: 'Origin Port/City', destination: 'Destination Port/City', weight: 'Est. Weight',
      containerType: 'Container Type', entryPoint: 'Entry/Exit Port', commodityType: 'Commodity Type',
      isImport: 'Type', duration: 'Storage Duration', storageType: 'Storage Type', isDG: 'Dangerous Goods'
    };

    const selectedService = services.find(s => s.id === formData.serviceId);
    const serviceRows = (selectedService?.fields || []).filter(f => formData[f]).map(f => ({
      label: fieldLabels[f] || f, value: formData[f]
    }));

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Paddlog Booking Confirmation – ${bookingRef}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: 'Segoe UI', sans-serif; background: #e2e8f0; color: #1e293b; }
    @media print { 
      body { background: #fff; } 
      .no-print { display:none; }
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    }
  </style>
</head>
<body style="padding: 24px;">
<div style="max-width:740px;margin:0 auto;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25)">

  <!-- HEADER -->
  <div style="background:linear-gradient(135deg, #1e1b4b 0%, #701a75 50%, #831843 100%);padding:48px;position:relative;overflow:hidden">
    <div style="position:absolute;top:-40px;right:-40px;width:250px;height:250px;background:linear-gradient(135deg, rgba(244,63,94,0.4), rgba(225,29,72,0));border-radius:50%"></div>
    <div style="position:absolute;bottom:-60px;left:5%;width:180px;height:180px;background:linear-gradient(to top right, rgba(99,102,241,0.3), rgba(79,70,229,0));border-radius:50%"></div>
    
    <div style="display:flex;justify-content:space-between;align-items:flex-start;position:relative;z-index:1">
      <img src="${logoUrl}" style="height:64px;width:auto;object-fit:contain;filter:drop-shadow(0 4px 6px rgba(0,0,0,0.3)) brightness(1.2)" />
      <div style="text-align:right">
        <div style="color:rgba(255,255,255,0.6);font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.25em">Reference No.</div>
        <div style="color:#fff;font-size:20px;font-weight:900;font-family:monospace;margin-top:4px;text-shadow: 0 2px 4px rgba(0,0,0,0.5)">${bookingRef}</div>
        <div style="color:rgba(255,255,255,0.5);font-size:10px;font-weight:600;margin-top:6px">${dateStr}</div>
      </div>
    </div>
    
    <div style="margin-top:36px;padding-bottom:32px;border-bottom:1px solid rgba(255,255,255,0.15)">
      <div style="display:inline-block;background:linear-gradient(to right, #f43f5e, #e11d48);color:#fff;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.2em;padding:6px 16px;border-radius:999px;box-shadow: 0 4px 12px rgba(225,29,72,0.4)">Booking Confirmation</div>
      <h1 style="color:#fff;font-size:32px;font-weight:900;margin-top:16px;letter-spacing:-0.02em;text-shadow: 0 2px 8px rgba(0,0,0,0.3)">Your Shipment is <span style="background:linear-gradient(to right, #fb7185, #f43f5e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Confirmed.</span></h1>
      <p style="color:rgba(255,255,255,0.7);font-size:13px;margin-top:8px;font-weight:500">Payment verified · Our team will contact you within 24 hours</p>
    </div>
    
    <!-- Service Banner -->
    <div style="display:flex;align-items:center;gap:16px;padding-top:24px;position:relative;z-index:1">
      <div style="width:48px;height:48px;background:linear-gradient(135deg, #f43f5e, #be123c);border-radius:14px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 16px rgba(190,18,60,0.4)">
        <svg width="24" height="24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
      </div>
      <div>
        <div style="color:rgba(255,255,255,0.6);font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.2em">Selected Service</div>
        <div style="color:#fff;font-size:18px;font-weight:800;margin-top:2px">${serviceTitle}</div>
      </div>
      <div style="margin-left:auto;background:linear-gradient(to right, #10b981, #059669);color:#fff;font-size:11px;font-weight:800;padding:6px 16px;border-radius:999px;text-transform:uppercase;letter-spacing:0.15em;box-shadow:0 4px 12px rgba(16,185,129,0.3)">✓ Paid</div>
    </div>
  </div>

  <!-- BODY -->
  <div style="padding:40px 48px">

    <!-- Client Info -->
    <div style="margin-bottom:32px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px">
        <div style="width:6px;height:24px;background:linear-gradient(to bottom, #f43f5e, #e11d48);border-radius:3px"></div>
        <span style="font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:0.25em;color:#0f172a">Client Information</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div style="background:linear-gradient(135deg, #fff1f2, #ffe4e6);border:1px solid #fecdd3;border-radius:16px;padding:20px;box-shadow:0 4px 6px rgba(225,29,72,0.05)">
          <div style="font-size:9px;color:#e11d48;font-weight:800;text-transform:uppercase;letter-spacing:0.15em;margin-bottom:6px">Full Name</div>
          <div style="font-size:16px;font-weight:900;color:#881337">${formData.name}</div>
        </div>
        <div style="background:linear-gradient(135deg, #eff6ff, #dbeafe);border:1px solid #bfdbfe;border-radius:16px;padding:20px;box-shadow:0 4px 6px rgba(59,130,246,0.05)">
          <div style="font-size:9px;color:#2563eb;font-weight:800;text-transform:uppercase;letter-spacing:0.15em;margin-bottom:6px">Phone Number</div>
          <div style="font-size:16px;font-weight:900;color:#1e3a8a">${formData.phone}</div>
        </div>
        <div style="background:linear-gradient(135deg, #f5f3ff, #ede9fe);border:1px solid #ddd6fe;border-radius:16px;padding:20px;box-shadow:0 4px 6px rgba(139,92,246,0.05)">
          <div style="font-size:9px;color:#7c3aed;font-weight:800;text-transform:uppercase;letter-spacing:0.15em;margin-bottom:6px">Email Address</div>
          <div style="font-size:14px;font-weight:800;color:#4c1d95;word-break:break-all">${formData.email}</div>
        </div>
        ${formData.company ? `<div style="background:linear-gradient(135deg, #f0fdf4, #dcfce7);border:1px solid #bbf7d0;border-radius:16px;padding:20px;box-shadow:0 4px 6px rgba(34,197,94,0.05)"><div style="font-size:9px;color:#16a34a;font-weight:800;text-transform:uppercase;letter-spacing:0.15em;margin-bottom:6px">Company</div><div style="font-size:15px;font-weight:900;color:#14532d">${formData.company}</div></div>` : ''}
      </div>
    </div>

    <!-- Service Details Table -->
    ${serviceRows.length > 0 ? `
    <div style="margin-bottom:32px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px">
        <div style="width:6px;height:24px;background:linear-gradient(to bottom, #8b5cf6, #6d28d9);border-radius:3px"></div>
        <span style="font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:0.25em;color:#0f172a">Shipment Details</span>
      </div>
      <div style="border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.05)">
        <table style="width:100%;border-collapse:collapse">
          ${serviceRows.map((row, i) => `
          <tr style="background:${i % 2 === 0 ? '#ffffff' : '#f8fafc'}">
            <td style="padding:16px 20px;font-size:10px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.15em;border-bottom:1px solid #f1f5f9;width:45%">${row.label}</td>
            <td style="padding:16px 20px;font-size:14px;font-weight:800;color:#0f172a;border-bottom:1px solid #f1f5f9;text-align:right">${row.value}</td>
          </tr>`).join('')}
        </table>
      </div>
    </div>` : ''}

    <!-- Payment Info -->
    <div style="background:linear-gradient(135deg, #ecfdf5, #d1fae5);border:1px solid #a7f3d0;border-radius:20px;padding:24px;display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;box-shadow:0 10px 25px rgba(16,185,129,0.1)">
      <div>
        <div style="font-size:10px;font-weight:800;color:#059669;text-transform:uppercase;letter-spacing:0.2em;margin-bottom:6px">Token Amount Paid</div>
        <div style="font-size:36px;font-weight:900;color:#064e3b;letter-spacing:-0.02em">₹1,000</div>
        <div style="font-size:11px;font-weight:600;color:#10b981;margin-top:4px">Via Razorpay Secure · GST Included</div>
      </div>
      <div style="width:64px;height:64px;background:linear-gradient(135deg, #10b981, #047857);border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 16px rgba(4,120,87,0.3)">
        <svg width="32" height="32" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
      </div>
    </div>

    <!-- Next Steps -->
    <div style="background:linear-gradient(135deg, #fffbeb, #fef3c7);border:1px solid #fde68a;border-radius:20px;padding:24px;box-shadow:0 4px 12px rgba(245,158,11,0.05)">
      <div style="font-size:11px;font-weight:800;color:#b45309;text-transform:uppercase;letter-spacing:0.2em;margin-bottom:16px;display:flex;align-items:center;gap:6px">
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        What Happens Next
      </div>
      <div style="display:flex;flex-direction:column;gap:12px">
        <div style="display:flex;gap:12px;align-items:center"><div style="min-width:28px;height:28px;background:linear-gradient(135deg,#f59e0b,#d97706);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;color:#fff;box-shadow:0 4px 8px rgba(217,119,6,0.3)">1</div><div style="font-size:14px;font-weight:600;color:#78350f">Our expert team will review your requirements.</div></div>
        <div style="display:flex;gap:12px;align-items:center"><div style="min-width:28px;height:28px;background:linear-gradient(135deg,#f59e0b,#d97706);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;color:#fff;box-shadow:0 4px 8px rgba(217,119,6,0.3)">2</div><div style="font-size:14px;font-weight:600;color:#78350f">You will receive a call within 24 hours to finalize details.</div></div>
        <div style="display:flex;gap:12px;align-items:center"><div style="min-width:28px;height:28px;background:linear-gradient(135deg,#f59e0b,#d97706);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;color:#fff;box-shadow:0 4px 8px rgba(217,119,6,0.3)">3</div><div style="font-size:14px;font-weight:600;color:#78350f">Full invoice and tracking information will be provided.</div></div>
      </div>
    </div>
  </div>

  <!-- FOOTER -->
  <div style="background:#020617;padding:24px 48px;display:flex;align-items:center;justify-content:space-between">
    <div style="display:flex;align-items:center;gap:12px">
        <img src="${logoUrl}" style="height:32px;width:auto;object-fit:contain;filter:brightness(0.8) grayscale(1)" />
        <span style="color:rgba(255,255,255,0.3);font-size:10px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase">Certified Logistics</span>
    </div>
    <div style="text-align:right">
      <div style="color:rgba(255,255,255,0.7);font-size:11px;font-weight:600">www.paddlog.com</div>
      <div style="color:rgba(255,255,255,0.3);font-size:9px;margin-top:4px;font-weight:500">Document generated automatically on ${dateStr}</div>
    </div>
  </div>
</div>
<script>window.onload = function() { setTimeout(() => window.print(), 500); }<\/script>
</body></html>`;

    const win = window.open('', '_blank');
    if (win) { win.document.write(html); win.document.close(); }
  };

  const handlePayment = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      // For dummy, let's assume a fix amount of ₹1000
      const amount = 1000;
      const res = await createPaymentOrder(amount);

      if (!res.success) {
        throw new Error(res.message);
      }

      const options = {
        key: res.key,
        amount: res.amount,
        currency: "INR",
        name: "PADDLOG DG SOLUTIONS",
        description: "Service Booking Payment",
        order_id: res.orderId,
        handler: async function (response: any) {
          await completeBooking(response.razorpay_payment_id);
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#e11d48",
        },
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.on('payment.failed', function (response: any) {
        alert("Payment Failed: " + response.error.description);
        setLoading(false);
      });
      rzp1.open();
    } catch (err: any) {
      alert("Payment initialization failed: " + err.message);
      setLoading(false);
    }
  };

  const completeBooking = async (paymentId: string) => {
    try {
      const { error: bookingErr } = await supabase.from('bookings').insert([{
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        service_type: formData.serviceId,
        service_details: { ...formData, payment_id: paymentId },
        status: 'verified' // Mark verified after payment
      }]);

      if (bookingErr) throw bookingErr;

      setStep(5); // Show final success step
      generatePDF();
    } catch (err) {
      alert("Failed to save booking. Please contact support with Payment ID: " + paymentId);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (step === 3) {
      setStep(4); // Move to payment step
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
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div className="relative pt-28 pb-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1e] via-[#12172b] to-[#0a0f1e]" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-bold text-white mb-4">
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
                {step === 4 && <StepPayment key="4" onPay={handlePayment} amount={1000} loading={loading} />}
                {step === 5 && <Step4Done key="5" downloadPdf={generatePDF} />}
              </AnimatePresence>

              {step < 5 && (
                <div className="mt-10 pt-8 border-t border-white/10 flex items-center justify-between">
                  <button onClick={() => setStep(s => Math.max(1, s - 1))} className={cn("px-6 py-3 rounded-xl border border-white/20 text-white/70", (step === 1 || step === 5) && "invisible")}>Back</button>
                  <button onClick={handleNext} disabled={loading} className="red-gradient text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2">
                    {loading ? "Processing..." : step === 3 ? "Next: Payment" : step === 4 ? "Pay Now" : "Next Step"}
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
  const steps = ["Service", "Details", "Review", "Payment", "Done"];
  return (
    <div className="flex justify-between items-center max-w-lg mx-auto mb-10">
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
        <h3 className="text-2xl font-bold">{service?.title}</h3>
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

function StepPayment({ onPay, amount, loading }: any) {
  const paymentMethods = [
    { name: "UPI", icon: "🔵", desc: "GPay, PhonePe, Paytm" },
    { name: "Cards", icon: "💳", desc: "Visa, Mastercard, RuPay" },
    { name: "NetBanking", icon: "🏦", desc: "All major banks" },
    { name: "Wallets", icon: "👛", desc: "Mobikwik, Freecharge" },
  ];
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="relative inline-flex">
          <div className="absolute inset-0 bg-rose-500/30 blur-2xl rounded-full scale-150" />
          <div className="relative w-20 h-20 bg-gradient-to-br from-rose-500 to-red-700 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-rose-900/50">
            <CreditCard size={36} className="text-white" />
          </div>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white mt-5 tracking-tight">Complete Payment</h2>
        <p className="text-slate-400 mt-2 text-sm">Secure token payment to confirm your booking</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Summary */}
        <div className="space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Order Summary</p>
          <div className="bg-gradient-to-br from-white/8 to-white/3 border border-white/10 rounded-2xl p-5 space-y-4 backdrop-blur-md">
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shrink-0">
                <Package size={18} className="text-white" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">Shipping & Logistics Service</div>
                <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Booking Token</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Token Amount</span>
                <span className="text-white font-bold">₹{amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Processing Fee</span>
                <span className="text-emerald-400 font-bold text-sm">FREE</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">GST</span>
                <span className="text-slate-400 text-sm">Included</span>
              </div>
            </div>
            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
              <span className="text-white font-black text-sm uppercase tracking-wider">Total Payable</span>
              <div className="text-right">
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-500">₹{amount.toLocaleString('en-IN')}</div>
                <div className="text-[10px] text-slate-500 font-bold">ONE TIME TOKEN</div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment & CTA */}
        <div className="space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Payment Methods</p>
          <div className="grid grid-cols-2 gap-2">
            {paymentMethods.map((m) => (
              <div key={m.name} className="bg-white/5 border border-white/10 rounded-xl p-3 hover:border-white/20 transition-all cursor-default">
                <div className="text-xl mb-1">{m.icon}</div>
                <div className="text-white font-bold text-xs">{m.name}</div>
                <div className="text-slate-500 text-[9px] font-bold">{m.desc}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="relative mt-2">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-red-600 blur-2xl opacity-40 rounded-2xl" />
            <button
              onClick={onPay}
              disabled={loading}
              className="relative w-full bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white py-5 rounded-2xl font-black text-base shadow-2xl shadow-red-900/40 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? <><RefreshCcw size={20} className="animate-spin" /> Initializing Razorpay...</>
                : <><ShieldCheck size={20} /> Pay ₹{amount.toLocaleString('en-IN')} Securely</>
              }
            </button>
          </div>

          {/* Trust Badges */}
          <div className="bg-white/3 border border-white/8 rounded-xl p-4">
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {["🔒 256-bit SSL", "✅ Razorpay", "🇮🇳 RBI Compliant", "⚡ Instant Confirm"].map(b => (
                <span key={b} className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{b}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Step4Done({ downloadPdf }: any) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', damping: 20 }} className="text-center py-8">
      {/* Icon */}
      <div className="relative inline-flex mb-8">
        <div className="absolute inset-0 bg-emerald-500/20 blur-3xl scale-150 rounded-full" />
        <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-900/50">
          <CheckCircle2 size={50} className="text-white" />
        </div>
      </div>

      <div className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
        Payment Successful
      </div>
      <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">Booking Confirmed!</h2>
      <p className="text-slate-400 max-w-sm mx-auto text-sm leading-relaxed">
        Your payment was successful and booking is confirmed. Our team will reach out within <span className="text-white font-bold">24 hours</span>.
      </p>

      {/* Details */}
      <div className="mt-8 grid grid-cols-3 gap-3 max-w-md mx-auto text-center">
        {[
          { emoji: "📞", label: "We'll Call You", sub: "Within 24 hrs" },
          { emoji: "📄", label: "Quote Sent", sub: "Check email" },
          { emoji: "🚚", label: "Logistics Ready", sub: "Team assigned" },
        ].map(item => (
          <div key={item.label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="text-2xl mb-2">{item.emoji}</div>
            <div className="text-white font-bold text-xs">{item.label}</div>
            <div className="text-slate-500 text-[10px] font-bold mt-0.5">{item.sub}</div>
          </div>
        ))}
      </div>

      <button
        onClick={downloadPdf}
        className="mt-8 inline-flex items-center gap-3 bg-gradient-to-r from-white to-slate-100 text-black px-8 py-4 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl"
      >
        <Download size={18} /> Download Booking Confirmation PDF
      </button>
      <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest mt-4">Paddlog DG Solutions · Certified Logistics Partner</p>
    </motion.div>
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
