"use client";

import { useState } from "react";
import { Sparkles, ShieldCheck, Scale, Repeat } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ShoppingCartSidebar from "../components/cart/ShoppingCart";

const termSections = [
  {
    title: "Orders & Pricing",
    copy: [
      "All prices include GST and are listed in INR. International checkout previews duties before payment.",
      "Custom commissions require a 50% deposit; once production begins, this deposit is transferred to studio labor.",
      "We may cancel orders that look fraudulent or misuse inventory, with a full refund.",
    ],
  },
  {
    title: "Shipping & Risk",
    copy: [
      "Shipments are insured until delivery and require OTP + recipient signature.",
      "Delays from customs or force majeure are communicated promptly, and you receive alternative delivery dates.",
      "Ownership transfers once delivery is confirmed; inspect jewelry immediately and flag concerns within 24 hours.",
    ],
  },
  {
    title: "Returns & Repairs",
    copy: [
      "Initiate returns within 14 days via care@jwellery4u.com; items must be unworn with original tags.",
      "Complimentary repairs cover manufacturing defects for 6 months; normal wear & tear is quoted separately.",
      "We issue studio credits for custom pieces; restyling consultations accompany every return.",
    ],
  },
  {
    title: "Content & Conduct",
    copy: [
      "Editorial photography, CAD files, and copy remain Jwellery4u intellectual property.",
      "Usage of brand assets or scraping site content without permission is strictly prohibited.",
      "Respectful conduct toward our studio staff is expected; we reserve the right to pause service for abuse.",
    ],
  },
];

const highlights = [
  {
    title: "Certified Promise",
    detail: "Every store visit and checkout flows through secure servers with continuous compliance monitoring.",
    icon: ShieldCheck,
  },
  {
    title: "Transparent Process",
    detail: "We list shipping, returns, and repair windows clearly before you confirm payment.",
    icon: Scale,
  },
  {
    title: "Fine Print Minimalism",
    detail: "No hidden fees—just curated premium service with direct concierge support.",
    icon: Sparkles,
  },
];

const pillars = [
  {
    label: "Provision",
    desc: "Detailed quotes, marriage of hand sketches and CAD, and clear delivery dates.",
  },
  {
    label: "Protection",
    desc: "Insurance, hallmarks, and lifetime engraving records.",
  },
  {
    label: "Partnership",
    desc: "Direct stylist access, mindful returns, and privacy-first data handling.",
  },
];

export default function TermsPage() {
  const [showCart, setShowCart] = useState(false);

  return (
    <>
      <Navbar onCartOpen={() => setShowCart(true)} />
      <main className="bg-gray-50">
        <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 py-20">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-10 right-10 h-64 w-64 bg-amber-200 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-64 w-64 bg-rose-200 blur-3xl" />
          </div>
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <p className="text-sm font-semibold text-amber-600 uppercase tracking-[0.5em]">Terms of Service</p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              The fine print for fine jewelry, written simply.
            </h1>
            <p className="text-lg text-gray-600">
              Updated May 2025. These terms describe our commitments to you—from the atelier to the delivery chaperone.
            </p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
          <div className="grid md:grid-cols-3 gap-6">
            {highlights.map((item) => (
              <div key={item.title} className="bg-white rounded-[32px] border border-gray-100 shadow-xl p-6 space-y-4">
                <item.icon size={28} className="text-amber-500" />
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.detail}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6">
            {termSections.map((section) => (
              <article
                key={section.title}
                className="bg-white rounded-[32px] border border-gray-100 shadow-lg p-8"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-amber-500">{section.title}</p>
                  </div>
                  <Sparkles className="text-gray-300" />
                </div>
                <ul className="mt-5 space-y-3 text-gray-600 list-decimal pl-5">
                  {section.copy.map((line, idx) => (
                    <li key={`${section.title}-${idx}`}>{line}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-[40px] p-10 shadow-2xl border border-white/10 space-y-8">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-amber-300">Studio pillars</p>
                <h2 className="mt-2 text-3xl font-bold">Your commitment partner</h2>
                <p className="mt-3 text-gray-300">
                  We translate etiquette, compliance, and delight into every interaction: capturing details, providing
                  clarity, and honoring boldest requests.
                </p>
              </div>
              <div className="bg-white/10 px-5 py-3 rounded-full flex items-center gap-2 text-amber-200">
                <Repeat size={18} />
                <span className="text-sm font-semibold">Concierge first response</span>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {pillars.map((pillar) => (
                <div key={pillar.label} className="bg-white/10 border border-white/20 rounded-3xl p-5">
                  <p className="text-sm uppercase tracking-[0.3em] text-gray-300">{pillar.label}</p>
                  <p className="mt-3 text-sm text-gray-200">{pillar.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <ShoppingCartSidebar isOpen={showCart} onClose={() => setShowCart(false)} />
      <Footer />
    </>
  );
}

