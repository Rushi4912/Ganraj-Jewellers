"use client";

import { useState } from "react";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";
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
  },
  {
    title: "Styling Guide: Layered Necklaces for Summer",
    excerpt: "Our stylists break down proportions, chain textures, and gemstones for effortless stacking.",
    date: "Apr 28, 2025",
    tag: "Style",
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=60",
  },
  {
    title: "Gem School: Why 18k Gold Wins Every Time",
    excerpt: "We decode karats, hues, and care tips so your investments age gracefully.",
    date: "Apr 12, 2025",
    tag: "Education",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=60",
  },
];

export default function BlogPage() {
  const [showCart, setShowCart] = useState(false);

  return (
    <>
      <Navbar onCartOpen={() => setShowCart(true)} />
      <main className="bg-gray-50 min-h-screen">
        <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-16 left-10 w-72 h-72 bg-amber-100 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-orange-200 blur-3xl" />
          </div>
          <div className="relative max-w-4xl mx-auto text-center px-6">
            <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 text-amber-600 font-semibold">
              <BookOpen size={18} />
              The Journal
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-6">Stories from our atelier</h1>
            <p className="mt-3 text-lg text-gray-600">
              Styling insights, gemstone education, and glimpses of the artisans behind every Ganraj Jewellers piece.
            </p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.title}
                className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 flex flex-col"
              >
                <div className="relative h-52">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  <span className="absolute top-4 left-4 bg-white/90 text-amber-600 text-xs font-semibold px-3 py-1 rounded-full">
                    {post.tag}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center text-gray-500 text-sm gap-2">
                    <Calendar size={16} />
                    {post.date}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mt-4">{post.title}</h3>
                  <p className="text-gray-600 mt-2 flex-1">{post.excerpt}</p>
                  <button className="mt-4 inline-flex items-center gap-2 text-amber-600 font-semibold">
                    Read story <ArrowRight size={18} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <ShoppingCartSidebar isOpen={showCart} onClose={() => setShowCart(false)} />
      <Footer />
    </>
  );
}

