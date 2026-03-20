"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Building2, Globe2, Mail, MapPin, Phone } from "lucide-react";

type Office = {
  city: string;
  tag: string;
  address: string[];
  summary: string;
  contactPhone?: string;
  contactEmail?: string;
  featured?: boolean;
};

type OfficeNetworkProps = {
  className?: string;
};

const offices: Office[] = [
  {
    city: "Hyderabad",
    tag: "Head Branch",
    address: ["Gachibowli, Serilingampalle,", "Hyderabad, 500032"],
    summary:
      "Central coordination point for compliance, documentation, and dangerous goods movement across domestic and international lanes.",
    contactPhone: "7093777026",
    contactEmail: "Hydops@paddlog.com",
    featured: true,
  },
  {
    city: "Mumbai",
    tag: "Branch Office",
    address: ["Mumbai, Maharashtra, India"],
    summary: "Key gateway for western India cargo movements and time-critical export handling.",
  },
  {
    city: "Chennai",
    tag: "Branch Office",
    address: ["Chennai, Tamil Nadu, India"],
    summary: "Port-connected branch supporting South India industrial and DG cargo movement.",
  },
  {
    city: "Bangalore",
    tag: "Branch Office",
    address: ["Bangalore, Karnataka, India"],
    summary: "Strategic support point for biotech, aviation parts, and high-value technical shipments.",
    contactPhone: "7386107071",
    contactEmail: "Blrops@paddlog.com",
  },
  {
    city: "Gujarat",
    tag: "Branch Office",
    address: ["Gujarat, India"],
    summary: "Dedicated branch coverage for manufacturing clusters and industrial freight corridors.",
  },
];

const regions = ["Europe", "USA", "Middle East", "Southeast Asia", "Africa", "Australia"];

export function OfficeNetwork({ className = "" }: OfficeNetworkProps) {
  const headOffice = offices.find((office) => office.featured);
  const branchOffices = offices.filter((office) => !office.featured);

  return (
    <div className={`grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 ${className}`.trim()}>
      <div className="rounded-[2.2rem] border border-slate-200 bg-white/75 p-4 shadow-[0_24px_60px_rgba(148,163,184,0.16)] backdrop-blur-sm sm:p-6">
        {headOffice ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-6 overflow-hidden rounded-[2rem] border border-[#E53935]/15 bg-[linear-gradient(135deg,rgba(229,57,53,0.08),rgba(255,255,255,0.96)_42%,rgba(37,99,235,0.06))] p-6 shadow-[0_24px_55px_rgba(148,163,184,0.18)] sm:p-8"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#E53935]/15 bg-white/85 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-[#E53935] shadow-sm">
                  <Building2 size={14} />
                  Command Center
                </div>
                <div className="text-3xl font-bold uppercase tracking-tight text-slate-900 sm:text-[2.1rem]">
                  {headOffice.city}
                </div>
                <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.28em] text-[#E53935]">
                  {headOffice.tag}
                </div>
                <p className="mt-4 max-w-lg text-sm font-medium leading-relaxed text-slate-600 sm:text-[15px]">
                  {headOffice.summary}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 lg:min-w-[260px]">
                <InfoChip icon={<MapPin size={16} className="text-[#E53935]" />} label="Location">
                  {headOffice.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </InfoChip>
                <InfoChip icon={<Phone size={16} className="text-[#E53935]" />} label="Contact">
                  {headOffice.contactPhone}
                  <span className="mt-1 block text-xs font-medium text-slate-500">{headOffice.contactEmail}</span>
                </InfoChip>
              </div>
            </div>
          </motion.div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {branchOffices.map((office, i) => (
            <motion.div
              key={office.city}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="group rounded-[1.8rem] border border-slate-200 bg-white/90 p-6 transition-all hover:-translate-y-1 hover:border-[#E53935]/25 hover:bg-white hover:shadow-[0_24px_50px_rgba(148,163,184,0.18)]"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <div className="text-[1.7rem] font-bold uppercase tracking-tight text-slate-900 transition-colors group-hover:text-[#E53935]">
                    {office.city}
                  </div>
                  <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.28em] text-[#E53935]">
                    {office.tag}
                  </div>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-[#E53935] shadow-sm">
                  <MapPin size={18} />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium leading-relaxed text-slate-500">
                  {office.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
                <p className="text-sm font-medium leading-relaxed text-slate-500">{office.summary}</p>
                {office.contactPhone || office.contactEmail ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
                    {office.contactPhone ? (
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Phone size={14} className="text-[#E53935]" />
                        {office.contactPhone}
                      </div>
                    ) : null}
                    {office.contactEmail ? (
                      <div className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-500 break-all">
                        <Mail size={14} className="text-[#E53935]" />
                        {office.contactEmail}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="rounded-[2.2rem] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(239,246,255,0.92))] p-6 shadow-[0_24px_60px_rgba(148,163,184,0.16)] sm:p-8">
        <div className="max-w-md">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500 shadow-sm">
            <Globe2 size={14} className="text-[#E53935]" />
            Operating Corridors
          </div>
          <h3 className="mt-4 text-3xl font-bold uppercase tracking-tight text-slate-900">
            Branch Network With Global Routing
          </h3>
          <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500 sm:text-[15px]">
            Local branch support across India, backed by an active partner footprint spanning major import and export corridors.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {regions.map((region) => (
            <span
              key={region}
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.22em] text-slate-600 shadow-sm transition-all hover:border-[#E53935] hover:bg-[#E53935] hover:text-white"
            >
              {region}
            </span>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
          <StatSmall value="50+" label="Countries" />
          <StatSmall value="200+" label="Partners" />
          <StatSmall value="24/7" label="Uplink" />
        </div>
      </div>
    </div>
  );
}

function InfoChip({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-slate-900">
        {icon}
        <span className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">{label}</span>
      </div>
      <div className="text-sm font-semibold text-slate-700">{children}</div>
    </div>
  );
}

function StatSmall({ value, label }: { value: string; label: string }) {
  return (
    <div className="min-w-0 rounded-[2rem] border border-slate-200 bg-white/80 p-3 text-center shadow-[0_20px_50px_rgba(148,163,184,0.14)] transition-all hover:border-[#E53935]/50 sm:p-8">
      <div className="mb-1 text-2xl font-bold uppercase tracking-tighter leading-none text-slate-900 sm:text-3xl">{value}</div>
      <div className="break-words text-[9px] font-bold uppercase leading-tight tracking-[0.12em] text-slate-500 sm:text-[10px] sm:tracking-[0.2em]">
        {label}
      </div>
    </div>
  );
}
