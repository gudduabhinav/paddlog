"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-32 pb-24 container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-6">Terms of <span className="text-primary italic">Service</span></h1>
        <p className="text-slate-500 mb-10">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-secondary mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using the Paddlog DG Solutions website and our dangerous goods logistics services, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary mb-4">2. Services Description</h2>
            <p className="mb-4">
              Paddlog provides specialized logistics services for hazardous materials, including UN certified packaging, freight forwarding, and customs clearance. The exact scope of service will be detailed in the specific booking or service agreement provided upon inquiry.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary mb-4">3. User Responsibilities (Shippers)</h2>
            <p className="mb-4">
              It is the strict responsibility of the shipper (the client) to provide accurate information regarding the Dangerous Goods (DG), including correct UN Numbers, classifications, MSDS, and quantities. Failure to provide accurate information holds Paddlog harmless against any regulatory fines, damages, or legal actions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary mb-4">4. Payment Terms</h2>
            <p className="mb-4">
              Payments for services must be completed as per the invoices issued. We reserve the right to hold shipments if payments are not cleared as per the agreed credit terms or immediate payment terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary mb-4">5. Limitation of Liability</h2>
            <p className="mb-4">
              To the maximum extent permitted by applicable law, Paddlog DG Solutions shall not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly. Any liability is limited strictly per standard Warsaw/Montreal Convention transit liability terms unless additional cargo insurance is purchased.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
