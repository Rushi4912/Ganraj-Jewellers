"use client";

import { useState } from "react";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ShoppingCartSidebar from "../components/cart/ShoppingCart";

const posts = [
  {
    title: "Behind the Bench: Sketch to Sparkle",
    excerpt: "Go inside our design studio and see how a loose idea transforms into a luminous jewel within days.",
    date: "May 5, 2025",
    tag: "Craft",
    image:
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=900&q=60",
    size: "large"
  },
  {
    title: "Styling Guide: Layered Necklaces",
    excerpt: "Our stylists break down proportions, chain textures, and gemstones.",
    date: "Apr 28, 2025",
    tag: "Style",
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=60",
    size: "normal"
  },
  {
    title: "Gem School: Why 18k Gold Wins",
    excerpt: "We decode karats, hues, and care tips so your investments age gracefully.",
    date: "Apr 12, 2025",
    tag: "Education",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=60",
    size: "normal"
  },
];

export default function BlogPage() {
  const [showCart, setShowCart] = useState(false);

  return (
    <>
      <Navbar onCartOpen={() => setShowCart(true)} />

      <main className="bg-[#F2F0EB] min-h-screen">

        {/* ================= HEADER ================= */}
        <section className="relative pt-32 pb-20 px-6 text-center">
          <div className="max-w-4xl mx-auto z-10 relative">
            <span className="text-[#8B7355] text-xs font-bold tracking-[0.3em] uppercase block mb-6 animate-fadeInUp">
              The Journal
            </span>
            <h1 className="font-display text-5xl md:text-7xl text-[#2D2A26] mb-8 animate-fadeInUp-delay-1">
              Stories from <span className="italic text-[#8B7355]">our atelier.</span>
            </h1>
            <p className="text-[#6B5D52] text-lg max-w-xl mx-auto leading-relaxed animate-fadeInUp-delay-2">
              Styling insights, gemstone education, and glimpses of the artisans behind every Ganraj Jewellers piece.
            </p>
          </div>

          {/* Decorative Line */}
          <div className="absolute left-1/2 bottom-0 w-[1px] h-12 bg-gradient-to-b from-[#C5B4A5] to-transparent transform -translate-x-1/2"></div>
        </section>

        {/* ================= BLOG GRID ================= */}
        <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">

            {posts.map((post, idx) => {
              const isLarge = post.size === "large";
              return (
                <article
                  key={idx}
                  className={`group cursor-pointer ${isLarge ? 'md:col-span-2 lg:col-span-3 grid lg:grid-cols-2 gap-12 items-center mb-12' : 'flex flex-col'}`}
                >
                  {/* Image */}
                  <div className={`relative overflow-hidden rounded-[2rem] bg-[#E5E0D8] ${isLarge ? 'h-[400px] lg:h-[500px]' : 'h-[300px] w-full'}`}>
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      unoptimized
                    />
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur text-[#8B7355] text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider">
                      {post.tag}
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`${isLarge ? 'py-8' : 'pt-8'}`}>
                    <div className="flex items-center gap-2 text-[#8B7355] text-sm font-medium mb-3">
                      <Calendar size={14} />
                      <span>{post.date}</span>
                    </div>
                    <h3 className={`font-display text-[#2D2A26] group-hover:text-[#8B7355] transition-colors duration-300 mb-4 ${isLarge ? 'text-4xl lg:text-5xl' : 'text-2xl'}`}>
                      {post.title}
                    </h3>
                    <p className="text-[#6B5D52] leading-relaxed mb-6 text-lg">
                      {post.excerpt}
                    </p>
                    <div className="inline-flex items-center gap-2 text-[#2D2A26] font-medium border-b border-[#2D2A26] pb-1 group-hover:border-[#8B7355] group-hover:text-[#8B7355] transition-all">
                      Read Story <ArrowRight size={16} />
                    </div>
                  </div>
                </article>
              )
            })}

          </div>

          {/* Load More */}
          <div className="text-center mt-20">
            <button className="px-8 py-3 rounded-full border border-[#C5B4A5] text-[#6B5D52] hover:bg-[#2D2A26] hover:text-white hover:border-[#2D2A26] transition-all duration-300">
              View All Stories
            </button>
          </div>
        </section>

      </main>

      <ShoppingCartSidebar isOpen={showCart} onClose={() => setShowCart(false)} />
      <Footer />
    </>
  );
}
