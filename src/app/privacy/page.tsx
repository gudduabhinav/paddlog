"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-32 pb-24 container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-6">Privacy <span className="text-primary italic">Policy</span></h1>
        <p className="text-slate-500 mb-10">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-secondary mb-4">1. Information We Collect</h2>
            <p className="mb-4">
              Paddlog DG Solutions collects information to provide better services to our users. We may collect personal information such as your name, contact information (email address, phone number), and company details when you use our website, particularly when filling out a booking inquiry or contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process your booking requests and provide our dangerous goods logistics services.</li>
              <li>Communicate with you regarding our services, updates, or customer support.</li>
              <li>Improve, personalize, and expand our website and services.</li>
              <li>Send you text messages (SMS/WhatsApp) if you have opted in.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary mb-4">3. Data Sharing and Security</h2>
            <p className="mb-4">
              We do not sell, trade, or otherwise transfer your Personally Identifiable Information to outside parties except to provide our services and comply with the law. We implement a variety of security measures to maintain the safety of your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary mb-4">4. Payment Information</h2>
            <p className="mb-4">
              If making payments through our website (e.g., via Stripe or Razorpay), your payment data is processed by our secure third-party payment processors. We do not store full credit card details on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary mb-4">5. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us at: <br />
              <strong>Email:</strong> sales@paddlog.com <br />
              <strong>Phone:</strong> +91 7386107071 / +91 7386444710
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
