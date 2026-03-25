"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import {
  CreditCard, User, Mail, Phone, Package, ArrowRight,
  ShieldCheck, Zap, Globe, CheckCircle2, Lock, AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createDynamicPaymentLink } from "./actions";
import { supabase } from "@/lib/supabase";
import Script from "next/script";

const SERVICES = [
  "UN Certified Packaging",
  "DG Packing & DGD",
  "Freight Forwarding",
  "Aeroparts & Special Packing",
  "Customs Brokerage",
  "Warehousing & Storage",
  "Other / Custom Service",
];

function PayPageInner() {
  const searchParams = useSearchParams();

  const [form, setForm] = useState({
    name: searchParams.get("name") || "",
    email: searchParams.get("email") || "",
    phone: searchParams.get("phone") || "",
    service: searchParams.get("service") || "",
    amount: searchParams.get("amount") || "",
    notes: searchParams.get("notes") || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const update = (field: string, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => { const n = { ...p }; delete n[field]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.service) e.service = "Select a service";
    if (!form.amount.trim() || isNaN(Number(form.amount)) || Number(form.amount) <= 0) e.amount = "Enter valid amount";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePay = async () => {
    if (!validate()) return;
    setLoading(true);
    setApiError(null);

    try {
      // 1. Create a dynamic Razorpay payment link with pre-filled customer data
      const result = await createDynamicPaymentLink({
        name: form.name,
        email: form.email,
        phone: form.phone,
        amount: Number(form.amount),
        service: form.service,
        notes: form.notes,
      });

      if (!result.success || !result.paymentLink) {
        setApiError(result.error || "Could not create payment link. Please try again.");
        setLoading(false);
        return;
      }

      // 2. Save to Supabase (non-blocking)
      void (async () => {
        try {
          await supabase.from("direct_payments").insert([{
            customer_name: form.name,
            customer_email: form.email,
            customer_phone: form.phone,
            service_type: form.service,
            amount: Number(form.amount),
            notes: form.notes,
            status: "pending",
            razorpay_id: result.paymentLinkId || null,
          }]);
        } catch (_) { }
      })();

      // 3. Save to localStorage for receipt page after return
      localStorage.setItem("paddlog_direct_payment", JSON.stringify({
        ...form,
        timestamp: new Date().toISOString(),
      }));

      // 4. Redirect to the pre-filled Razorpay page
      window.location.href = result.paymentLink;

    } catch (err) {
      setApiError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] font-roboto">
      <Navbar />

      {/* Hero Header */}
      <div className="pt-32 pb-10 bg-white border-b border-slate-100">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full mb-6"
          >
            <Lock size={12} className="text-emerald-600" />
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.2em]">Secured by Razorpay</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative inline-block"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-slate-900 relative inline-block">
              Quick <span className="text-primary">Payment</span>
            </h1>
            <p className="text-slate-500 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              Securely complete your payment for Paddlog services. Instant transactions with official receipts.
            </p>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 font-bold text-sm"
          >
            Fill in your details below and proceed to pay securely via Razorpay.
            A payment receipt will be available immediately after.
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-14">
        <div className="container mx-auto px-6 max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-7"
          >
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.06)]">
              <div className="flex flex-col items-center mb-10">
                <img
                  src="/paddlog-logo-nav.png"
                  alt="Paddlog Logo"
                  className="h-12 w-auto mb-6"
                />
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  Customer & Service Details
                </h2>
              </div>

              <div className="space-y-6">
                {/* Name + Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field icon={User} label="Full Name" error={errors.name}>
                    <input
                      type="text"
                      placeholder="e.g. Ravi Kumar"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      className="bg-transparent flex-1 text-slate-900 font-bold outline-none text-sm placeholder:text-slate-300 uppercase tracking-wide"
                    />
                  </Field>
                  <Field icon={Phone} label="Phone Number" error={errors.phone}>
                    <input
                      type="tel"
                      placeholder="+91 99999 99999"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      className="bg-transparent flex-1 text-slate-900 font-bold outline-none text-sm placeholder:text-slate-300"
                    />
                  </Field>
                </div>

                {/* Email */}
                <Field icon={Mail} label="Email Address" error={errors.email}>
                  <input
                    type="email"
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="bg-transparent flex-1 text-slate-900 font-bold outline-none text-sm placeholder:text-slate-300"
                  />
                </Field>

                {/* Service */}
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Service Type
                  </span>
                  <div className={cn(
                    "flex items-center gap-4 bg-[#f8fafc] border rounded-2xl px-6 py-4 transition-all",
                    errors.service ? "border-red-400 ring-4 ring-red-50" : "border-slate-100 focus-within:border-primary"
                  )}>
                    <Package size={18} className="text-slate-300 shrink-0" />
                    <select
                      value={form.service}
                      onChange={(e) => update("service", e.target.value)}
                      className="bg-transparent flex-1 text-slate-900 font-bold outline-none text-sm cursor-pointer"
                    >
                      <option value="">Select a service...</option>
                      {SERVICES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  {errors.service && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.service}</p>}
                </div>

                {/* Amount */}
                <Field icon={CreditCard} label="Payment Amount (₹)" error={errors.amount}>
                  <span className="text-slate-300 font-black text-sm mr-1">₹</span>
                  <input
                    type="number"
                    placeholder="5000"
                    value={form.amount}
                    onChange={(e) => update("amount", e.target.value)}
                    className="bg-transparent flex-1 text-slate-900 font-bold outline-none text-sm placeholder:text-slate-300"
                    min="1"
                  />
                </Field>

                {/* Notes (optional) */}
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    Notes / Reference (Optional)
                  </span>
                  <textarea
                    placeholder="e.g. Invoice #1234, UN 3480 batteries..."
                    value={form.notes}
                    onChange={(e) => update("notes", e.target.value)}
                    rows={3}
                    className="w-full bg-[#f8fafc] border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold outline-none text-sm placeholder:text-slate-300 focus:border-slate-300 transition-all resize-none"
                  />
                </div>
              </div>

              {/* API Error */}
              {apiError && (
                <div className="mt-6 flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl p-4">
                  <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-red-600 font-bold text-sm">{apiError}</p>
                </div>
              )}

              {/* CTA */}
              <div className="mt-8 pt-8 border-t border-slate-100">
                <button
                  onClick={handlePay}
                  disabled={loading}
                  className="w-full group relative inline-flex items-center justify-center gap-3 red-gradient text-white py-5 px-10 rounded-2xl font-black uppercase tracking-[0.15em] text-sm shadow-[0_15px_30px_-10px_rgba(239,68,68,0.5)] hover:shadow-[0_20px_40px_-10px_rgba(239,68,68,0.6)] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating secure payment link...
                    </>
                  ) : (
                    <>
                      <CreditCard size={18} />
                      Proceed to Pay {form.amount ? `₹${Number(form.amount).toLocaleString("en-IN")}` : ""}
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                <p className="text-center text-slate-400 text-[10px] font-bold mt-4 uppercase tracking-wider">
                  🔒 Details auto-filled on Razorpay · UPI / Cards / NetBanking accepted
                </p>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Razorpay Button - Compact & Attractive Version */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-[2rem] p-6 shadow-sm hover:border-emerald-200 transition-all text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <ShieldCheck size={14} className="text-emerald-600" />
                <h4 className="text-[10px] font-black text-emerald-800 uppercase tracking-[0.2em]">
                  Pay Directly
                </h4>
              </div>

              <div className="flex justify-center" id="rzp-btn-container">
                <form 
                  ref={(node) => {
                    if (node && node.innerHTML === '') {
                      const script = document.createElement('script');
                      script.src = "https://checkout.razorpay.com/v1/payment-button.js";
                      script.setAttribute('data-payment_button_id', 'pl_SVV0HW1GPPOJVL');
                      script.async = true;
                      node.appendChild(script);
                    }
                  }}
                />
              </div>
              
              <p className="text-[8px] text-emerald-600/60 font-black uppercase mt-4 tracking-tighter">
                Verified 1-Click Checkout
              </p>
            </div>

            {/* Amount Preview */}
            {form.amount && Number(form.amount) > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900 text-white rounded-[2.5rem] p-8 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <CreditCard size={140} />
                </div>
                <div className="relative z-10">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Amount Due</div>
                  <div className="text-5xl font-black text-white leading-none mb-1">
                    ₹{Number(form.amount).toLocaleString("en-IN")}
                  </div>
                  {form.service && (
                    <div className="text-slate-400 text-xs font-bold mt-3 uppercase tracking-wider">
                      {form.service}
                    </div>
                  )}
                  {form.name && (
                    <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center">
                        <User size={14} className="text-white" />
                      </div>
                      <span className="font-black text-sm uppercase">{form.name}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Trust Badges */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm space-y-5">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Paddlog Assurance</h4>
              {[
                { icon: ShieldCheck, color: "bg-emerald-50 text-emerald-600", title: "Fully Insured", desc: "Every shipment is end-to-end insured." },
                { icon: Zap, color: "bg-amber-50 text-amber-600", title: "Instant Receipt", desc: "PDF receipt generated right after payment." },
                { icon: Globe, color: "bg-blue-50 text-blue-600", title: "Global Network", desc: "180+ countries covered." },
                { icon: CheckCircle2, color: "bg-purple-50 text-purple-600", title: "Expert Verified", desc: "IATA/IMDG/ADR certified specialists." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={cn("p-3 rounded-xl shrink-0", item.color)}>
                    <item.icon size={18} />
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-slate-900">{item.title}</h5>
                    <p className="text-[11px] text-slate-400 font-bold">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Help */}
            <div className="bg-red-600 text-white rounded-[2.5rem] p-8">
              <div className="text-[9px] font-black text-red-200 uppercase tracking-[0.3em] mb-2">Need Help?</div>
              <h4 className="text-lg font-black mb-1">Talk to Our Team</h4>
              <p className="text-red-200 text-xs font-bold mb-5">Available 24/7 for urgent queries.</p>
              <a
                href="tel:+917093777026"
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 py-3 px-5 rounded-2xl transition-all font-black text-sm"
              >
                <Phone size={16} />
                +91 7093777026
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

// Reusable field component
function Field({ icon: Icon, label, error, children }: {
  icon: any; label: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        {label}
      </span>
      <div className={cn(
        "flex items-center gap-4 bg-[#f8fafc] border rounded-2xl px-6 py-4 transition-all",
        error ? "border-red-400 ring-4 ring-red-50" : "border-slate-100 focus-within:border-primary focus-within:bg-white focus-within:shadow-lg focus-within:shadow-slate-200/50"
      )}>
        <Icon size={18} className={cn("shrink-0", error ? "text-red-400" : "text-slate-300")} />
        {children}
      </div>
      {error && <p className="text-[10px] text-red-500 font-bold ml-1">{error}</p>}
    </div>
  );
}

export default function PayPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PayPageInner />
    </Suspense>
  );
}
