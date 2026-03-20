import Link from "next/link";
import { ArrowRight, Quote, ShieldCheck, Star } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const testimonials = [
  {
    quote:
      "We have been working with Paddlog DG Solutions for the past 3 years, and they consistently set the benchmark in dangerous goods logistics with unmatched expertise, precision, and reliability.",
    name: "Phani Kumar Varanasi",
    title: "Managing Director",
    company: "Hanbit Automations",
    accent: "Long-Term Partnership",
    logo: "/reviews-logos/hanbit.png",
    logoAlt: "Hanbit Automations logo",
    logoFrameClass: "bg-slate-900 border-slate-900",
    logoClass: "h-7 w-auto opacity-95",
  },
  {
    quote:
      "We rely on Paddlog DG Solutions for our mixed chemical shipments, and they consistently deliver safe, compliant, and highly reliable DG logistics support.",
    name: "Saroj Purohit",
    title: "AGM",
    company: "Density Pharma",
    accent: "Chemical Logistics",
    logo: "/reviews-logos/density.png",
    logoAlt: "Density Pharma logo",
    logoFrameClass: "border-slate-200 bg-white",
    logoClass: "h-10 w-auto",
  },
  {
    quote:
      "We rely on Paddlog DG Solutions for our aeroparts packing and shipping, and they consistently deliver precise, compliant services in full accordance with ATA standards.",
    name: "Shantanu Shastry",
    company: "Gnat Aviation",
    accent: "Aviation Precision",
    logo: "/reviews-logos/gnat-candidate-2.jpg",
    logoAlt: "Gnat Aviation logo",
    logoFrameClass: "border-slate-200 bg-white",
    logoClass: "h-12 w-auto",
  },
];

const proofPoints = [
  { value: "3 Years", label: "Trusted Continuity" },
  { value: "Mixed DG", label: "Chemical Shipments" },
  { value: "ATA", label: "Aligned Packing" },
];

export default function ReviewsPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8f4f0_0%,#fdfcfa_38%,#ffffff_100%)]">
      <Navbar />

      <section className="relative overflow-hidden px-6 pb-16 pt-36 md:pb-24 md:pt-44">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(225,29,72,0.08),transparent_42%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.08),transparent_32%)]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/80 px-5 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-primary shadow-[0_18px_45px_-30px_rgba(15,23,42,0.45)] backdrop-blur-sm">
              <ShieldCheck size={14} />
              Verified Client Reviews
            </div>

            <h1 className="text-5xl font-black tracking-tight text-slate-900 md:text-7xl">
              Real Feedback From Teams Moving
              <span className="block text-primary"> High-Stakes Cargo.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed text-slate-600 md:text-xl">
              These are direct client endorsements from long-term partners across automation, pharma, and aviation logistics.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3">
            {proofPoints.map((point) => (
              <div
                key={point.label}
                className="rounded-[2rem] border border-slate-200/80 bg-white/85 p-6 text-center shadow-[0_24px_60px_-36px_rgba(15,23,42,0.35)] backdrop-blur-sm"
              >
                <div className="text-3xl font-black tracking-tight text-slate-900">{point.value}</div>
                <div className="mt-2 text-[11px] font-black uppercase tracking-[0.24em] text-slate-500">
                  {point.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-16 md:pb-24">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            {testimonials.map((testimonial, index) => (
              <article
                key={testimonial.name}
                className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_28px_80px_-40px_rgba(15,23,42,0.38)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_34px_90px_-42px_rgba(225,29,72,0.35)] md:p-10"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-rose-400 to-blue-500" />
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div className="inline-flex rounded-full bg-primary/8 px-4 py-2 text-[10px] font-black uppercase tracking-[0.26em] text-primary">
                    {testimonial.accent}
                  </div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star key={starIndex} size={16} className="fill-current" />
                    ))}
                  </div>
                </div>

                <div className={`mb-6 inline-flex min-h-[72px] items-center rounded-[1.5rem] border px-5 py-4 shadow-sm ${testimonial.logoFrameClass}`}>
                  <img
                    src={testimonial.logo}
                    alt={testimonial.logoAlt}
                    className={testimonial.logoClass}
                  />
                </div>

                <Quote size={40} className="mb-5 text-primary/80" />

                <p className="text-xl font-medium leading-relaxed text-slate-700 md:text-[1.65rem] md:leading-[1.55]">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                <div className="mt-8 flex items-center gap-4 border-t border-slate-100 pt-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-lg font-black text-white">
                    {testimonial.name
                      .split(" ")
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="text-xl font-black tracking-tight text-slate-900">{testimonial.name}</div>
                    {testimonial.title ? (
                      <div className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
                        {testimonial.title}
                      </div>
                    ) : null}
                    <div className="mt-1 text-sm font-medium text-slate-600">{testimonial.company}</div>
                  </div>
                </div>

                <div className="absolute bottom-6 right-6 text-[5rem] font-black leading-none text-slate-100">
                  0{index + 1}
                </div>
              </article>
            ))}
          </div>

          <aside className="space-y-8">
            <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-[0_30px_80px_-36px_rgba(15,23,42,0.65)] md:p-10">
              <div className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">Why It Matters</div>
              <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
                Reviews that reflect compliance-first execution.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-300">
                The pattern across these testimonials is consistent: precision, safety, and dependable execution across regulated cargo categories.
              </p>

              <div className="mt-8 space-y-4">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <div className="text-sm font-black uppercase tracking-[0.22em] text-white">Dangerous Goods</div>
                  <div className="mt-2 text-sm leading-relaxed text-slate-300">
                    Clients explicitly call out compliant DG handling and dependable shipment support.
                  </div>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <div className="text-sm font-black uppercase tracking-[0.22em] text-white">Special Packing</div>
                  <div className="mt-2 text-sm leading-relaxed text-slate-300">
                    ATA-aligned aeroparts packing and precise documentation remain a trust driver.
                  </div>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <div className="text-sm font-black uppercase tracking-[0.22em] text-white">Long-Term Reliability</div>
                  <div className="mt-2 text-sm leading-relaxed text-slate-300">
                    Multi-year retention is the strongest signal that operations are stable and repeatable.
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(145deg,#fff8f5_0%,#ffffff_65%)] p-8 shadow-[0_28px_80px_-40px_rgba(15,23,42,0.28)] md:p-10">
              <div className="text-[11px] font-black uppercase tracking-[0.28em] text-primary">Need Similar Support?</div>
              <h3 className="mt-4 text-3xl font-black tracking-tight text-slate-900">
                Talk to the team handling sensitive cargo every day.
              </h3>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                If you need DG packing, documentation, freight forwarding, or specialized aviation logistics, start with a direct conversation.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/book"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-primary px-7 py-4 text-sm font-black uppercase tracking-[0.2em] text-white shadow-[0_20px_45px_-24px_rgba(225,29,72,0.65)] transition-all duration-300 hover:-translate-y-0.5"
                >
                  Book Service
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-4 text-sm font-black uppercase tracking-[0.2em] text-slate-800 transition-colors duration-300 hover:border-slate-900 hover:text-slate-900"
                >
                  Contact Team
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  );
}
