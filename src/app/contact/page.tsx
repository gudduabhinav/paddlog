"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Phone, Mail, MapPin, MessageCircle, CheckCircle2 } from "lucide-react";
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
              className="text-5xl md:text-7xl font-black mb-6 text-slate-900 uppercase tracking-tighter"
            >
              Get In <span className="text-primary">Touch</span>
            </motion.h1>
            <p className="text-slate-500 text-lg leading-relaxed font-medium">
              Have a dangerous goods shipment, regulatory question, or need a technical consultation? Our experts are standing by.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Form Side */}
            <div className="flex flex-col gap-6">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white border border-slate-200 p-10 rounded-[3rem] shadow-premium relative overflow-hidden"
              >
                <h3 className="text-2xl font-black mb-2 text-slate-900 uppercase">Send an Inquiry</h3>
                <p className="text-slate-500 mb-8 border-b border-slate-100 pb-6 uppercase text-[10px] font-bold tracking-widest">Your request will be routed to the appropriate specialist.</p>

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
                          <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Service Required</label>
                          <select
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-slate-900 hover:border-primary/50 transition-colors outline-none focus:ring-1 focus:ring-primary/50 font-bold text-sm"
                            value={formData.service}
                            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                          >
                            <option>General Inquiry</option>
                            <option>Technical Packing</option>
                            <option>DG Packing & DGD</option>
                            <option>Freight Forwarding</option>
                            <option>Warehousing & Storage</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Your Detailed Message</label>
                        <textarea
                          required
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 min-h-[160px] text-slate-900 hover:border-primary/50 transition-colors outline-none focus:ring-1 focus:ring-primary/50 font-medium"
                          placeholder="How can we help with your logistics project?"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={formStatus === 'loading'}
                        className="w-full red-gradient text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-premium hover:shadow-red-glow transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                      >
                        <span>{formStatus === 'loading' ? 'Sending...' : 'Transmit Inquiry'}</span>
                        <Send size={18} />
                      </button>
                      {formStatus === 'error' && <p className="text-red-500 text-center text-sm font-bold">Failed to send. Please check your connection.</p>}
                    </form>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "2 Hrs", label: "Avg Response" },
                  { value: "500+", label: "DG Shipments/yr" },
                  { value: "15+", label: "Countries" },
                ].map((s) => (
                  <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                    <div className="text-2xl font-black text-primary">{s.value}</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* DG Expertise Highlights */}
              <div className="grid grid-cols-1 gap-3">
                {[
                  { icon: "🔴", title: "IATA & IMDG Certified", desc: "Dangerous goods handled per international air & sea regulations." },
                  { icon: "📦", title: "UN Certified Packaging", desc: "Only approved UN-spec packaging materials used for all DG cargo." },
                  { icon: "⚡", title: "24/7 Operations Team", desc: "Round-the-clock expert support for time-critical shipments." },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:border-primary/20 hover:shadow-md transition-all group">
                    <span className="text-2xl mt-0.5 group-hover:scale-110 transition-transform">{item.icon}</span>
                    <div>
                      <div className="text-xs font-black text-slate-900 uppercase tracking-tight mb-0.5">{item.title}</div>
                      <div className="text-[11px] text-slate-500 font-medium leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>


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
                  <div className="text-white font-black text-2xl mb-1 tracking-tight uppercase">Expert Coordination</div>
                  <div className="text-white/70 text-[10px] font-bold tracking-[0.2em] uppercase">24/7 Global Response Center for Hazardous Cargo.</div>
                </div>
              </div>
              {/* Priority Support Card */}
              <div id="support" className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-8 pt-8 pb-5 border-b border-white/10">
                  <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Priority Support</h3>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Direct lines to our operations team</p>
                  </div>
                  <span className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
                    Online
                  </span>
                </div>

                {/* Phones */}
                <div className="px-8 pt-5 pb-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Hotlines</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <SupportItem icon={Phone} label="Bangalore" value="+91 73861 07071" href="tel:+917386107071" />
                    <SupportItem icon={Phone} label="Hyderabad" value="+91 70937 77026" href="tel:+917093777026" />
                  </div>
                </div>

                {/* Divider */}
                <div className="mx-8 border-t border-white/10 my-1" />

                {/* Emails */}
                <div className="px-8 pt-3 pb-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Operations Email</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <SupportItem icon={Mail} label="Bangalore" value="Blrops@paddlog.com" href="mailto:Blrops@paddlog.com" small />
                    <SupportItem icon={Mail} label="Hyderabad" value="Hydops@paddlog.com" href="mailto:Hydops@paddlog.com" small />
                    <SupportItem icon={Mail} label="Navi Mumbai" value="bomops@paddlog.com" href="mailto:bomops@paddlog.com" small />
                  </div>
                </div>

                {/* Divider */}
                <div className="mx-8 border-t border-white/10 my-1" />

                {/* WhatsApp */}
                <div className="px-8 pt-3 pb-8">
                  <a href="https://wa.me/917386107071" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 rounded-2xl px-5 py-4 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <MessageCircle size={20} className="text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-emerald-500/70">WhatsApp Business</div>
                      <div className="text-sm font-black text-emerald-400">Chat Globally →</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Geographic Hubs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {offices.map((office) => (
                  <div key={office.city} className="bg-white border border-slate-200 rounded-2xl p-5 group hover:border-primary/40 hover:shadow-lg transition-all shadow-sm">
                    {/* Card Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform flex-shrink-0 mt-0.5">
                        <MapPin size={16} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">{office.tagline}</div>
                        <h4 className="text-sm font-black text-slate-900 uppercase">{office.city}</h4>
                        {office.address && <p className="text-[10px] text-slate-400 font-medium leading-snug mt-0.5">{office.address}</p>}
                      </div>
                    </div>
                    {/* Contact Row */}
                    {(office.phone || office.email) && (
                      <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-3 mt-1">
                        {office.phone && (
                          <a href={`tel:+91${office.phone}`} className="flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-primary transition-colors">
                            <Phone size={11} className="text-primary flex-shrink-0" />
                            +91 {office.phone}
                          </a>
                        )}
                        {office.email && (
                          <a href={`mailto:${office.email}`} className="flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-primary transition-colors truncate">
                            <Mail size={11} className="text-primary flex-shrink-0" />
                            {office.email}
                          </a>
                        )}
                      </div>
                    )}
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
      <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1">{label}</label>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-slate-900 hover:border-primary/50 transition-colors outline-none focus:ring-1 focus:ring-primary/50 font-bold text-sm"
      />
    </div>
  );
}

function SupportItem({ icon: Icon, label, value, href, small = false }: any) {
  return (
    <a href={href} className="flex items-center gap-3 group rounded-xl hover:bg-white/5 px-2 py-2 -mx-2 transition-colors">
      <div className={`${small ? 'w-7 h-7' : 'w-9 h-9'} rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors`}>
        <Icon size={small ? 13 : 16} className="text-slate-300 group-hover:text-white transition-colors" />
      </div>
      <div className="min-w-0">
        <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">{label}</div>
        <div className={`${small ? 'text-[11px]' : 'text-sm'} font-black text-white group-hover:text-primary transition-colors truncate`}>{value}</div>
      </div>
    </a>
  );
}

const offices = [
  { city: "Hyderabad", tagline: "Headquarters", address: "Gachibowli, Serilingampalle, Hyderabad, 500032", phone: "7093777026", email: "Hydops@paddlog.com" },
  { city: "Bangalore", tagline: "Branch Office", address: "Bangalore, Karnataka", phone: "7386107071", email: "Blrops@paddlog.com" },
  { city: "Navi Mumbai", tagline: "Branch Office", address: "Near Navi Mumbai Airport", phone: "7386107071", email: "bomops@paddlog.com" },
  { city: "Chennai", tagline: "Branch Office", address: "Chennai, Tamil Nadu", phone: "", email: "" },
  { city: "Gujarat", tagline: "Branch Office", address: "Gujarat, India", phone: "", email: "" },
];
