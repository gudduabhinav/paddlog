"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, ArrowRight, Zap, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { usePathname } from "next/navigation";

export function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const pathname = usePathname();

  const isHidden = pathname?.startsWith('/admin');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setStatus('loading');

    try {
      const { error } = await supabase
        .from('contacts')
        .insert([{
          name: name,
          email: "",
          phone: phone,
          service: "Urgent Callback",
          message: "User requested an urgent callback via Exit-Intent Popup."
        }]);

      if (error) throw error;


      // Notify team via Resend (Supabase Edge Function)
      await fetch('https://wawnxegvuuveqaxtbwpi.supabase.co/functions/v1/send-contact-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhd254ZWd2dXV2ZXFheHRid3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNDg5MjksImV4cCI6MjA4ODgyNDkyOX0.eYBK0zMHap0g1N0CHkfUDrU0jzolFwmbDzzECmV_KK0'
        },
        body: JSON.stringify({ 
          record: {
            name: name,
            email: "",
            phone: phone,
            service: "Urgent Callback",
            message: "User requested an urgent callback via Exit-Intent Popup."
          } 
        })
      });

      setStatus('success');
      setTimeout(() => setIsOpen(false), 3000);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    console.log("ExitIntentPopup: System Armed");

    const mouseEvent = (e: MouseEvent) => {
      // If mouse goes up past the top of the browser window
      if (e.clientY <= 5 && !hasTriggered) {
        console.log("ExitIntentPopup: Triggered via mouseleave");
        setIsOpen(true);
        setHasTriggered(true);
      }
    };

    // Mobile fallback: scroll up fast
    let lastScrollY = window.scrollY;
    const scrollEvent = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY - 150 && currentScrollY < 100 && !hasTriggered) {
        console.log("ExitIntentPopup: Triggered via scroll");
        setIsOpen(true);
        setHasTriggered(true);
      }
      lastScrollY = currentScrollY;
    };

    // Auto-trigger after 45 seconds for testing/engagement
    const timer = setTimeout(() => {
       if (!hasTriggered) {
         console.log("ExitIntentPopup: Triggered via timer");
         setIsOpen(true);
         setHasTriggered(true);
       }
    }, 45000);

    document.addEventListener("mouseleave", mouseEvent);
    window.addEventListener("scroll", scrollEvent);

    return () => {
      document.removeEventListener("mouseleave", mouseEvent);
      window.removeEventListener("scroll", scrollEvent);
      clearTimeout(timer);
    };
  }, [hasTriggered]);

  if (!isOpen || isHidden) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden z-10"
        >
          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors z-20"
          >
            <X size={20} />
          </button>

          {/* Banner img/texture */}
          <div className="bg-gradient-to-r from-red-500 to-rose-600 h-32 w-full relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            <motion.div 
               animate={{ rotate: [0, 5, -5, 0] }} 
               transition={{ duration: 0.5, delay: 0.2, repeat: 2 }}
               className="bg-white p-4 rounded-full shadow-lg"
            >
              <Zap size={32} className="text-red-500 fill-red-500" />
            </motion.div>
          </div>

          <div className="p-8 text-center">
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6"
              >
                <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-2xl font-bold text-secondary mb-2">Request Sent!</h3>
                <p className="text-slate-500">
                  Our DG expert is looking at your request and will call you in 5 minutes.
                </p>
              </motion.div>
            ) : (
              <>
                <h3 className="text-2xl md:text-3xl font-bold text-secondary mb-3">
                  Wait! Need Urgent DG Services?
                </h3>
                <p className="text-slate-500 mb-8 leading-relaxed">
                  Don't leave without getting your hazardous cargo sorted. Request a callback and our experts will contact you within <strong className="text-slate-800">5 minutes</strong>.
                </p>

                <form className="space-y-4 text-left" onSubmit={handleSubmit}>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Your Full Name" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={status === 'loading'}
                      className="w-full bg-slate-50 border border-slate-200 px-6 py-4 rounded-xl outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all font-medium disabled:opacity-50"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="tel" 
                      placeholder="Enter phone number" 
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={status === 'loading'}
                      className="w-full bg-slate-50 border border-slate-200 pl-14 pr-6 py-4 rounded-xl outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all font-medium disabled:opacity-50"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? 'Sending...' : 'Request Fast Callback'}
                    {status !== 'loading' && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                  </button>
                  {status === 'error' && (
                    <p className="text-red-500 text-sm text-center mt-2">Failed to send request. Please try again.</p>
                  )}
                </form>

                <button 
                  onClick={() => setIsOpen(false)}
                  className="mt-6 text-sm text-slate-400 hover:text-slate-600 font-medium transition-colors"
                >
                  No thanks, I'll figure it out myself
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
