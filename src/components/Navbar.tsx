"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const currentPath =
    pathname && pathname !== "/" ? pathname.replace(/\/$/, "") : pathname;

  const darkHeaderRoots = [
    "/",
    "/about",
    "/services",
    "/book",
    "/track",
    "/blog",
    "/contact",
  ];

  const isDarkHeaderPage = darkHeaderRoots.some(
    (root) =>
      currentPath === root ||
      (root !== "/" && currentPath?.startsWith(`${root}/`))
  );

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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg pt-1 pb-7 border-b border-slate-200"
          : "bg-transparent pt-2 pb-10"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between relative -translate-y-4">
        <Link href="/" className="relative h-24 md:h-28 w-auto flex items-center -ml-4 md:-ml-8">
          <img
            src="/logo.png"
            alt="Paddlog Logo"
            className="h-full w-auto object-contain transition-all duration-300 drop-shadow-lg"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive =
              currentPath === link.href ||
              (link.href !== "/" && currentPath?.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "font-bold text-sm transition-colors tracking-wide",
                  isActive
                    ? "text-red-600"
                    : isScrolled
                      ? "text-slate-900 hover:text-red-600" // WHITE BG = SHARP DARK TEXT
                      : isDarkHeaderPage
                        ? "text-white hover:text-red-400" // DARK BG = SHARP WHITE TEXT
                        : "text-slate-700 hover:text-red-600" // DEFAULT = DARK TEXT
                )}
              >
                {link.name}
              </Link>
            );
          })}
          <Link
            href="/book"
            className="bg-red-600 text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:bg-red-700 transition-all active:scale-95"
          >
            Book Service
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={cn(
            "md:hidden p-2 rounded-lg",
            isScrolled ? "text-slate-900" : isDarkHeaderPage ? "text-white" : "text-slate-900"
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white mt-4 rounded-2xl shadow-2xl border border-slate-100 p-6 flex flex-col gap-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-lg font-bold text-slate-900 px-4 py-2 hover:bg-slate-50 rounded-xl"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/book"
              className="bg-red-600 text-white text-center py-4 rounded-xl font-bold mt-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Book Service
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
