"use client";

import { useState } from "react";
import { ShieldCheck, Sparkles, Lock, ArrowRight, FileText } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ShoppingCartSidebar from "../components/cart/ShoppingCart";

const policySections = [
  {
    title: "Information Collection",
    id: "01",
    details: [
      "Details you provide while shopping: name, email, phone number, shipping address, and billing details.",
      "Order history, return requests, and support conversations so we can quality-check every dispatch.",
      "Gateway confirmations for payments—card numbers stay with the PCI-compliant provider.",
      "Optional assets like unboxing videos you share for claims, stored only for the purpose of resolution.",
    ],
  },
  {
    title: "Data Usage",
    id: "02",
    details: [
      "Process, insure, and ship orders within the 24–48 hour fulfillment window mentioned in our policy.",
      "Send tracking IDs via WhatsApp, SMS, and email, plus reminders about purity care or return deadlines.",
      "Prevent fraud, honor BIS hallmark regulations, and comply with Indian taxation requirements.",
      "Respond to queries, refunds, and exchanges so you never need to repeat information.",
    ],
  },
  {
    title: "Security & Rights",
    id: "03",
    details: [
      "We operate the website ourselves, retain ownership of all content, and never sell or rent your personal data.",
      "Only vetted logistics and payment partners receive what they need to complete your order.",
      "By using ganrajjewellers.com you consent to this policy, and you can email ganrajjewellers3@gmail.com anytime to update or delete your information.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  const [showCart, setShowCart] = useState(false);

  return (
    <>
      <Navbar onCartOpen={() => setShowCart(true)} />

      <main className="bg-[#F2F0EB] min-h-screen">

        {/* ================= HEADER ================= */}
        <section className="relative pt-32 pb-24 px-6 text-center">
          <div className="max-w-4xl mx-auto z-10 relative">
            <div className="inline-flex items-center gap-2 text-[#8B7355] text-xs font-bold tracking-[0.3em] uppercase mb-6 animate-fadeInUp">
              <ShieldCheck size={14} />
              <span>Legal & Privacy</span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl text-[#2D2A26] mb-8 animate-fadeInUp-delay-1 leading-[1.1]">
              We protect your data <br />
              <span className="italic text-[#8B7355]">like our silver.</span>
            </h1>
            <p className="text-[#6B5D52] text-lg max-w-2xl mx-auto leading-relaxed animate-fadeInUp-delay-2">
              Trust is the foundation of our atelier. This notice explains how Ganraj Jewellers collects, stores, and uses the information you share with us.
            </p>
          </div>

          {/* Abstract BG */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#8B7355] rounded-full blur-[120px]"></div>
          </div>
        </section>

        {/* ================= CONTENT ================= */}
        <section className="px-6 lg:px-12 pb-32 max-w-5xl mx-auto">
          <div className="grid gap-16">
            {policySections.map((section, idx) => (
              <div key={idx} className="group relative bg-white p-10 md:p-14 rounded-[2rem] shadow-xl border border-[#C5B4A5]/20 hover:border-[#8B7355]/40 transition-colors duration-500">
                <div className="absolute top-10 right-10 text-[#E5E0D8] font-display text-8xl opacity-50 group-hover:text-[#F2F0EB] group-hover:scale-110 transition-all duration-500 select-none">
                  {section.id}
                </div>

                <div className="relative z-10">
                  <h2 className="font-display text-3xl text-[#2D2A26] mb-8 flex items-center gap-4">
                    {section.title}
                    <div className="h-[1px] flex-grow bg-[#C5B4A5]/30"></div>
                  </h2>
                  <ul className="space-y-4">
                    {section.details.map((detail, i) => (
                      <li key={i} className="flex gap-4 text-[#6B5D52] leading-relaxed text-lg">
                        <span className="text-[#8B7355] mt-2 text-xs">◆</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Card */}
          <div className="mt-16 bg-[#2D2A26] text-[#F2F0EB] rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto">
              <Lock className="w-10 h-10 text-[#8B7355] mx-auto mb-6" />
              <h3 className="font-display text-3xl md:text-4xl mb-6">Your Rights & Control</h3>
              <p className="text-[#F2F0EB]/70 text-lg mb-8">
                You retain full ownership of your data. If you wish to update, carry over, or delete your information, our concierge team is one email away.
              </p>
              <a href="mailto:ganrajjewellers3@gmail.com" className="inline-flex items-center gap-2 text-[#8B7355] font-medium border-b border-[#8B7355] pb-1 hover:text-white hover:border-white transition-all">
                Contact Data Officer <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>

      </main>
      <ShoppingCartSidebar isOpen={showCart} onClose={() => setShowCart(false)} />
      <Footer />
    </>
  );
}
