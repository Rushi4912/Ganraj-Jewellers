"use client";

import { useState } from "react";
import { ShieldCheck, Sparkles, Lock } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ShoppingCartSidebar from "../components/cart/ShoppingCart";

const policySections = [
  {
    title: "1. Information we collect",
    details: [
      "Details you provide while shopping: name, email, phone number, shipping address, and billing details.",
      "Order history, return requests, and support conversations so we can quality-check every dispatch.",
      "Gateway confirmations for payments—card numbers stay with the PCI-compliant provider.",
      "Optional assets like unboxing videos you share for claims, stored only for the purpose of resolution.",
    ],
  },
  {
    title: "2. How we use your data",
    details: [
      "Process, insure, and ship orders within the 24–48 hour fulfillment window mentioned in our policy.",
      "Send tracking IDs via WhatsApp, SMS, and email, plus reminders about purity care or return deadlines.",
      "Prevent fraud, honor BIS hallmark regulations, and comply with Indian taxation requirements.",
      "Respond to queries, refunds, and exchanges so you never need to repeat information.",
    ],
  },
  {
    title: "3. Security & rights",
    details: [
      "We operate the website ourselves, retain ownership of all content, and never sell or rent your personal data.",
      "Only vetted logistics and payment partners receive what they need to complete your order.",
      "By using ganrajjewellers.com you consent to this policy, and you can email ganrajjewellers3@gmail.com anytime to update or delete your information.",
    ],
  },
];

const highlights = [
  {
    icon: ShieldCheck,
    title: "Privacy promised",
    detail: "Your information is stored exclusively for Ganraj Jewellers services and safeguarded end to end.",
  },
  {
    icon: Lock,
    title: "Indian law compliant",
    detail: "We follow Indian Contract Act guidelines and maintain full ownership of site data and assets.",
  },
  {
    icon: Sparkles,
    title: "Transparent communication",
    detail: "Every policy, from returns to refunds, clearly states timelines before you confirm payment.",
  },
];

const timelines = [
  {
    title: "Place an order",
    description: "Share only the essentials—we collect address and contact details to craft and dispatch your jewellery.",
  },
  {
    title: "Shipping & tracking",
    description: "Within 24–48 hours your tracking ID hits email, SMS, and WhatsApp; data stays within that flow.",
  },
  {
    title: "Returns & aftercare",
    description: "Return windows last 15 days, and every video or note you send for verification remains private.",
  },
];

export default function PrivacyPolicyPage() {
  const [showCart, setShowCart] = useState(false);

  return (
    <>
      <Navbar onCartOpen={() => setShowCart(true)} />
      <main className="bg-gray-50">
        <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 py-20">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-10 left-10 h-64 w-64 bg-amber-200 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-64 w-64 bg-rose-200 blur-3xl" />
          </div>
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <p className="text-sm font-semibold text-amber-600 uppercase tracking-[0.5em]">Privacy Policy</p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              We protect your data the way we protect our silver.
            </h1>
            <p className="text-lg text-gray-600">
              This notice explains how Ganraj Jewellers collects, stores, and uses the information you share with us on
              ganrajjewellers.com or during concierge interactions.
            </p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl bg-white shadow-2xl border border-gray-100 p-6 text-center flex flex-col items-center gap-3"
              >
                <item.icon className="text-amber-500" size={28} />
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.detail}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {policySections.map((section) => (
              <article
                key={section.title}
                className="bg-white rounded-[32px] border border-gray-100 shadow-xl p-8 space-y-5"
              >
                <p className="text-xs uppercase tracking-[0.4em] text-amber-500">{section.title}</p>
                <ul className="space-y-3 text-gray-600 list-disc pl-5">
                  {section.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-[40px] bg-gradient-to-br from-gray-900 to-gray-800 text-white p-10 shadow-2xl border border-white/10">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-amber-400">Lifecycle</p>
                <h2 className="text-3xl font-bold mt-2">How your data journeys with us</h2>
                <p className="mt-3 text-gray-200 max-w-3xl">
                  From the moment you place an order to the day a return reaches our warehouse, we use your information
                  only to deliver purity, transparency, and the care you asked for.
                </p>
              </div>
              <div className="space-y-4">
                {timelines.map((item) => (
                  <div key={item.title} className="bg-white/10 rounded-2xl border border-white/20 p-4">
                    <p className="text-sm uppercase tracking-[0.4em] text-gray-300">{item.title}</p>
                    <p className="mt-2 text-sm text-gray-200">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <ShoppingCartSidebar isOpen={showCart} onClose={() => setShowCart(false)} />
      <Footer />
    </>
  );
}

