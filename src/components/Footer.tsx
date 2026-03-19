"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 text-slate-600 pt-20 pb-10 border-t border-slate-200">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <div className="space-y-1">
            <Link href="/" className="inline-flex items-center group mb-4">
              <div className="flex items-center justify-center h-16 md:h-18 w-auto overflow-hidden bg-transparent transition-transform duration-300 group-hover:scale-[1.03]">
                <img
                  src="/paddlog-logo.png"
                  alt="Paddlog Logo"
                  className="h-full w-auto object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-slate-500 leading-relaxed -mt-2 uppercase text-[10px] font-bold tracking-tight">
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
            <h4 className="text-slate-900 font-black text-lg mb-6 uppercase tracking-wider">Services</h4>
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
            <h4 className="text-slate-900 font-black text-lg mb-6 uppercase tracking-wider">Company</h4>
            <ul className="space-y-4">
              <FooterLink href="/about" text="About Us" />
              <FooterLink href="/support" text="24/7 Support" />
              <FooterLink href="/contact" text="Contact Experts" />
              <FooterLink href="/blog" text="Blog" />
              <FooterLink href="#" text="Privacy Policy" />
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-slate-900 font-black text-lg mb-6 uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-4 mb-6">
              <li className="flex items-start space-x-3">
                <MapPin className="text-primary mt-1 flex-shrink-0" size={18} />
                <span className="font-bold text-slate-700 text-sm">Gachibowli, Serilingampalle, Hyderabad, 500032</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="text-primary flex-shrink-0" size={18} />
                <span className="font-bold text-slate-700 text-sm">sales@paddlog.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="text-primary flex-shrink-0" size={18} />
                <div className="flex flex-col font-bold text-slate-700 text-sm">
                  <span>+91 7386107071</span>
                  <span>+91 7386444710</span>
                </div>
              </li>
            </ul>
            <a
              href="https://maps.app.goo.gl/SZ5RhwhaEhLr8pC77"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 w-full bg-slate-900 text-white px-4 py-4 rounded-xl shadow-lg hover:bg-slate-800 transition-all duration-300 group"
            >
              <MapPin size={18} className="text-primary group-hover:animate-bounce" />
              <span className="font-black text-[10px] uppercase tracking-widest">View on Google Maps</span>
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col items-center gap-2 text-center text-sm text-slate-400">
          <p className="font-bold">&copy; {currentYear} Paddlog DG Solutions. All rights reserved.</p>
          <p className="font-black text-[10px] uppercase tracking-[0.2em] text-primary">Premium Logistics Design</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, text }: { href: string; text: string }) {
  return (
    <li>
      <Link href={href} className="text-slate-500 font-bold text-sm hover:text-primary transition-colors duration-200 block uppercase tracking-tighter">
        {text}
      </Link>
    </li>
  );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <a
      href={href}
      className="bg-white border border-slate-200 p-2.5 rounded-xl text-slate-400 hover:text-primary hover:border-primary hover:shadow-lg transition-all duration-300"
    >
      {icon}
    </a>
  );
}
