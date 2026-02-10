"use client";

import { useState } from "react";
import { Package, Leaf, Shield, Sparkles, Plus, Minus, CheckCircle, ArrowRight } from "lucide-react";
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
          "Yes. Every parcel is insured and delivered via VIP couriers with customs-cleared documentation pre-filled. We handle the logistics so you can focus on the unboxing.",
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
          "Yes. We provide complimentary replating, polishing, and stone tightening for manufacturing defects within one year. After that, we offer care services at nominal atelier rates.",
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
          "Store in the embroidered pouches provided, avoid perfume contact, and wipe with the included microfiber cloth. Schedule a seasonal spa refresh anytime.",
      },
      {
        question: "Is my gold plated or solid?",
        answer:
          "Each piece is 18k certified gold with BIS hallmarks. Plated pieces are clearly marked and include complimentary replating services for the first year.",
      },
    ],
  },
];

export default function FAQPage() {
  const [showCart, setShowCart] = useState(false);
  const [openItem, setOpenItem] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <>
      <Navbar onCartOpen={() => setShowCart(true)} />

      <main className="bg-[#F2F0EB] min-h-screen">

        {/* ================= HERO ================= */}
        <section className="relative pt-32 pb-24 px-6">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-[#8B7355] text-xs font-bold tracking-[0.3em] uppercase mb-6 animate-fadeInUp">
                <Sparkles size={14} />
                <span>Concierge FAQ</span>
              </div>
              <h1 className="font-display text-5xl md:text-7xl text-[#2D2A26] mb-8 animate-fadeInUp-delay-1 leading-[1.1]">
                Answers tailored to <br />
                <span className="italic text-[#8B7355]">luxury service.</span>
              </h1>
              <p className="text-[#6B5D52] text-lg max-w-xl leading-relaxed animate-fadeInUp-delay-2 mb-10">
                Whether you’re styling a wedding, gifting an heirloom, or customizing for travel, we have a dedicated team ready to make every detail effortless.
              </p>

              <div className="flex gap-4 animate-fadeInUp-delay-3">
                {["Certified stones", "Hallmarked metals", "Lifetime care"].map((tag, i) => (
                  <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#C5B4A5] text-[#6B5D52] text-sm">
                    <CheckCircle size={14} className="text-[#8B7355]" />
                    {tag}
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative Right Side */}
            <div className="relative h-[400px] hidden lg:block animate-fadeInRight">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#E5E0D8] rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse-slow"></div>
              <div className="absolute bottom-0 left-10 w-[300px] h-[300px] bg-[#F5E6D3] rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float"></div>
            </div>
          </div>
        </section>

        {/* ================= FAQ ACCORDION ================= */}
        <section className="px-6 lg:px-12 pb-32 max-w-4xl mx-auto">
          <div className="space-y-16">
            {faqSections.map((section) => (
              <div key={section.id} className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#8B7355] shadow-sm">
                    <section.icon size={20} />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl text-[#2D2A26]">{section.title}</h2>
                    <p className="text-[#6B5D52] text-sm">{section.summary}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {section.items.map((item, idx) => {
                    const itemId = `${section.id}-${idx}`;
                    const isOpen = openItem === itemId;

                    return (
                      <div
                        key={idx}
                        className={`group bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? 'border-[#8B7355] shadow-lg' : 'border-[#C5B4A5]/30 hover:border-[#8B7355]/50'}`}
                      >
                        <button
                          onClick={() => toggleItem(itemId)}
                          className="w-full flex items-center justify-between p-6 text-left"
                        >
                          <span className={`font-medium text-lg transition-colors ${isOpen ? 'text-[#8B7355]' : 'text-[#2D2A26]'}`}>
                            {item.question}
                          </span>
                          <span className={`flex-shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-[#8B7355] text-white rotate-180' : 'bg-[#F2F0EB] text-[#6B5D52]'}`}>
                            {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                          </span>
                        </button>

                        <div
                          className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 pb-6 px-6' : 'grid-rows-[0fr] opacity-0'}`}
                        >
                          <div className="overflow-hidden">
                            <p className="text-[#6B5D52] leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Contact CTO */}
          <div className="mt-20 p-8 rounded-[2rem] bg-gradient-to-r from-[#2D2A26] to-[#1a1918] text-[#F2F0EB] flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="font-display text-2xl mb-2">Still have questions?</h3>
              <p className="text-white/60">Our concierge team is available 10 AM – 8 PM IST.</p>
            </div>
            <button className="px-8 py-3 bg-[#F2F0EB] text-[#2D2A26] rounded-full font-medium hover:bg-[#8B7355] hover:text-white transition-all duration-300 whitespace-nowrap">
              Contact Concierge
            </button>
          </div>
        </section>

      </main>
      <ShoppingCartSidebar isOpen={showCart} onClose={() => setShowCart(false)} />
      <Footer />
    </>
  );
}
