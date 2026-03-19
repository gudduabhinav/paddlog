"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Headphones } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Reviews", href: "/#testimonials" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // ONLY service detail pages have dark heroes. Support and Book pages are light.
  const isServiceDetailPage = pathname?.startsWith("/services/");
  const forceDarkBg = isServiceDetailPage && pathname !== "/services"; 

  const currentPath =
    pathname && pathname !== "/" ? pathname.replace(/\/$/, "") : pathname;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[999] transition-all duration-300 px-6",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md py-4 border-b border-slate-200"
          : "bg-transparent py-8"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        <Link href="/" className="inline-flex items-center group shrink-0 relative z-10 transition-opacity hover:opacity-80">
          <img
            src="/paddlog-logo-nav.png" 
            alt="Paddlog"
            className="h-10 md:h-12 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-7 relative z-10">
          {navLinks.map((link) => {
            const isActive =
              currentPath === link.href ||
              (link.href !== "/" && currentPath?.startsWith(link.href));
            
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "font-black text-[10px] uppercase tracking-[0.22em] transition-all duration-300",
                  isScrolled
                    ? isActive ? "text-primary scale-110" : "text-slate-900 hover:text-primary"
                    : isActive ? "text-primary scale-110" : (forceDarkBg ? "text-white/80 hover:text-white" : "text-slate-900 hover:text-primary")
                )}
              >
                {link.name}
              </Link>
            );
          })}
          
          <div className="flex items-center gap-6 ml-4">
             <Link
              href="/support"
              className={cn(
                "flex items-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105 cursor-pointer relative z-[1001]",
                isScrolled || !forceDarkBg ? "text-slate-900" : "text-white"
              )}
            >
              <Headphones size={16} className="text-primary flex-shrink-0" />
              <span className="whitespace-nowrap border-b-2 border-primary/20 hover:border-primary transition-colors pb-0.5">24/7 SUPPORT</span>
            </Link>

            <Link
              href="/book"
              className="red-gradient text-white px-10 py-4 rounded-xl font-black uppercase tracking-[0.15em] text-[10px] shadow-[0_15px_35px_-10px_rgba(239,68,68,0.4)] hover:shadow-red-500/50 hover:-translate-y-0.5 transition-all active:scale-95 whitespace-nowrap relative z-[1001]"
            >
              Book Service
            </Link>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={cn(
            "lg:hidden p-3 rounded-xl transition-colors relative z-[1100]",
            isScrolled || !forceDarkBg ? "text-slate-900 bg-slate-100" : "text-white bg-white/10"
          )}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="lg:hidden fixed inset-0 bg-white z-[1050] p-8 flex flex-col justify-center gap-6 text-center"
          >
             <button
              className="absolute top-12 right-12 p-3 text-slate-900 bg-slate-50 rounded-full"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={32} />
            </button>

            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-4xl font-black uppercase tracking-widest text-slate-900 active:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="pt-10 border-t border-slate-100 mt-6 space-y-8">
               <Link
                href="/support"
                className="flex items-center justify-center gap-4 font-black text-2xl uppercase tracking-widest text-slate-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <Headphones size={24} strokeWidth={3} />
                </div>
                <span>Global Support</span>
              </Link>
              <Link
                href="/book"
                className="red-gradient text-white text-center py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-sm block shadow-2xl mx-6"
                onClick={() => setMobileMenuOpen(false)}
              >
                Book Service
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
