"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Package, FileText, Plane, Ship, ShieldCheck, Warehouse, CheckCircle2, AlertTriangle, Globe, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const serviceData: Record<string, any> = {
  "un-certified-packaging": {
    title: "UN Certified Packaging",
    subtitle: "Safety First in Hazardous Material Handling",
    icon: Package,
    color: "text-red-600",
    bgColor: "bg-red-50",
    description: "PADDLOG provides a comprehensive range of packaging materials specifically designed for the safe transport of hazardous goods. These products meet stringent United Nations standards and are built to prevent leaks, spills, and environmental hazards during transit.",
    detailedInfo: "Our containers undergo rigorous testing to ensure they can withstand the most demanding shipping conditions, including pressure changes, drops, and stacking. We provide everything from small sample shippers to large IBC tanks.",
    features: [
      "UN Certified Boxes & Drums",
      "IBC Tanks & Specialized Containers",
      "Hazard & Compliance Labels",
      "Passive Temperature Boxes",
      "Rigorous Impact & Pressure Testing",
      "Robust Design for Long-distance Transport"
    ],
    regulations: ["UN Performance Standards", "IATA (Air)", "IMDG (Sea)", "ADR (Road)"]
  },
  "dg-packing-dgd": {
    title: "DG Packing & DGD",
    subtitle: "Expert Documentation & Secure Packing",
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    description: "Specialized technical packing services for Dangerous Goods (DG) and aerospace components. Our expert team ensures 100% compliance with regulatory requirements to minimize risk and avoid delays.",
    detailedInfo: "The preparation of a Dangerous Goods Declaration (DGD) is a critical step in the logistics chain. Our certified professionals handle the entire process, from classification to final documentation, ensuring your shipment is never held up due to paperwork errors.",
    features: [
      "Professional DGD Preparation",
      "Technical Aeroparts Packing",
      "Hazardous Material Classification",
      "Secure Container Stuffing",
      "IATA DGR Compliant Packing",
      "Expert Consulting on DG Shipping"
    ],
    regulations: ["IATA DGR", "ICAO Technical Instructions", "HMR (49 CFR)"]
  },
  "freight-forwarding": {
    title: "Global Freight Forwarding",
    subtitle: "Seamless Connectivity Across Every Mode",
    icon: Plane,
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
    description: "End-to-end logistics solutions for global shipments. Paddlog specializes in hazardous materials and critical cargo that requires specialized handling or temperature-controlled environments.",
    detailedInfo: "Whether by Air or Sea, we manage the entire journey of your hazardous cargo. Our global network of partners ensures that your goods are handled by certified professionals at every transit point.",
    features: [
      "Airfreight Export & Import",
      "Sea Freight (FCL/LCL) Solutions",
      "Hazardous & General Cargo Handling",
      "Status Updates & Monitoring",
      "Multi-modal Transportation",
      "24/7 Global Operational Support"
    ],
    regulations: ["International Shipping Laws", "Port & Airport Compliance", "SOLAS requirements"]
  },
  "technical-packing": {
    title: "Technical Packing",
    subtitle: "Precision Packing for High-Value Assets",
    icon: Ship,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    description: "Specialized high-quality technical packing for Aeroparts, industrial equipment, and sensitive machinery. We use advanced materials to ensure structural integrity and protection from the elements.",
    detailedInfo: "Our technical packing solutions are tailored to the specific dimensions and sensitivities of your equipment. From vacuum sealing to custom wood crating, we ensure your assets arrive in pristine condition.",
    features: [
      "Aerospace Component Packing",
      "Custom Industrial Crating",
      "Vacuum Sealing & Moisture Protection",
      "Heavy Equipment Maneuvering",
      "Shock & Vibration Protection",
      "On-site Technical Packing Services"
    ],
    regulations: ["Aerospace Safety Standards", "ISPM 15 Wood Standards", "VCI Protection Protocols"]
  },
  "customs-brokerage": {
    title: "Customs Brokerage",
    subtitle: "Navigating Complexity with Ease",
    icon: ShieldCheck,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    description: "Navigating complex customs regulations to ensure smooth and efficient clearance. Our team of experienced brokers is well-versed in the latest procedures to provide hassle-free logistics operations.",
    detailedInfo: "Clearing hazardous materials through customs requires specialized knowledge of classification, duties, and safety permits. We handle all the complexities so you don't have to worry about border delays.",
    features: [
      "Hazmat Duty Classification",
      "Import & Export Documentation",
      "Regulatory Compliance Consulting",
      "Fast-track Clearance Procedures",
      "Tariff & Trade Advisory",
      "Post-clearance Support"
    ],
    regulations: ["World Customs Organization (WCO)", "Local Port Authority Rules", "Excise & Duty Guidelines"]
  },
  "temperature-controlled": {
    title: "Temperature Controlled",
    subtitle: "Preserving Integrity, Every Degree Matters",
    icon: Warehouse,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    description: "End-to-end cold chain solutions for sensitive biological, chemical, and pharmaceutical materials. We use state-of-the-art monitoring to ensure consistent environment control.",
    detailedInfo: "Our warehousing and transport solutions for temperature-sensitive goods include active cooling systems and passive insulation technologies, backed by 24/7 temperature data logging.",
    features: [
      "Biological Specimen Transport",
      "Chemical Stability Storage",
      "Cold Chain Monitoring (Real-time)",
      "Insulated Packing Solutions",
      "Refrigerated Trucking (Reefer)",
      "Strict Climate Integrity Protocols"
    ],
    regulations: ["GDP (Good Distribution Practice)", "Pharma Safety Standards", "Chemical Storage Codes"]
  }
};

