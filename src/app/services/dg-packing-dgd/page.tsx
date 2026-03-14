"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Shield, ClipboardList, Package, FileCheck2, Plane, Ship, Truck, CheckCircle2 } from "lucide-react";

export default function DgPackingPage() {
  return (
    <main className="min-h-screen font-body bg-slate-50">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-6 text-center space-y-4">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm uppercase tracking-[0.3em] text-primary font-semibold"
          >
            Services
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold font-heading"
          >
            DG Packing & Dangerous Goods Declarations
          </motion.h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
            Certified packaging, flawless documentation, and mode-specific labeling to keep hazardous cargo compliant for air, ocean, and road.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href="/contact"
              className="red-gradient text-white px-6 py-3 rounded-xl font-semibold shadow-red-glow hover:scale-105 transition-transform"
            >
              Talk to DG Specialist
            </a>
            <a
              href="/book"
              className="bg-white/10 text-white border border-white/20 px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors"
            >
              Book Service
            </a>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-14">
        <div className="container mx-auto px-6 grid gap-6 md:grid-cols-3">
          <Highlight
            icon={<Package className="text-primary" size={24} />}
            title="UN Certified Packaging"
            text="Right design type and packing group for your UN number, with closures and absorbents matched to the material."
          />
          <Highlight
            icon={<ClipboardList className="text-secondary" size={24} />}
            title="DGD Done Right"
            text="IATA/ICAO, IMDG, and DOT aligned Dangerous Goods Declarations, synced with labels, marks, and AWB/BL data."
          />
          <Highlight
            icon={<Shield className="text-accent" size={24} />}
            title="Zero-Rejection Checks"
            text="Pre-acceptance checklist to prevent carrier rejections and costly rework at the counter or port gate."
          />
        </div>
      </section>

      {/* Body */}
      <section className="pb-16">
        <div className="container mx-auto px-6 max-w-5xl space-y-10">
          <ContentBlock
            title="What we handle for every shipment"
            bullets={[
              "Identify hazard class, division, packing group, and applicable special provisions.",
              "Select UN-rated outer and inner packaging, closures, cushioning, and absorbents.",
              "Prepare DGD/shipper’s declaration plus SDS/MSDS cross-checks.",
              "Apply mode-specific marking, labeling, and placarding.",
              "Validate net/gross weight limits and overpack details.",
            ]}
          />

          <ContentBlock
            title="Mode expertise"
            bullets={[
              "Air: IATA/ICAO forms, operator variations, lithium and excepted quantity nuances.",
              "Ocean: IMDG segregation, stowage codes, and port documentation support.",
              "Road: placarding, tunnel codes, and state notifications where required.",
            ]}
            iconsRow={[<Plane size={18} key="air" />, <Ship size={18} key="sea" />, <Truck size={18} key="road" />]}
          />

          <ContentBlock
            title="Why Paddlog DG Solutions"
            bullets={[
              "Certified DG specialists on call for audits and last-minute corrections.",
              "Packaging supply plus documentation in one workflow to cut cycle time.",
              "Global partner network to mirror compliance at both origin and destination.",
            ]}
          />

          <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-premium">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Ready to move hazardous cargo?</h3>
                <p className="text-slate-600">
                  Share your UN number and route. We will spec the pack, prepare the DGD, and book the carrier.
                </p>
              </div>
              <a
                href="mailto:sales@paddlog.com"
                className="red-gradient text-white px-6 py-3 rounded-xl font-semibold shadow-red-glow hover:scale-105 transition-transform text-center"
              >
                sales@paddlog.com
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Highlight({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-premium">
      <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">{icon}</div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{text}</p>
    </div>
  );
}

function ContentBlock({
  title,
  bullets,
  iconsRow,
}: {
  title: string;
  bullets: string[];
  iconsRow?: React.ReactNode[];
}) {
  return (
    <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-premium space-y-4">
      <div className="flex items-center space-x-3">
        <CheckCircle2 className="text-primary" size={18} />
        <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
      </div>
      {iconsRow && (
        <div className="flex space-x-3 text-secondary">
          {iconsRow.map((icon, idx) => (
            <span key={idx} className="p-2 rounded-lg bg-slate-100">
              {icon}
            </span>
          ))}
        </div>
      )}
      <ul className="space-y-3">
        {bullets.map((item) => (
          <li key={item} className="flex items-start space-x-3">
            <span className="mt-1 text-primary">
              <FileCheck2 size={16} />
            </span>
            <span className="text-slate-700 leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
