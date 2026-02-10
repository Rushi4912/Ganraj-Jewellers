"use client";

import Link from "next/link";
import Image from "next/image";
import PopularCategories from "../components/products/PopularCategories";
import { ArrowRight, Star, ShieldCheck, Truck, Sparkles } from "lucide-react";

const collections = [
  {
    name: "The Royal Heritage",
    slug: "necklaces",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80",
    description: "Timeless Kundan and Polki masterpieces.",
    tag: "Best Seller",
    size: "large"
  },
  {
    name: "Modern Minimalist",
    slug: "chains-bangles",
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1600&q=80",
    description: "Contemporary designs for the everyday muse.",
    tag: "New Arrival",
    size: "small"
  },
  {
    name: "Bridal Vows",
    slug: "bridal",
    image: "https://images.unsplash.com/photo-1596908332403-9e4544d56710?auto=format&fit=crop&w=1600&q=80",
    description: "For the day that matters most.",
    tag: "Trending",
    size: "small"
  },
  {
    name: "Temple Divinity",
    slug: "temple",
    image: "https://images.unsplash.com/photo-1605218427368-35b0185e7d28?auto=format&fit=crop&w=1600&q=80",
    description: "Handcrafted devotion in pure gold.",
    tag: "Classic",
    size: "large"
  }
];

export default function CollectionsPage() {
  return (
    <main className="bg-[#F2F0EB] min-h-screen">

      {/* ================= HERO SECTION ================= */}
      <section className="relative h-[80vh] w-full overflow-hidden flex items-end pb-20 px-6 lg:px-12">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?auto=format&fit=crop&w=2000&q=80"
            alt="Jewellery Background"
            fill
            className="object-cover animate-ken-burns"
            sizes="100vw"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-10">
          <div className="text-white max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] w-12 bg-[#B8923A]"></div>
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#B8923A]">
                Curated Series
              </span>
            </div>
            <h1 className="font-display text-6xl md:text-8xl leading-none mb-6">
              Art of <span className="italic text-[#B8923A]">Adornment</span>
            </h1>
            <p className="text-white/80 text-lg leading-relaxed max-w-md">
              Discover a world where heritage meets modernity. Curated to tell your unique story.
            </p>
          </div>

          {/* Scroll Indicator */}
          <div className="hidden md:flex flex-col items-center gap-4 text-white/60">
            <span className="text-[10px] uppercase tracking-widest writing-vertical-rl rotate-180">Scroll to Explore</span>
            <div className="h-16 w-[1px] bg-white/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-white animate-scrollBounce"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= EDITORIAL GRID ================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">

          {collections.map((collection, index) => (
            <div
              key={index}
              className={`${collection.size === 'large' ? 'lg:col-span-8' : 'lg:col-span-4'
                } relative group rounded-[2rem] overflow-hidden h-[500px] lg:h-[600px] border border-[#C5B4A5]/30 shadow-lg cursor-pointer transform hover:-translate-y-2 transition-transform duration-500`}
            >
              <Link href={`/collections/${collection.slug}`} className="block w-full h-full">
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  sizes="100vw"
                  unoptimized
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D2A26] via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                {/* Floating Tag */}
                <div className="absolute top-8 left-8">
                  <span className="bg-[#F2F0EB]/90 backdrop-blur-md text-[#2D2A26] text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-sm border border-[#C5B4A5]">
                    {collection.tag}
                  </span>
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
                  <h3 className="font-display text-4xl text-[#F2F0EB] mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {collection.name}
                  </h3>
                  <p className="text-[#F2F0EB]/80 text-lg font-light mb-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                    {collection.description}
                  </p>

                  <div className="flex items-center gap-3 text-[#B8923A] font-medium uppercase tracking-wider text-xs bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                    View Collection <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            </div>
          ))}

        </div>
      </section>

      {/* ================= ALL CATEGORIES ================= */}

      {/* Divider */}
      <div className="w-full h-[1px] bg-[#C5B4A5]/30 max-w-7xl mx-auto mb-16"></div>

      <PopularCategories />

    </main>
  );
}
