"use client";

import { useState } from "react";
import { Gem, Sparkles, ShieldCheck, HeartHandshake, Award, Feather } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ShoppingCartSidebar from "../components/cart/ShoppingCart";

const storyHighlights = [
  {
    title: "Legacy Craftsmanship",
    description:
      "Our atelier blends time-honored Indian artistry with contemporary silhouettes, creating heirloom pieces meant to be worn every day.",
    icon: Sparkles,
  },
  {
    title: "Conscious Luxury",
    description:
      "We partner with fair-trade suppliers and recycle precious metals to ensure every creation feels as good as it looks.",
    icon: ShieldCheck,
  },
  {
    title: "Human Touch",
    description:
      "Each jewel passes through more than 20 artisan hands—from sketch to final polish—before it graces yours.",
    icon: HeartHandshake,
  },
];

const stats = [
  { label: "Artisans Empowered", value: "120+" },
  { label: "Bespoke Commissions", value: "3.5K" },
  { label: "Countries Shipped", value: "27" },
  { label: "Years of Legacy", value: "35" },
];

const values = [
  {
    title: "Slow Craft",
    detail: "We obsess over finish, setting, and silhouette so the piece feels effortless.",
  },
  {
    title: "Materials that Matter",
    detail: "Only conflict-free stones and certified, hallmarked gold leave our studio.",
  },
  {
    title: "Everyday Indulgence",
    detail: "Luxurious pieces designed to move seamlessly from workday to soirée.",
  },
];

export default function AboutPage() {
  const [showCart, setShowCart] = useState(false);

  return (
    <>
      <Navbar onCartOpen={() => setShowCart(true)} />

      <main className="bg-gray-50 min-h-screen">
        <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 py-20">
          <div className="absolute inset-0 opacity-40">
            <div className="absolute -top-20 -left-10 h-72 w-72 bg-amber-200 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-64 w-64 bg-rose-200 blur-3xl" />
          </div>
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 text-amber-600 text-sm font-semibold shadow-sm">
              <Gem size={18} /> Crafted in small batches since 1990
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-6 leading-tight">
              Jewellery that celebrates
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">
                every luminous moment
              </span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              We are a Mumbai-born collective of designers, goldsmiths, and storytellers reimagining fine jewellery
              for the modern muse. Our pieces are intimate, intentional, and unapologetically luxurious.
            </p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl shadow-lg px-6 py-6 text-center border border-amber-100"
              >
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="mt-2 text-sm uppercase tracking-wide text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-semibold text-amber-600 uppercase tracking-[0.3em]">Our Story</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4">
              Made by hand, inspired by heart
            </h2>
            <p className="mt-6 text-gray-600 leading-relaxed">
              What started as a family-run studio in Zaveri Bazaar has blossomed into a global house of modern
              heirlooms. Every decade, we evolve, yet our promise stays the same: to create jewellery that mirrors
              your story with fine materials, intuitive design, and obsessive craftsmanship.
            </p>
            <div className="mt-8 space-y-4">
              {values.map((value) => (
                <div key={value.title} className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
                  <p className="text-base font-semibold text-gray-900">{value.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{value.detail}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-amber-100 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-transparent to-rose-50 opacity-70" />
            <div className="relative space-y-6">
              {storyHighlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                      <Icon size={22} />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{item.title}</p>
                      <p className="text-gray-600 mt-1">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Design Lab",
                  description: "Sketches to 3D models guided by moodboards, muses, and everyday rituals.",
                  icon: Feather,
                },
                {
                  title: "Stone Library",
                  description: "Rare emeralds, vivid tourmalines, and custom cuts curated with gemologists.",
                  icon: Gem,
                },
                {
                  title: "Finishing Ritual",
                  description: "Hand-burnished edges, mirror polishes, and hallmarked authenticity cards.",
                  icon: Award,
                },
              ].map(({ title, description, icon: Icon }) => (
                <div key={title} className="p-6 rounded-2xl border border-gray-100 shadow-sm hover:-translate-y-1 transition">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                  <p className="text-gray-600 mt-2">{description}</p>
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

