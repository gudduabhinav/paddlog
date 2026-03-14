"use client";

import React from "react";
import Link from "next/link";
import { Rocket, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <div className="space-y-6">
            <Link href="/" className="inline-block transition-all duration-300 hover:scale-110 active:scale-95">
              <img
                src="/logo.png"
                alt="Paddlog Logo"
                className="h-[120px] md:h-[180px] w-auto object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.95)]"
              />
            </Link>
            <p className="text-slate-400 leading-relaxed">
              Hyderabad born, globally focused. Experts in specialized dangerous goods logistics,
              ensuring safe, compliant, and efficient transport of high-stakes cargo worldwide.
            </p>
            <div className="flex space-x-4">
              <SocialIcon icon={<Facebook size={20} />} href="#" />
              <SocialIcon icon={<Twitter size={20} />} href="#" />
              <SocialIcon icon={<Linkedin size={20} />} href="#" />
              <SocialIcon icon={<Instagram size={20} />} href="#" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Services</h4>
            <ul className="space-y-4">
              <FooterLink href="/services/un-certified-packaging" text="UN Certified Packaging" />
              <FooterLink href="/services/dg-packing-dgd" text="DG Packing & DGD" />
              <FooterLink href="/services/technical-packing" text="Technical Packing" />
              <FooterLink href="/services/freight-forwarding" text="Freight Forwarding" />
              <FooterLink href="/services/temperature-controlled" text="Temperature Controlled" />
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Company</h4>
            <ul className="space-y-4">
              <FooterLink href="/about" text="About Us" />
              <FooterLink href="/contact" text="Contact Experts" />
              <FooterLink href="/track" text="Track Shipment" />
              <FooterLink href="/blog" text="Blog" />
              <FooterLink href="#" text="Privacy Policy" />
              <FooterLink href="#" text="Terms of Service" />
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4 mb-6">
              <li className="flex items-start space-x-3">
                <MapPin className="text-primary mt-1 flex-shrink-0" size={18} />
                <span>Gachibowli, Serilingampalle, Hyderabad, 500032</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="text-primary flex-shrink-0" size={18} />
                <span>sales@paddlog.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="text-primary flex-shrink-0" size={18} />
                <span>+91 7386107071</span>
              </li>
            </ul>
            <a
              href="https://maps.app.goo.gl/SZ5RhwhaEhLr8pC77"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 w-full bg-slate-800 hover:bg-slate-700 text-white px-4 py-3 rounded-xl border border-slate-700 hover:border-primary transition-all duration-300 group"
            >
              <MapPin size={18} className="text-primary group-hover:animate-bounce" />
              <span className="font-semibold text-sm">View on Google Maps</span>
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>© {currentYear} Paddlog DG Solutions. All rights reserved.</p>
          <p>Created by Professional Design Team</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, text }: { href: string; text: string }) {
  return (
    <li>
      <Link href={href} className="hover:text-primary transition-colors duration-200 block">
        {text}
      </Link>
    </li>
  );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <a
      href={href}
      className="bg-slate-800 p-2 rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
    >
      {icon}
    </a>
  );
}
