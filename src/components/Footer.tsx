"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 text-slate-600 pt-8 pb-4 border-t border-slate-200">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-6">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center group mb-2">
              <div className="flex items-center justify-center h-12 w-auto overflow-hidden bg-transparent transition-transform duration-300 group-hover:scale-[1.03]">
                <img
                  src="/paddlog-logo.png"
                  alt="Paddlog Logo"
                  className="h-full w-auto object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-slate-500 leading-relaxed text-sm font-medium pr-4">
              Hyderabad born, globally focused. Experts in specialized dangerous goods logistics,
              ensuring safe, compliant, and efficient transport of high-stakes cargo worldwide.
            </p>
            <div className="flex space-x-4 pt-4">
              <SocialIcon icon={<Facebook size={18} />} href="#" />
              <SocialIcon icon={<Twitter size={18} />} href="#" />
              <SocialIcon icon={<Linkedin size={18} />} href="#" />
              <SocialIcon icon={<Instagram size={18} />} href="#" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-900 font-bold text-lg mb-8 tracking-tight">Services</h4>
            <ul className="space-y-4">
              <FooterLink href="/services/un-certified-packaging" text="UN Certified Packaging" />
              <FooterLink href="/services/dg-packing-dgd" text="DG Packing & DGD" />
              <FooterLink href="/services/technical-packing" text="Aeroparts & Special Packing" />
              <FooterLink href="/services/freight-forwarding" text="Freight Forwarding" />
              <FooterLink href="/services/temperature-controlled" text="Warehousing & Storage" />
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h4 className="text-slate-900 font-bold text-lg mb-8 tracking-tight">Global Reach</h4>
            <ul className="space-y-5">
              <li className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Head Office</p>
                <p className="text-sm font-semibold text-slate-800">Hyderabad (HQ)</p>
              </li>

              <li className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Branches</p>
                <p className="text-sm font-semibold text-slate-600">
                  Bangalore &bull; Mumbai &bull; Chennai &bull; Gujarat
                </p>
              </li>

              <li className="flex flex-col gap-3 pt-1">
                <Link href="/about" className="text-primary font-bold text-xs hover:underline">
                  About Our Journey
                </Link>
                <Link href="/support" className="text-slate-500 font-bold text-xs hover:text-primary">
                  24/7 Global Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-slate-900 font-bold text-lg mb-8 tracking-tight">Expert Help</h4>
            <ul className="space-y-5 mb-8">
              <li className="flex items-start space-x-4">
                <MapPin className="text-primary mt-1 flex-shrink-0" size={18} />
                <span className="font-semibold text-slate-800 text-sm leading-relaxed">
                  Gachibowli, Serilingampalle,
                  <br />
                  Hyderabad, 500032
                </span>
              </li>
              <li className="flex flex-col space-y-3">
                <div className="flex items-center space-x-4">
                  <Mail className="text-primary flex-shrink-0" size={18} />
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-700 text-xs">Hydops@paddlog.com</span>
                    <span className="font-bold text-slate-700 text-xs">Blrops@paddlog.com</span>
                  </div>
                </div>
              </li>
              <li className="flex items-center space-x-4">
                <Phone className="text-primary flex-shrink-0" size={18} />
                <div className="flex flex-col font-bold text-slate-800 text-xs">
                  <span>Hyderabad: 7093777026</span>
                  <span>Bangalore: 7386107071</span>
                </div>
              </li>
            </ul>
            <a
              href="https://maps.app.goo.gl/SZ5RhwhaEhLr8pC77"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-3 w-full bg-slate-900 text-white px-5 py-4 rounded-xl shadow-2xl hover:bg-slate-800 transition-all duration-300 group"
            >
              <MapPin size={18} className="text-primary group-hover:animate-bounce" />
              <span className="font-black text-[10px] uppercase tracking-widest">Get Directions</span>
            </a>
          </div>
        </div>

        {/* Improved Bottom Section */}
        <div className="pt-4 border-t border-slate-100 pb-4">
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <div>
              <div className="text-slate-400 text-xs font-semibold">
                &copy; {currentYear} Paddlog DG Solutions. All rights reserved.
              </div>
              <div className="text-primary font-bold text-[10px] uppercase tracking-[0.25em] mt-1">
                Premium Logistics Engineering
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, text }: { href: string; text: string }) {
  return (
    <li>
      <Link
        href={href}
        className="text-slate-500 font-medium text-sm hover:text-primary transition-colors duration-200 block"
      >
        {text}
      </Link>
    </li>
  );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <a
      href={href}
      className="bg-white border border-slate-200 p-3 rounded-xl text-slate-400 hover:text-primary hover:border-primary hover:shadow-xl transition-all duration-300"
    >
      {icon}
    </a>
  );
}
