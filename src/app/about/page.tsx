"use client";

import { useState } from "react";
import { Gem, Sparkles, ShieldCheck, HeartHandshake, Award, Feather, ArrowRight } from "lucide-react";
import Image from "next/image";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ShoppingCartSidebar from "../components/cart/ShoppingCart";

const stats = [
  { label: "Purity Standards", value: "999 / S925" },
  { label: "Quality Check", value: "24 hrs" },
  { label: "Happy Clients", value: "5000+" },
  { label: "Founded", value: "Rutvik B." },
];

const values = [
  {
    title: "Uncompromising Purity",
    detail: "Every design is crafted only in 999 Fine Silver or S925 Sterling Silver. No compromises, just lasting confidence.",
    icon: Gem
  },
  {
    title: "Accessible Luxury",
    detail: "We keep production in-house, removing unnecessary markups to keep quality pieces within reach of every budget.",
    icon: Sparkles
  },
  {
    title: "Daily-Wear Ready",
    detail: "Built for commutes, celebrations, and quiet moments. Our jewellery is meant to be lived in, not hidden away.",
    icon: ShieldCheck
  },
];

export default function AboutPage() {
  const [showCart, setShowCart] = useState(false);

  return (
    <>
      <Navbar onCartOpen={() => setShowCart(true)} />

      <main className="bg-[#F2F0EB] min-h-screen overflow-hidden">
        {/* ================= HERO SECTION ================= */}
        <section className="relative w-full pt-12 pb-20 lg:pt-24 lg:pb-32 px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left Content */}
            <div className="z-10">
              <span className="block text-[#8B7355] text-xs font-bold tracking-[0.2em] uppercase mb-4 animate-fadeInUp">
                Since 2024
              </span>
              <h1 className="font-display text-5xl lg:text-7xl text-[#2D2A26] leading-[1.1] mb-8 animate-fadeInUp-delay-1">
                Purity you can <br />
                <span className="italic text-[#8B7355]">live in.</span>
              </h1>
              <p className="text-[#6B5D52] text-lg leading-relaxed max-w-md mb-10 animate-fadeInUp-delay-2">
                Ganraj Jewellers began with a simple belief: the jewellery that holds your memories shouldn’t stay locked away. We specialise in genuine 999 Fine Silver and S925 Sterling Silver.
              </p>

              <div className="flex flex-wrap gap-8 animate-fadeInUp-delay-3">
                {stats.map((stat, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="font-display text-3xl text-[#2D2A26]">{stat.value}</span>
                    <span className="text-xs uppercase tracking-wider text-[#8B7355] mt-1">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image Composition */}
            <div className="relative h-[500px] lg:h-[600px] w-full animate-fadeInRight">
              {/* Main Image */}
              <div
                className="absolute top-0 right-0 w-[90%] h-full bg-[#E5E0D8] shadow-2xl overflow-hidden"
                style={{ borderRadius: '120px 20px 120px 20px' }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1200&q=80"
                  alt="Artisan working on silver"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-1000"
                  unoptimized
                />
              </div>

              {/* Float Image */}
              <div
                className="absolute bottom-12 -left-4 w-48 h-64 bg-white p-2 shadow-xl animate-floatSubtle hidden sm:block"
                style={{ borderRadius: '4px' }}
              >
                <div className="relative w-full h-full overflow-hidden border border-[#F2F0EB]">
                  <Image
                    src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80"
                    alt="Silver detail"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= STORY SECTION ================= */}
        <section className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

              {/* Sticky Title */}
              <div className="lg:w-1/3">
                <div className="sticky top-32">
                  <h2 className="font-display text-4xl lg:text-5xl text-[#2D2A26] mb-6">
                    From memories <span className="italic text-[#8B7355] block">to reality</span>
                  </h2>
                  <p className="text-[#6B5D52] leading-relaxed mb-8">
                    Rutvik Bedre founded Ganraj with a vision to democratize luxury. Watching heirloom pieces gather dust in lockers, he asked: "Why isn't purity everyday?"
                  </p>
                  <div className="w-20 h-1 bg-[#8B7355]"></div>
                </div>
              </div>

              {/* Values Grid */}
              <div className="lg:w-2/3 grid gap-8">
                {values.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="group p-8 rounded-3xl bg-[#F9F8F6] hover:bg-[#F2F0EB] transition-colors duration-300 border border-transparent hover:border-[#D6Cec5]"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#E5E0D8] flex items-center justify-center text-[#8B7355] mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Icon size={24} strokeWidth={1.5} />
                      </div>
                      <h3 className="font-display text-2xl text-[#2D2A26] mb-3">{item.title}</h3>
                      <p className="text-[#6B5D52] leading-relaxed">{item.detail}</p>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </section>

        {/* ================= BOTTOM BANNER ================= */}
        <section className="py-24 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto relative rounded-[3rem] overflow-hidden bg-[#2D2A26] text-[#F2F0EB] py-20 px-8 text-center">
            {/* Abstract Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
              <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#8B7355] rounded-full blur-[100px]"></div>
              <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#B8923A] rounded-full blur-[100px]"></div>
            </div>

            <div className="relative z-10 max-w-2xl mx-auto">
              <Feather className="w-10 h-10 text-[#8B7355] mx-auto mb-6" />
              <h2 className="font-display text-4xl lg:text-5xl mb-6">
                Certified Purity.
              </h2>
              <p className="text-white/70 text-lg mb-10 leading-relaxed">
                Every batch is inspected within 24 hours so only certified 999 or S925 silver leaves our studio.
              </p>
              <button className="group inline-flex items-center gap-3 px-8 py-3 rounded-full bg-[#F2F0EB] text-[#2D2A26] font-medium hover:bg-[#8B7355] hover:text-white transition-all duration-300">
                Explore Collections
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>

      </main>

      <ShoppingCartSidebar isOpen={showCart} onClose={() => setShowCart(false)} />
      <Footer />
    </>
  );
}

