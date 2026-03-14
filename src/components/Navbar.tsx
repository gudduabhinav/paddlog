"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Track", href: "/track" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isDarkHeaderPage = pathname === '/' || pathname === '/book' || pathname === '/services' || pathname === '/track';
  const useLightText = isDarkHeaderPage && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled
          ? "bg-[#0a0f1e]/80 backdrop-blur-md shadow-premium py-3 border-b border-white/5"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center group relative h-12 md:h-16 w-[180px] md:w-[250px]">
          <img
            src="/logo.png"
            alt="Paddlog Logo"
            className="absolute top-1/2 -translate-y-1/2 left-0 h-[100px] md:h-[160px] w-auto object-contain transition-all duration-300 drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)] filter contrast-[1.5] saturate-[1.2] group-hover:scale-105"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "font-medium transition-colors relative group",
                  isActive 
                    ? "text-primary font-bold" 
                    : useLightText || isScrolled
                        ? "text-white/80 hover:text-white" 
                        : "text-foreground/80 hover:text-primary"
                )}
              >
                {link.name}
                <span className={cn(
                  "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all",
                  isActive ? "w-full" : "w-0 group-hover:w-full"
                )} />
              </Link>
            );
          })}
          <Link
            href="/book"
            className="red-gradient text-white px-6 py-2.5 rounded-full font-semibold shadow-premium hover:shadow-red-glow transition-all hover:scale-105 active:scale-95"
          >
            Book Service
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={cn("md:hidden transition-colors", (useLightText || isScrolled) ? "text-white" : "text-secondary")}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0a0f1e]/95 backdrop-blur-xl mt-4 rounded-2xl shadow-xl overflow-hidden border border-white/10"
          >
            <div className="flex flex-col p-6 space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "text-lg transition-colors px-4 py-3 rounded-xl",
                      isActive 
                        ? "text-primary font-bold bg-primary/10" 
                        : "text-white/80 font-medium hover:text-primary hover:bg-white/5"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <Link
                href="/book"
                className="red-gradient text-white text-center py-3 rounded-xl font-bold"
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
