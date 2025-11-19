"use client";

import { useState } from "react";
import {
  Package,
  Leaf,
  Shield,
  Sparkles,
  Star,
  CheckCircle,
  Circle,
  Clock,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ShoppingCartSidebar from "../components/cart/ShoppingCart";

const faqSections = [
  {
    id: "shipping",
    title: "Shipping & Delivery",
    icon: Package,
    summary: "Insured express delivery to 27+ countries with live tracking.",
    items: [
      {
        question: "Do you ship internationally?",
        answer:
          "Yes. Every parcel is insured and delivered via VIP couriers with customs-cleared documentation pre-filled.",
      },
      {
        question: "How long does delivery take?",
        answer:
          "Ready-to-ship pieces leave the atelier within 48 hours. Bespoke jewels ship in 10–18 business days, and you receive curated arrival windows via SMS.",
      },
    ],
  },
  {
    id: "orders",
    title: "Orders & Returns",
    icon: Shield,
    summary: "Transparent checkout, easy returns, and lifetime repair care.",
    items: [
      {
        question: "Can I return a piece?",
        answer:
          "Returns are accepted within 14 days for unworn jewellery with tags. Custom or engraved pieces qualify for studio credit and a complimentary restyling consult.",
      },
      {
        question: "Do you offer repairs?",
        answer:
          "Yes. We provide complimentary replating, polishing, and stone tightening for manufacturing defects within one year.",
      },
    ],
  },
  {
    id: "care",
    title: "Care & Authenticity",
    icon: Leaf,
    summary: "Hallmarked metals, independent certificates, and care rituals.",
    items: [
      {
        question: "How do I care for my jewellery?",
        answer:
          "Store in the embroidered pouches, avoid perfume contact, and wipe with a microfiber cloth. Schedule a seasonal spa refresh anytime—details are on your certificate.",
      },
      {
        question: "Is my gold plated or solid?",
        answer:
          "Each piece is 18k certified gold with BIS hallmarks. Plated pieces are clearly marked and include complimentary replating services.",
      },
    ],
  },
];

const timeline = [
  "Select your dream jewel & request a virtual fitting.",
  "Receive bespoke recommendations, renderings, and a textured mood board.",
  "Approve the design, select metals/stones, and confirm delivery windows.",
  "Track the creation in real time; final polish ships inside a velvet chest.",
];

export default function FAQPage() {
  const [showCart, setShowCart] = useState(false);

  return (
    <>
      <Navbar onCartOpen={() => setShowCart(true)} />
      <main className="bg-white text-gray-900">
        <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 py-20">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute w-64 h-64 bg-amber-100 blur-3xl top-16 left-10" />
            <div className="absolute w-72 h-72 bg-rose-100 blur-3xl bottom-4 right-8" />
          </div>
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 text-amber-600 font-semibold">
              <Sparkles size={18} />
              Concierge FAQ
            </p>
            <h1 className="mt-6 text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Answers tailored to luxury service
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Whether you’re styling a wedding, gifting an heirloom, or customizing for travel, we have a dedicated
              team ready to make every detail effortless.
            </p>
            <div className="mt-8 grid md:grid-cols-3 gap-4 text-left">
              {["Certified stones", "Hallmarked metals", "Lifetime care"].map((line) => (
                <div
                  key={line}
                  className="rounded-2xl bg-white/70 border border-gray-100 px-6 py-4 shadow-lg shadow-amber-100/50 backdrop-blur"
                >
                  <p className="text-sm uppercase tracking-[0.3em] text-amber-500">Promise</p>
                  <p className="text-base font-semibold text-gray-900">{line}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
          <div className="grid lg:grid-cols-3 gap-8">
            {faqSections.map(({ id, title, summary, icon: Icon, items }) => (
              <div
                key={id}
                className="bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
              >
                <div className="px-8 py-6 bg-gradient-to-b from-white to-amber-50">
                  <div className="inline-flex items-center gap-3 text-amber-600">
                    <Icon size={22} />
                    <span className="text-lg font-semibold text-gray-900">{title}</span>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">{summary}</p>
                </div>
                <div className="p-8 space-y-6">
                  {items.map((faq) => (
                    <details
                      key={faq.question}
                      className="group border border-gray-100 rounded-2xl p-4 bg-gray-50 transition-shadow hover:shadow-lg"
                    >
                      <summary className="flex items-center justify-between cursor-pointer text-lg font-semibold text-gray-900">
                        {faq.question}
                        <Circle className="text-amber-400 transition-transform group-open:-rotate-45" size={16} />
                      </summary>
                      <p className="mt-3 text-gray-600 leading-relaxed">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-[40px] p-10 shadow-2xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <p className="text-sm uppercase tracking-[0.5em] text-amber-300">Our Process</p>
                <h2 className="mt-3 text-3xl font-bold">Journey from idea to treasure</h2>
                <p className="mt-3 text-gray-300 max-w-2xl">
                  Every concierge order is shepherded with appointment-only previews, artisanal craftsmanship, and
                  VIP delivery.
                </p>
              </div>
              <div className="flex items-center gap-2 text-amber-200 bg-white/10 px-5 py-2 rounded-full">
                <CheckCircle size={20} />
                <span className="text-sm font-semibold">White-glove concierge</span>
              </div>
            </div>
            <div className="mt-8 grid md:grid-cols-4 gap-6">
              {timeline.map((step, index) => (
                <div key={step} className="rounded-3xl bg-white/10 border border-white/20 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-amber-100/50 flex items-center justify-center text-amber-600 font-bold">
                      {index + 1}
                    </div>
                    <p className="text-sm uppercase tracking-[0.3em] text-gray-300">
                      Step {index + 1}
                    </p>
                  </div>
                  <p className="mt-3 text-sm text-gray-200 leading-relaxed">{step}</p>
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

