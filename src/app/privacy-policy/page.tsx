"use client";

import { useState } from "react";
import { ShieldCheck, Sparkles, Lock, CreditCard, Repeat } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ShoppingCartSidebar from "../components/cart/ShoppingCart";

const policySections = [
  {
    title: "1. Information we collect",
    details: [
      "Profile assumptions (name, email, phone, shipping) submitted during checkout.",
      "Order history, wishlist picks, size preferences, and bespoke notes so we can personalize every look.",
      "Payment confirmation from encrypted gateways—card details never touch our servers.",
      "Usage patterns via cookies to smooth discovery and honor your aesthetic cues.",
    ],
  },
  {
    title: "2. How we use your data",
    details: [
      "Ship, repair, and concierge requests with a white-glove touch.",
      "Send release alerts, care reminders, and curated gifting ideas you opt-into.",
      "Forecast production so the pieces you love are always in stock.",
      "Comply with BIS hallmarking, taxation, and anti-fraud checks.",
    ],
  },
  {
    title: "3. Security & rights",
    details: [
      "AES-256 encryption guards every record. Access is limited to award-winning artisans, stylists, and compliance.",
      "We never sell your data. Trusted logistics, payments, and analytics partners receive only the essentials.",
      "Request data deletion, exports, or preference updates anytime via privacy@jwellery4u.com.",
    ],
  },
];

const highlights = [
  {
    icon: ShieldCheck,
    title: "Certified safety",
    detail: "ISO-aligned controls keep production and payment details private.",
  },
  {
    icon: Lock,
    title: "Private by design",
    detail: "Our site and mobile experience share no third-party ad pixels.",
  },
  {
    icon: Sparkles,
    title: "Always transparent",
    detail: "Every feature and cookie banner lists purpose, duration, and opt-outs.",
  },
];

const timelines = [
  {
    title: "Submit an inquiry",
    description: "Your preferences enter a protected vault and are only reviewed by our concierge team.",
  },
  {
    title: "Craft & ship",
    description: "We share tracking milestones without storing sensitive delivery photos.",
  },
  {
    title: "Aftercare",
    description: "Care reminders go out, but you can pause them anytime in your profile.",
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
              Your trust is the most precious gemstone.
            </h1>
            <p className="text-lg text-gray-600">
              Updated May 2025. This policy governs every interaction you have with Ganraj Jewellers online or in our
              experience studio.
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
                  From the moment you request a private preview to the day the case returns for cleaning, every detail
                  is encrypted, logged, and optional.
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