export default function ServicePage() {
  const params = useParams();
  const slug = params.slug as string;
  const data = serviceData[slug];

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Service Not Found</h1>
          <a href="/services" className="text-primary hover:underline">Back to Services</a>
        </div>
      </div>
    );
  }

  const Icon = data.icon;

  return (
    <main className="min-h-screen bg-slate-50 font-body">
      <Navbar />
      
      {/* Hero Header */}
      <section className={cn("pt-40 pb-20 mt-16 transition-colors duration-500", data.bgColor)}>
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn("w-24 h-24 rounded-3xl flex items-center justify-center bg-white shadow-xl", data.color)}
            >
              <Icon size={48} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h4 className={cn("text-sm font-bold uppercase tracking-widest mb-2", data.color)}>{data.subtitle}</h4>
              <h1 className="text-5xl md:text-7xl font-bold font-heading text-slate-900">{data.title}</h1>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Left Column: Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold mb-8 font-heading text-slate-900">Overview</h2>
              <p className="text-xl text-slate-600 leading-relaxed mb-8">
                {data.description}
              </p>
              <p className="text-lg text-slate-500 leading-relaxed mb-12">
                {data.detailedInfo}
              </p>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold font-heading">Key Capabilities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.features.map((feature: string, i: number) => (
                    <div key={i} className="flex items-center space-x-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                      <CheckCircle2 size={20} className={data.color} />
                      <span className="font-medium text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Column: Cards & Regs */}
            <div className="space-y-12">
              {/* Compliance Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-slate-900 text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <AlertTriangle size={150} />
                </div>
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold mb-6 font-heading text-primary">Compliance First</h3>
                  <p className="text-slate-400 mb-8 text-lg">
                    We strictly adhere to international safety standards to ensure your cargo is handled without risk or regulatory hurdles.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {data.regulations.map((reg: string, i: number) => (
                      <span key={i} className="bg-white/10 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-tight">
                        {reg}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Support Card */}
              <div className="bg-white p-12 rounded-[3.5rem] shadow-premium border border-slate-100 grid grid-cols-2 gap-8">
                <div className="text-center p-6 bg-slate-50 rounded-3xl">
                  <Globe className="mx-auto mb-4 text-secondary" size={32} />
                  <div className="text-2xl font-bold">180+</div>
                  <div className="text-sm text-slate-500 font-bold uppercase">Countries</div>
                </div>
                <div className="text-center p-6 bg-slate-50 rounded-3xl">
                  <Truck className="mx-auto mb-4 text-primary" size={32} />
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-sm text-slate-500 font-bold uppercase">Monitoring</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="container mx-auto px-6 text-center">
          <div className="bg-white p-16 rounded-[4rem] shadow-premium border border-slate-100 max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 font-heading">Ready to ship?</h2>
            <p className="text-slate-500 text-xl mb-12">Get an expert consultation and book your {data.title.toLowerCase()} service today.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link href="/book" prefetch className="red-gradient text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-premium text-center">Book Service</Link>
              <Link href="/contact" prefetch className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-premium text-center">Contact Experts</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
