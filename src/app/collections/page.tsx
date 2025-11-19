"use client";

import Link from "next/link";
import PopularCategories from "../components/products/PopularCategories";
import { ArrowRight, Star, ShieldCheck, Truck, Sparkles } from "lucide-react";

const heroCollections = [
  {
    name: "The Royal Heritage",
    slug: "necklaces",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80",
    description: "Timeless Kundan and Polki masterpieces.",
    tag: "Best Seller",
  },
  {
    name: "Modern Minimalist",
    slug: "chains-bangles",
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1600&q=80",
    description: "Contemporary designs for the everyday muse.",
    tag: "New Arrival",
  },
];

const features = [
  {
    icon: Star,
    title: "Certified Authenticity",
    description: "Every piece comes with a certificate of purity and craftsmanship.",
  },
  {
    icon: ShieldCheck,
    title: "Lifetime Warranty",
    description: "We stand by our quality with comprehensive lifetime service.",
  },
  {
    icon: Truck,
    title: "Secure Shipping",
    description: "Insured and tracked delivery to your doorstep, worldwide.",
  },
];

export default function CollectionsPage() {
  return (
    <main className="bg-stone-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?auto=format&fit=crop&w=2000&q=80"
            alt="Jewelry Background"
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto space-y-8 animate-fade-in-up">
          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-12 bg-white/50"></div>
            <span className="inline-block text-xs uppercase tracking-[0.4em] text-white/90 font-medium">
              Est. 2024
            </span>
            <div className="h-[1px] w-12 bg-white/50"></div>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium leading-tight tracking-tight">
            The Art of <span className="italic text-amber-200">Adornment</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 font-light max-w-2xl mx-auto leading-relaxed">
            Discover a world where heritage meets modernity. Our collections are curated to tell your unique story through exquisite craftsmanship.
          </p>
          
          <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
            <a 
              href="#collections"
              className="group bg-white text-stone-900 px-10 py-4 rounded-full font-medium hover:bg-amber-50 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Explore Collections
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <Link 
              href="/about"
              className="group px-10 py-4 rounded-full font-medium text-white border border-white/30 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm flex items-center gap-3"
            >
              Our Story
              <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-[1px] h-16 bg-gradient-to-b from-white/0 via-white/50 to-white/0"></div>
        </div>
      </section>

      {/* Featured Collections (Asymmetrical Grid) */}
      <section id="collections" className="py-24 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-stone-200 pb-8">
          <div className="space-y-4 text-center md:text-left w-full md:w-auto">
            <span className="text-amber-700 uppercase tracking-[0.2em] text-xs font-bold block">
              Featured Edits
            </span>
            <h2 className="text-4xl md:text-6xl font-serif text-stone-900">
              Signature Selections
            </h2>
          </div>
          <p className="text-stone-500 max-w-md text-center md:text-right mx-auto md:mx-0 text-lg font-light leading-relaxed">
            Handpicked favorites that define our aesthetic. From bridal grandeur to daily luxury.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Large Featured Item */}
          <div className="lg:col-span-8 relative group overflow-hidden rounded-3xl h-[600px] lg:h-[700px]">
            <Link href={`/collections/${heroCollections[0].slug}`} className="block w-full h-full">
              <img
                src={heroCollections[0].image}
                alt={heroCollections[0].name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              
              <div className="absolute top-8 left-8">
                <span className="bg-white/90 backdrop-blur-md text-stone-900 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-sm">
                  {heroCollections[0].tag}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-4xl md:text-5xl font-serif text-white mb-4">
                  {heroCollections[0].name}
                </h3>
                <p className="text-white/80 mb-8 font-light max-w-md text-lg leading-relaxed">
                  {heroCollections[0].description}
                </p>
                <span className="inline-flex items-center gap-3 text-white font-medium text-lg group/btn">
                  <span className="border-b border-white/30 pb-1 group-hover/btn:border-white transition-colors">View Collection</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-2" />
                </span>
              </div>
            </Link>
          </div>

          {/* Smaller Featured Item */}
          <div className="lg:col-span-4 relative group overflow-hidden rounded-3xl h-[500px] lg:h-[700px]">
            <Link href={`/collections/${heroCollections[1].slug}`} className="block w-full h-full">
              <img
                src={heroCollections[1].image}
                alt={heroCollections[1].name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              
              <div className="absolute top-8 left-8">
                <span className="bg-stone-900/90 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-sm">
                  {heroCollections[1].tag}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-3xl md:text-4xl font-serif text-white mb-4">
                  {heroCollections[1].name}
                </h3>
                <p className="text-white/80 mb-8 font-light text-base leading-relaxed">
                  {heroCollections[1].description}
                </p>
                <span className="inline-flex items-center gap-3 text-white font-medium group/btn">
                  <span className="border-b border-white/30 pb-1 group-hover/btn:border-white transition-colors">Explore</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-2" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Banner */}
      <section className="bg-stone-900 text-white py-24 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-700 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center space-y-6 p-8 rounded-2xl hover:bg-white/5 transition-colors duration-500 group">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-white/10">
                  <feature.icon className="w-8 h-8 text-amber-200" />
                </div>
                <h3 className="text-2xl font-serif text-amber-50">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed text-base max-w-xs">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Categories */}
      <PopularCategories />
    </main>
  );
}
