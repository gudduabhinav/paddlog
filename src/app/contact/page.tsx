"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Phone, Mail, MapPin, MessageCircle, CheckCircle2, User, Globe2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

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
          message: formData.message,
          source: 'contact_form',
          viewed: false
        }]);

      if (error) throw error;

      const emailRes = await fetch('https://wawnxegvuuveqaxtbwpi.supabase.co/functions/v1/send-contact-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhd254ZWd2dXV2ZXFheHRid3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNDg5MjksImV4cCI6MjA4ODgyNDkyOX0.eYBK0zMHap0g1N0CHkfUDrU0jzolFwmbDzzECmV_KK0'
        },
        body: JSON.stringify({ record: formData })
      });
      console.log("Email Service Response:", await emailRes.json());


      setFormStatus('success');
      setFormData({ name: "", email: "", phone: "", service: "General Inquiry", message: "" });
    } catch (err) {
      console.error(err);
      setFormStatus('error');
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 font-body flex flex-col text-slate-900">
      <Navbar />

      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-red-100 blur-[180px] rounded-full" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold mb-6 text-slate-900"
            >
              Get In <span className="text-primary italic">Touch</span>
            </motion.h1>
            <p className="text-slate-500 text-lg leading-relaxed">
              Have a dangerous goods shipment, regulatory question, or need a technical consultation? Our experts are standing by.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Form Side */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-slate-200 p-10 rounded-[3rem] shadow-premium relative overflow-hidden"
            >
              <h3 className="text-2xl font-bold mb-2 text-slate-900">Send an Inquiry</h3>
              <p className="text-slate-500 mb-8 border-b border-slate-100 pb-6">Your request will be routed to the appropriate DG specialist.</p>

              <AnimatePresence mode="wait">
                {formStatus === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10"
                  >
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
                      <CheckCircle2 size={40} />
                    </div>
                    <h4 className="text-2xl font-bold mb-2 text-slate-900">Message Received!</h4>
                    <p className="text-slate-500 mb-8">Our team will reach out to you within 2 hours on your provided contact details.</p>
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
                      <LightInput label="Full Name" placeholder="Abhinav Singh" value={formData.name} onChange={(v: string) => setFormData({ ...formData, name: v })} required />
                      <LightInput label="Email Address" placeholder="abhinav@example.com" type="email" value={formData.email} onChange={(v: string) => setFormData({ ...formData, email: v })} required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <LightInput label="Phone Number" placeholder="+91 00000 00000" value={formData.phone} onChange={(v: string) => setFormData({ ...formData, phone: v })} />
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Service Required</label>
                        <select
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-slate-900 hover:border-primary/50 transition-colors outline-none focus:ring-1 focus:ring-primary/50"
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        >
                          <option>General Inquiry</option>
                          <option>DG Packaging & DGD</option>
                          <option>Freight Forwarding</option>
                          <option>Compliance Training</option>
                          <option>Warehouse & 3PL</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Your Detailed Message</label>
                      <textarea
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 min-h-[160px] text-slate-900 hover:border-primary/50 transition-colors outline-none focus:ring-1 focus:ring-primary/50"
                        placeholder="How can we help with your logistics project?"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={formStatus === 'loading'}
                      className="w-full red-gradient text-white py-4 rounded-2xl font-bold text-lg shadow-premium hover:shadow-red-glow transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
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
              {/* Feature Image */}
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl group transition-all duration-500">
                <img 
                  src="/Contact.png" 
                  alt="Contact Us" 
                  className="w-full h-[300px] object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent">
                  <div className="text-white font-black text-2xl mb-1 italic tracking-tight uppercase">Expert Coordination</div>
                  <div className="text-white/70 text-xs font-bold tracking-widest uppercase">24/7 Global Response Center for Hazardous Cargo.</div>
                </div>
              </div>
              {/* Quick Contact Card */}
              <div id="support" className="bg-white border border-slate-200 p-10 rounded-[3rem] shadow-premium">
                <div className="flex items-center gap-3 mb-8">
                  <h3 className="text-2xl font-bold text-slate-900">24/7 Priority Support</h3>
                  <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider animate-pulse">Online</span>
                </div>
                <div className="space-y-6">
                  <ContactDetail icon={Phone} label="Project Hotline" value="+91 7386107071 / +91 7386444710" href="tel:+917386107071" />
                  <ContactDetail icon={Mail} label="Official Inquiry" value="sales@paddlog.com" href="mailto:sales@paddlog.com" />
                  <ContactDetail icon={MessageCircle} label="WhatsApp Business" value="Chat Now" href="https://wa.me/917386107071" />
                </div>
              </div>

              {/* Geographic Hubs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {offices.map((office) => (
                  <div key={office.city} className="bg-white border border-slate-200 p-6 rounded-3xl group hover:border-primary/30 transition-all shadow-sm hover:shadow-md">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{office.tagline}</div>
                        <h4 className="text-lg font-bold text-slate-900">{office.city}</h4>
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

function LightInput({ label, placeholder, type = "text", value, onChange, required }: any) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">{label}</label>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-slate-900 hover:border-primary/50 transition-colors outline-none focus:ring-1 focus:ring-primary/50"
      />
    </div>
  );
}

function ContactDetail({ icon: Icon, label, value, href }: any) {
  return (
    <a href={href} className="flex items-center gap-5 group">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors border border-slate-100">
        <Icon size={22} className="text-slate-400 group-hover:text-primary transition-colors" />
      </div>
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</div>
        <div className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">{value}</div>
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
