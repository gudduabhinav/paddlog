import type { Metadata } from "next";
import { Poppins, Roboto } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Paddlog DG Solutions | Professional Logistics services",
  description: "Dangerous Goods logistics, packaging, freight forwarding, customs clearance, and warehousing services.",
};

import { FloatingActions, ScrollProgress } from "@/components/FloatingActions";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${poppins.variable} ${roboto.variable} font-body antialiased`}
      >
        <ScrollProgress />
        {children}
        <FloatingActions />
      </body>
    </html>
  );
}

