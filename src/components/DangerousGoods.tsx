"use client";

import React from "react";
import { motion } from "framer-motion";

const dgClasses = [
  {
    id: 1,
    title: "Explosives",
    description: "Substances and articles which have a mass explosion hazard.",
    color: "#ff8c00",
    symbol: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <path d="M50 5 L95 50 L50 95 L5 50 Z" fill="#ff8c00" stroke="black" strokeWidth="1.5"/>
        <path d="M50 20 L55 35 L65 30 L60 40 L70 45 L58 48 L62 60 L50 50 L38 60 L42 48 L30 45 L40 40 L35 30 L45 35 Z" fill="black" />
        <circle cx="50" cy="45" r="4" fill="black" />
        <text x="50" y="85" textAnchor="middle" fontSize="16" fontWeight="900" fill="black" fontFamily="Arial">1</text>
      </svg>
    )
  },
  {
    id: 2,
    title: "Gases",
    description: "Compressed, liquefied or dissolved under pressure.",
    color: "#007a33",
    symbol: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <path d="M50 5 L95 50 L50 95 L5 50 Z" fill="#007a33" stroke="black" strokeWidth="1.5"/>
        <rect x="42" y="35" width="16" height="30" rx="3" fill="black" />
        <rect x="45" y="28" width="10" height="5" rx="1" fill="black" />
        <text x="50" y="85" textAnchor="middle" fontSize="16" fontWeight="900" fill="white" fontFamily="Arial">2</text>
      </svg>
    )
  },
  {
    id: 3,
    title: "Flammable Liquids",
    description: "Liquids which give off a flammable vapour.",
    color: "#e20613",
    symbol: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <path d="M50 5 L95 50 L50 95 L5 50 Z" fill="#e20613" stroke="black" strokeWidth="1.5"/>
        <path d="M50 20 Q65 45 50 65 Q35 45 50 20" fill="white" />
        <path d="M50 35 Q58 50 50 60 Q42 50 50 35" fill="#e20613" />
        <text x="50" y="85" textAnchor="middle" fontSize="16" fontWeight="900" fill="white" fontFamily="Arial">3</text>
      </svg>
    )
  },
  {
    id: 4,
    title: "Flammable Solids",
    description: "Solids which are readily combustible.",
    color: "#00adef",
    symbol: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <path d="M50 5 L95 50 L50 95 L5 50 Z" fill="#00adef" stroke="black" strokeWidth="1.5"/>
        <path d="M50 20 Q65 45 50 65 Q35 45 50 20" fill="black" />
        <path d="M50 35 Q58 50 50 60 Q42 50 50 35" fill="#00adef" />
        <text x="50" y="85" textAnchor="middle" fontSize="16" fontWeight="900" fill="white" fontFamily="Arial">4</text>
      </svg>
    )
  },
  {
    id: 5,
    title: "Oxidizing",
    description: "Substances which yield oxygen and contribute to combustion.",
    color: "#fff200",
    symbol: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <path d="M50 5 L95 50 L50 95 L5 50 Z" fill="#fff200" stroke="black" strokeWidth="1.5"/>
        <circle cx="50" cy="50" r="10" stroke="black" strokeWidth="2.5" fill="none" />
        <path d="M50 32 Q55 40 50 45 Q45 40 50 32" fill="black" />
        <text x="50" y="85" textAnchor="middle" fontSize="16" fontWeight="900" fill="black" fontFamily="Arial">5</text>
      </svg>
    )
  },
  {
    id: 6,
    title: "Toxic",
    description: "Substances liable either to cause death or serious injury.",
    color: "#ffffff",
    symbol: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <path d="M50 5 L95 50 L50 95 L5 50 Z" fill="#ffffff" stroke="black" strokeWidth="1.5"/>
        <circle cx="50" cy="40" r="10" fill="black" />
        <path d="M35 55 Q50 45 65 55 M65 55 L35 55 Z" fill="black" />
        <path d="M40 38 L44 38 M56 38 L60 38" stroke="white" strokeWidth="2" />
        <text x="50" y="85" textAnchor="middle" fontSize="16" fontWeight="900" fill="black" fontFamily="Arial">6</text>
      </svg>
    )
  },
  {
    id: 7,
    title: "Radioactive",
    description: "Substances containing radionuclides which emit radiation.",
    color: "#fff200",
    symbol: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <path d="M50 5 L95 50 L5 50 Z" fill="#fff200" stroke="black" strokeWidth="1.5"/>
        <path d="M5 50 L50 95 L95 50 Z" fill="#ffffff" stroke="black" strokeWidth="1.5"/>
        <circle cx="50" cy="50" r="5" fill="black" />
        <path d="M50 50 L50 35 A15 15 0 0 1 65 50 Z" fill="black" />
        <path d="M50 50 L63 58 A15 15 0 0 1 55 65 Z" fill="black" />
        <path d="M50 50 L37 58 A15 15 0 0 0 45 65 Z" fill="black" />
        <text x="50" y="85" textAnchor="middle" fontSize="16" fontWeight="900" fill="black" fontFamily="Arial">7</text>
      </svg>
    )
  },
  {
    id: 8,
    title: "Corrosives",
    description: "Chemical action will cause severe damage to living tissue.",
    color: "#ffffff",
    symbol: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <path d="M50 5 L95 50 L5 50 Z" fill="#ffffff" stroke="black" strokeWidth="1.5"/>
        <path d="M5 50 L50 95 L95 50 Z" fill="#000000" stroke="black" strokeWidth="1.5"/>
        <path d="M30 30 L40 40 L44 42 M56 42 L60 40 L70 30" stroke="black" strokeWidth="4" fill="none" />
        <text x="50" y="85" textAnchor="middle" fontSize="16" fontWeight="900" fill="white" fontFamily="Arial">8</text>
      </svg>
    )
  },
  {
    id: 9,
    title: "Miscellaneous",
    description: "Substances which during transport present a danger.",
    color: "#ffffff",
    symbol: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <path d="M50 5 L95 50 L50 95 L5 50 Z" fill="#ffffff" stroke="black" strokeWidth="1.5"/>
        <path d="M25 25 L25 50 M32 18 L32 50 M39 12 L39 50 M46 10 L46 50 M54 10 L54 50 M61 12 L61 50 M68 18 L68 50 M75 25 L75 50" stroke="black" strokeWidth="3" />
        <text x="50" y="85" textAnchor="middle" fontSize="16" fontWeight="900" fill="black" fontFamily="Arial">9</text>
      </svg>
    )
  }
];

export function DangerousGoods() {
  return (
    <section id="dg-classes" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black mb-8 text-slate-900 tracking-tight"
          >
            The 9 Classes of <span className="text-primary italic">Dangerous Goods</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 max-w-4xl mx-auto text-xl leading-relaxed font-bold"
          >
            We are certified specialists in the transportation of all nine United Nations categories of hazardous materials, ensuring 100% regulatory compliance.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {dgClasses.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group bg-slate-50 border border-slate-100 p-8 rounded-[2rem] hover:bg-white hover:shadow-xl transition-all duration-500 flex items-center gap-6"
            >
              <div className="w-20 h-20 flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                {item.symbol}
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Class {item.id}</div>
                <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight">{item.title}</h3>
                <p className="text-slate-500 text-xs font-bold leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
