"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Phone, Mail, MapPin, MessageCircle, CheckCircle2, User, Globe2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { sendWhatsAppNotification } from "@/lib/whatsapp";

export default function Contact() {
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "General Inquiry",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');

    try {
      const { error } = await supabase
        .from('contacts')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: formData.service,
          message: formData.message
        }]);

      if (error) throw error;

      // Direct call to Edge Function to ensure email invitation
      await fetch('https://wawnxegvuuveqaxtbwpi.supabase.co/functions/v1/send-contact-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhd254ZWd2dXV2ZXFheHRid3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNDg5MjksImV4cCI6MjA4ODgyNDkyOX0.eYBK0zMHap0g1N0CHkfUDrU0jzolFwmbDzzECmV_KK0'
        },
        body: JSON.stringify({ record: formData })
      });

      // 3. Send WhatsApp Notification to Client
      await sendWhatsAppNotification(formData.phone, formData.name, "contact_form_submission");

      setFormStatus('success');
      setFormData({ name: "", email: "", phone: "", service: "General Inquiry", message: "" });
    } catch (err) {
      console.error(err);
      setFormStatus('error');
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0f1e] font-body flex flex-col text-white">
      <Navbar />

      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-red-600 blur-[180px] rounded-full" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-black mb-6"
            >
              Get In <span className="text-primary italic">Touch</span>
            </motion.h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Have a dangerous goods shipment, regulatory question, or need a technical consultation? Our experts are standing by.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Form Side */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-md relative"
            >
              <h3 className="text-2xl font-bold mb-2">Send an Inquiry</h3>
              <p className="text-slate-500 mb-8 border-b border-white/5 pb-6">Your request will be routed to the appropriate DG specialist.</p>
              
              <AnimatePresence mode="wait">
                {formStatus === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10"
                  >
                    <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 size={40} />
                    </div>
                    <h4 className="text-2xl font-bold mb-2 text-white">Message Received!</h4>
                    <p className="text-slate-400 mb-8">Our team will reach out to you within 2 hours on your provided contact details.</p>
                    <button 
                      onClick={() => setFormStatus('idle')}
                      className="text-primary font-bold hover:underline"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <DarkInput label="Full Name" placeholder="Abhinav Singh" value={formData.name} onChange={(v: string) => setFormData({...formData, name: v})} required />
                      <DarkInput label="Email Address" placeholder="abhinav@example.com" type="email" value={formData.email} onChange={(v: string) => setFormData({...formData, email: v})} required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <DarkInput label="Phone Number" placeholder="+91 00000 00000" value={formData.phone} onChange={(v: string) => setFormData({...formData, phone: v})} />
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Service Required</label>
                        <select 
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-white hover:border-primary/50 transition-colors outline-none"
                          value={formData.service}
                          onChange={(e) => setFormData({...formData, service: e.target.value})}
                        >
                          <option className="bg-[#12172b]">General Inquiry</option>
                          <option className="bg-[#12172b]">DG Packaging & DGD</option>
                          <option className="bg-[#12172b]">Freight Forwarding</option>
                          <option className="bg-[#12172b]">Compliance Training</option>
                          <option className="bg-[#12172b]">Warehouse & 3PL</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Your Detailed Message</label>
                       <textarea 
                         required
                         className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 min-h-[160px] text-white hover:border-primary/50 transition-colors outline-none focus:ring-1 focus:ring-primary/50"
                         placeholder="How can we help with your logistics project?"
                         value={formData.message}
                         onChange={(e) => setFormData({...formData, message: e.target.value})}
                       />
                    </div>
                    
                    <button 
                      type="submit" 
                      disabled={formStatus === 'loading'}
                      className="w-full red-gradient text-white py-4 rounded-2xl font-black text-lg shadow-premium hover:shadow-red-glow transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                    >
                      <span>{formStatus === 'loading' ? 'Sending...' : 'Transmit Inquiry'}</span>
                      <Send size={20} />
                    </button>
                    {formStatus === 'error' && <p className="text-red-500 text-center text-sm">Failed to send. Please check your connection.</p>}
                  </form>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Info Side */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-10"
            >
              {/* Quick Contact Card */}
              <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-md">
                 <h3 className="text-2xl font-bold mb-8">Priority Support</h3>
                 <div className="space-y-6">
                    <ContactDetail icon={Phone} label="Project Hotline" value="+91 93913 63636" href="tel:+919391363636" />
                    <ContactDetail icon={Mail} label="Official Inquiry" value="info@paddlog.com" href="mailto:info@paddlog.com" />
                    <ContactDetail icon={MessageCircle} label="WhatsApp Business" value="Chat Now" href="https://wa.me/919391363636" />
                 </div>
              </div>

              {/* Geographic Hubs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {offices.map((office) => (
                   <div key={office.city} className="bg-white/5 border border-white/10 p-6 rounded-3xl group hover:border-primary/30 transition-all">
                      <div className="flex items-center gap-4 mb-3">
                         <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <MapPin size={20} />
                         </div>
                         <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{office.tagline}</div>
                            <h4 className="text-lg font-black">{office.city}</h4>
                         </div>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed pl-14">{office.address}</p>
                   </div>
                 ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function DarkInput({ label, placeholder, type = "text", value, onChange, required }: any) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">{label}</label>
      <input 
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white hover:border-primary/50 transition-colors outline-none focus:ring-1 focus:ring-primary/50"
      />
    </div>
  );
}

function ContactDetail({ icon: Icon, label, value, href }: any) {
  return (
    <a href={href} className="flex items-center gap-5 group">
       <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Icon size={22} className="text-slate-400 group-hover:text-primary transition-colors" />
       </div>
       <div>
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</div>
          <div className="text-lg font-bold group-hover:text-primary transition-colors">{value}</div>
       </div>
    </a>
  );
}

const offices = [
  { city: "Hyderabad", tagline: "Headquarters", address: "Gachibowli, Financial District, Hyderabad" },
  { city: "Mumbai", tagline: "Coastal Hub", address: "Andheri East, Near Cargo Terminal, Mumbai" },
  { city: "Chennai", tagline: "Port Terminal", address: "Main Road, Near Ennore Port, Chennai" },
  { city: "Bangalore", tagline: "IT Logistics", address: "Electronic City, South Bangalore" },
];
