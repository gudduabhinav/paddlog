"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Download, ArrowLeft, Package, User, Building2, Calendar, ShieldCheck, Mail, Phone, MapPin, ExternalLink } from "lucide-react";

export default function BookingSuccessPage() {
  const [bookingData, setBookingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load booking data from localStorage
    const saved = localStorage.getItem("paddlog_last_booking");
    if (saved) {
      setBookingData(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const exportToPDF = () => {
    if (!bookingData) return;
    const { formData, serviceTitle } = bookingData;
    const name = formData.name || 'Customer';
    const date = new Date().toLocaleDateString('en-IN', {day:'2-digit',month:'long',year:'numeric'});
    const logoUrl = window.location.origin + '/paddlog-logo.png';

    const SKIP = ['serviceId', 'submitted_at', 'payment_redirected'];
    const LABELS: any = { 
      name: 'Customer Name', company: 'Company', email: 'Email', phone: 'Phone', 
      commodity: 'Commodity', weight: 'Weight', dimensions: 'Dimensions', 
      quantity: 'Quantity', collection_address: 'Collection Address', msds: 'MSDS Status'
    };
    const getLabel = (k: string) => LABELS[k] || k.replace(/([A-Z])/g,' $1').replace(/_/g,' ').trim();
    const fmtVal = (v: any) => { if (typeof v === 'boolean') return v ? 'Yes' : 'No'; return String(v); };
    
    const rows = Object.entries(formData).filter(([k,v]) => 
      !SKIP.includes(k) && v !== null && v !== undefined && v !== ''
    );

    const detailRows = rows.map(([k,v]) => `
      <tr>
        <td style="padding:10px 16px;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;white-space:nowrap">${getLabel(k)}</td>
        <td style="padding:10px 16px;border-bottom:1px solid #f1f5f9;color:#1e293b;font-size:13px;font-weight:600;text-align:right">${fmtVal(v)}</td>
      </tr>`).join('');

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Receipt – ${name}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',Arial,sans-serif;background:#f8fafc;color:#1e293b}@media print{body{background:#fff}.no-print{display:none}}</style></head>
<body style="padding:0">
  <div style="max-width:700px;margin:20px auto;background:#fff;min-height:90vh;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;box-shadow:0 10px 40px -10px rgba(0,0,0,0.1)">
    <div style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 60%,#0f172a 100%);padding:40px;display:flex;align-items:center;justify-content:space-between">
      <img src="${logoUrl}" style="height:52px;width:auto;filter:brightness(1.1)" />
      <div style="text-align:right">
        <div style="color:#fff;font-size:20px;font-weight:900;letter-spacing:-0.02em">PAYMENT RECEIPT</div>
        <div style="color:rgba(255,255,255,0.4);font-size:10px;margin-top:4px;font-weight:700;text-transform:uppercase">Issued on: ${date}</div>
      </div>
    </div>
    
    <div style="background:#10b98115;border-left:4px solid #10b981;padding:16px 40px;display:flex;align-items:center;gap:12px">
      <div style="width:12px;height:12px;border-radius:50%;background:#10b981"></div>
      <span style="font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:0.15em;color:#10b981">Payment Completed via Razorpay</span>
    </div>

    <div style="padding:32px 40px">
      <div style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:0.3em;color:#94a3b8;margin-bottom:16px">Service Overview</div>
      <div style="display:grid;grid-template-columns:1r 1fr;gap:20px">
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px">
          <div style="font-size:10px;color:#94a3b8;font-weight:700;text-transform:uppercase;margin-bottom:6px">Customer</div>
          <div style="font-size:18px;font-weight:900;color:#0f172a;text-transform:uppercase">${name}</div>
        </div>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px">
          <div style="font-size:10px;color:#94a3b8;font-weight:700;text-transform:uppercase;margin-bottom:6px">Ordered Service</div>
          <div style="font-size:16px;font-weight:900;color:#0f172a">${serviceTitle || 'DG Logistics Service'}</div>
        </div>
      </div>
    </div>

    <div style="padding:0 40px 32px">
      <div style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:0.3em;color:#94a3b8;margin-bottom:16px">Detailed Breakdown</div>
      <div style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
        <table style="width:100%;border-collapse:collapse">
          ${detailRows}
        </table>
      </div>
    </div>

    <div style="margin:0 40px;padding:32px 0;border-top:2px solid #f1f5f9;display:flex;align-items:center;justify-content:space-between">
       <div>
         <div style="color:#0f172a;font-size:11px;font-weight:900;text-transform:uppercase">Paddlog Logistics</div>
         <div style="color:#94a3b8;font-size:9px;font-weight:700">Dangerous Goods Specialist</div>
       </div>
       <div style="text-align:right">
         <div style="color:#94a3b8;font-size:9px">Reference: PL-${Math.floor(1000 + Math.random() * 9000)}-${date.split(' ').join('-')}</div>
       </div>
    </div>
  </div>
  <script>window.onload=function(){window.print();}<\/script>
</body></html>`;

    const win = window.open('','_blank');
    if (win) { win.document.write(html); win.document.close(); }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center font-roboto">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="font-black text-[10px] uppercase tracking-widest text-slate-400">Verifying Transaction Flow...</p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#f8fafc] font-roboto selection:bg-primary selection:text-white">
      <Navbar />

      <div className="pt-32 pb-20 container mx-auto px-6 max-w-4xl min-h-[85vh] flex flex-col justify-center">
        {!bookingData ? (
          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="bg-white border-2 border-slate-100 rounded-[3rem] p-12 md:p-20 text-center shadow-2xl relative overflow-hidden"
          >
            <div className="absoulte top-0 left-0 w-full h-2 bg-slate-100" />
            <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-amber-100">
               <ShieldCheck size={40} className="text-amber-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight uppercase italic">No Record Found</h1>
            <p className="text-slate-500 font-bold mb-10 max-w-sm mx-auto leading-relaxed text-sm">We couldn't detect a recent payment session. If you have just paid, please check your email for the Razorpay receipt.</p>
            <button onClick={() => window.location.href = '/book'} className="red-gradient text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-red-500/20 active:scale-95 transition-all">Start New Booking</button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Main Success Card */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-white border-2 border-slate-100 rounded-[3rem] p-12 md:p-16 shadow-2xl relative overflow-hidden"
            >
              {/* Animated Success Seal */}
              <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 -translate-y-4 translate-x-4">
                <ShieldCheck size={200} />
              </div>

              <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                <div className="w-24 h-24 bg-emerald-500 text-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-emerald-500/40 shrink-0">
                  <Check size={48} strokeWidth={4} />
                </div>
                <div className="text-center md:text-left">
                  <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-3 leading-none">Authentication Successful</div>
                  <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none mb-4 italic uppercase">Payment Confirmed</h1>
                  <p className="text-slate-500 font-bold text-sm max-w-md">Thank you for choosing <span className="text-slate-900 underline decoration-primary decoration-4 underline-offset-4">Paddlog DG Solutions</span>. Your logistical requirement is now in processing.</p>
                </div>
              </div>

              <div className="mt-16 pt-12 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                 <div className="bg-slate-50 border border-slate-100 p-6 rounded-3xl">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Customer</span>
                    <span className="text-slate-900 font-black text-sm block uppercase truncate">{bookingData.formData.name}</span>
                 </div>
                 <div className="bg-slate-50 border border-slate-100 p-6 rounded-3xl">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Operation</span>
                    <span className="text-slate-900 font-black text-sm block uppercase truncate">{bookingData.serviceTitle}</span>
                 </div>
                 <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl">
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block mb-1">Transaction Status</span>
                    <span className="text-emerald-700 font-black text-sm block uppercase">Verified ✓</span>
                 </div>
              </div>

              <div className="mt-12 flex flex-col sm:flex-row gap-4 relative z-10">
                <button 
                  onClick={exportToPDF}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white px-10 py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <Download size={18} />
                  Download Receipt (PDF)
                </button>
                <button 
                  onClick={() => window.location.href = '/'}
                  className="px-10 py-5 bg-white border border-slate-200 rounded-2xl font-black uppercase text-[11px] tracking-widest text-slate-500 hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
                >
                  <ArrowLeft size={18} />
                  Home
                </button>
              </div>
            </motion.div>

            {/* Assistance Card */}
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="bg-slate-900 text-white rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-6"
            >
               <div className="flex items-center gap-6">
                 <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-primary">
                    <Package size={28} />
                 </div>
                 <div>
                   <h4 className="text-lg font-black uppercase italic">Urgent Support?</h4>
                   <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Our DG specialists are tracking your shipment.</p>
                 </div>
               </div>
               <a href="tel:+917093777026" className="w-full md:w-auto bg-primary text-white px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-red-600 transition-colors">
                  Contact Support
               </a>
            </motion.div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
