"use client";

import { useState } from "react";
import { Sparkles, ShieldCheck, Scale, Repeat } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ShoppingCartSidebar from "../components/cart/ShoppingCart";

const termSections = [
  {
    title: "Orders & Fulfilment",
    copy: [
      "Orders are typically processed within 24 hours; festival seasons may extend QC to 48 hours so purity checks are never rushed.",
      "Every product is inspected for genuine 999 Fine Silver or S925 Sterling Silver before we package it.",
      "If an item is unavailable, we contact you to choose an alternate design of equal value or receive a full refund.",
    ],
  },
  {
    title: "Shipping & Delivery",
    copy: [
      "Domestic shipping across India carries a flat ₹50–₹100 fee; international rates are calculated at checkout.",
      "Tracking IDs are issued via WhatsApp, SMS, and email once your parcel leaves our studio.",
      "International customers are responsible for customs duties, VAT, or handling fees charged by local authorities.",
      "Parcels returned due to incorrect addresses or delivery refusals incur additional re-shipping costs.",
    ],
  },
  {
    title: "Returns, Refunds & Exchanges",
    copy: [
      "We offer a 15-day return window for unused, unworn items with all original tags, packaging, and certificates intact.",
      "Earrings, studs, personalized pieces, silver coins, idols, utensils, and clearance items are final sale unless defective on arrival.",
      "International orders are considered final sale and cannot be returned or refunded.",
      "Report damaged or incorrect items within 24 hours with a clear, continuous 360° unboxing video; claims without video proof cannot be processed.",
      "Refunds initiate within 48 hours of a successful quality check, and banks typically take 5–7 business days to credit the amount.",
    ],
  },
  {
    title: "Use of Website & Eligibility",
    copy: [
      "www.ganrajjewellers.com is owned and operated by Ganraj Jewellers; all content, imagery, and software remain our intellectual property.",
      "By using the site you agree to these Terms of Use and our Privacy Policy; discontinue use if you do not agree.",
      "You must be able to form a legally binding contract under the Indian Contract Act, 1872 or other applicable laws; minors may shop only with a parent or guardian.",
      "We reserve the right to deny service to fraudulent accounts, abusive behavior, or violations of these terms.",
    ],
  },
];

const highlights = [
  {
    title: "Purity Guaranteed",
    detail: "Only 999 Fine Silver and S925 Sterling Silver pieces, inspected and hallmarked before dispatch, leave our studio.",
    icon: ShieldCheck,
  },
  {
    title: "Transparent Logistics",
    detail: "Processing timelines, shipping fees, and customs responsibilities are clearly shared before you pay.",
    icon: Scale,
  },
  {
    title: "Customer-First Policies",
    detail: "15-day returns, clear exclusions, and proactive communication keep every purchase worry-free.",
    icon: Sparkles,
  },
];

const pillars = [
  {
    label: "Purity",
    desc: "We stand by the promised 999/S925 standards with QC and documentation for every order.",
  },
  {
    label: "Transparency",
    desc: "Processing windows, shipping charges, and refund timelines are published and honored.",
  },
  {
    label: "Care",
    desc: "Dedicated support via WhatsApp, email, and appointments ensures smooth exchanges and service.",
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
              The real policies behind every Ganraj order.
            </h1>
            <p className="text-lg text-gray-600">
              These terms summarise our fulfilment, shipping, return, and website policies so you know exactly what to
              expect before you check out.
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

