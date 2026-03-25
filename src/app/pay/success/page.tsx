"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import {
  Check, Download, ArrowLeft, ShieldCheck, CreditCard,
  User, Mail, Phone, Package, FileText, Home
} from "lucide-react";
import Link from "next/link";

interface PaymentData {
  name: string;
  email: string;
  phone: string;
  service: string;
  amount: string;
  notes: string;
  timestamp: string;
}

export default function PaySuccessPage() {
  const [data, setData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("paddlog_direct_payment");
    if (saved) {
      setData(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const downloadReceipt = () => {
    if (!data) return;

    const date = new Date(data.timestamp || Date.now()).toLocaleDateString("en-IN", {
      day: "2-digit", month: "long", year: "numeric",
    });
    const time = new Date(data.timestamp || Date.now()).toLocaleTimeString("en-IN", {
      hour: "2-digit", minute: "2-digit",
    });
    const refNo = `PL-PAY-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-5)}`;
    const logoUrl = window.location.origin + "/paddlog-logo.png";
    const amountFormatted = Number(data.amount).toLocaleString("en-IN");

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Payment Receipt – Paddlog</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; color: #1e293b; }
    @media print { body { background: #fff; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div style="max-width:680px;margin:24px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 10px 40px -10px rgba(0,0,0,0.08)">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 60%,#0f172a 100%);padding:36px 40px;display:flex;align-items:center;justify-content:space-between">
      <img src="${logoUrl}" style="height:48px;width:auto;object-fit:contain;filter:brightness(1.1)" />
      <div style="text-align:right">
        <div style="color:#fff;font-size:20px;font-weight:900;letter-spacing:-0.02em">PAYMENT RECEIPT</div>
        <div style="color:rgba(255,255,255,0.4);font-size:10px;margin-top:4px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em">Issued: ${date} · ${time}</div>
      </div>
    </div>

    <!-- Status Bar -->
    <div style="background:#10b98112;border-left:4px solid #10b981;padding:14px 40px;display:flex;align-items:center;justify-content:space-between">
      <div style="display:flex;align-items:center;gap:10px">
        <div style="width:10px;height:10px;border-radius:50%;background:#10b981"></div>
        <span style="font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:0.15em;color:#10b981">Payment Completed via Razorpay</span>
      </div>
      <span style="color:#94a3b8;font-size:11px;font-weight:700">${refNo}</span>
    </div>

    <!-- Amount Hero -->
    <div style="padding:32px 40px;background:#f8fafc;border-bottom:1px solid #e2e8f0;text-align:center">
      <div style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:0.3em;color:#94a3b8;margin-bottom:10px">Total Amount Paid</div>
      <div style="font-size:52px;font-weight:900;color:#0f172a;letter-spacing:-0.03em">₹${amountFormatted}</div>
    </div>

    <!-- Customer Info -->
    <div style="padding:28px 40px">
      <div style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:0.3em;color:#94a3b8;margin-bottom:16px">Customer Information</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px">
          <div style="font-size:9px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:5px">Full Name</div>
          <div style="font-size:16px;font-weight:900;color:#0f172a;text-transform:uppercase">${data.name}</div>
        </div>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px">
          <div style="font-size:9px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:5px">Phone</div>
          <div style="font-size:16px;font-weight:900;color:#0f172a">${data.phone}</div>
        </div>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px">
          <div style="font-size:9px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:5px">Email</div>
          <div style="font-size:13px;font-weight:700;color:#0f172a;word-break:break-all">${data.email}</div>
        </div>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px">
          <div style="font-size:9px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:5px">Service</div>
          <div style="font-size:13px;font-weight:900;color:#0f172a">${data.service}</div>
        </div>
      </div>

      ${data.notes ? `
      <div style="margin-top:14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px">
        <div style="font-size:9px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:5px">Notes / Reference</div>
        <div style="font-size:13px;font-weight:700;color:#0f172a">${data.notes}</div>
      </div>
      ` : ""}
    </div>

    <!-- Summary Row -->
    <div style="margin:0 40px;padding:20px 0;border-top:2px solid #f1f5f9;display:flex;align-items:center;justify-content:space-between">
      <div>
        <div style="color:#0f172a;font-size:11px;font-weight:900;text-transform:uppercase">Paddlog Logistics</div>
        <div style="color:#94a3b8;font-size:9px;font-weight:700">Dangerous Goods Specialist</div>
      </div>
      <div style="text-align:right">
        <div style="color:#94a3b8;font-size:9px">This is a computer-generated receipt.</div>
        <div style="color:#94a3b8;font-size:9px">No signature required. · ${new Date().getFullYear()}</div>
      </div>
    </div>
  </div>
  <script>window.onload = function() { window.print(); }<\/script>
</body>
</html>`;

    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center font-roboto">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] font-roboto">
      <Navbar />

      <div className="pt-32 pb-20 container mx-auto px-6 max-w-3xl min-h-[85vh] flex flex-col justify-center">
        {!data ? (
          /* No data */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border-2 border-slate-100 rounded-[3rem] p-12 md:p-20 text-center shadow-2xl"
          >
            <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-amber-100">
              <ShieldCheck size={40} className="text-amber-500" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight uppercase italic">No Session Found</h1>
            <p className="text-slate-500 font-bold mb-10 max-w-xs mx-auto text-sm leading-relaxed">
              We couldn't find a recent payment session. Please check your email for the Razorpay confirmation.
            </p>
            <Link
              href="/pay"
              className="inline-flex items-center gap-3 red-gradient text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-red-500/20"
            >
              <CreditCard size={16} />
              Make a Payment
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Success Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border-2 border-slate-100 rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden"
            >
              {/* Background watermark */}
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12 -translate-y-4 translate-x-4">
                <ShieldCheck size={220} />
              </div>

              {/* Success header */}
              <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                <div className="w-20 h-20 bg-emerald-500 text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-emerald-500/40 shrink-0">
                  <Check size={40} strokeWidth={4} />
                </div>
                <div className="text-center md:text-left">
                  <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-2">Transaction Verified</div>
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none mb-3 italic uppercase">
                    Payment Done!
                  </h1>
                  <p className="text-slate-500 font-bold text-sm max-w-sm">
                    Thank you, <span className="text-slate-900 font-black uppercase">{data.name}</span>. Your payment has been received by{" "}
                    <span className="underline decoration-primary decoration-4 underline-offset-4 text-slate-900">Paddlog Logistics</span>.
                  </p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="mt-12 pt-10 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
                {[
                  { icon: User, label: "Customer", val: data.name },
                  { icon: Package, label: "Service", val: data.service },
                  { icon: CreditCard, label: "Amount", val: `₹${Number(data.amount).toLocaleString("en-IN")}` },
                  { icon: FileText, label: "Status", val: "Paid ✓", green: true },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`p-5 rounded-2xl border ${item.green ? "bg-emerald-50 border-emerald-100" : "bg-slate-50 border-slate-100"}`}
                  >
                    <item.icon size={14} className={`mb-2 ${item.green ? "text-emerald-500" : "text-slate-400"}`} />
                    <span className={`text-[9px] font-black uppercase tracking-widest block mb-1 ${item.green ? "text-emerald-500" : "text-slate-400"}`}>
                      {item.label}
                    </span>
                    <span className={`font-black text-xs block uppercase truncate ${item.green ? "text-emerald-700" : "text-slate-900"}`}>
                      {item.val}
                    </span>
                  </div>
                ))}
              </div>

              {/* Contact Info tiles */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex items-center gap-3">
                  <Mail size={14} className="text-slate-400" />
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Email</span>
                    <span className="text-slate-900 font-bold text-xs">{data.email}</span>
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex items-center gap-3">
                  <Phone size={14} className="text-slate-400" />
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Phone</span>
                    <span className="text-slate-900 font-bold text-xs">{data.phone}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4 relative z-10">
                <button
                  onClick={downloadReceipt}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white px-8 py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <Download size={16} />
                  Download Receipt (PDF)
                </button>
                <Link
                  href="/"
                  className="px-8 py-5 bg-white border border-slate-200 rounded-2xl font-black uppercase text-[11px] tracking-widest text-slate-500 hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
                >
                  <Home size={16} />
                  Back to Home
                </Link>
              </div>
            </motion.div>

            {/* What happens next */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-slate-900 text-white rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div>
                <h4 className="text-lg font-black uppercase italic mb-1">What happens next?</h4>
                <p className="text-slate-400 text-xs font-bold leading-relaxed max-w-sm">
                  Our team will reach out to you at <span className="text-white font-black">{data.phone}</span> within 15 minutes to confirm your order and provide shipment details.
                </p>
              </div>
              <a
                href="tel:+917093777026"
                className="w-full md:w-auto shrink-0 bg-primary text-white px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-red-600 transition-colors"
              >
                <Phone size={14} />
                Call Support
              </a>
            </motion.div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
