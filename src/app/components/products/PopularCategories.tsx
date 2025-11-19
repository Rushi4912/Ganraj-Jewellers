import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Necklaces",
    slug: "necklaces",
    image:
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800&q=80",
    headline: "Timeless Elegance",
    blurb: "Delicate chains and statement pieces for every neckline.",
  },
  {
    name: "Rings",
    slug: "rings",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    headline: "Forever Symbols",
    blurb: "From solitaires to stackable bands, find your perfect fit.",
  },
  {
    name: "Bracelets",
    slug: "bracelets",
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80",
    headline: "Wrist Adornments",
    blurb: "Cuffs, bangles, and chains to layer or wear alone.",
  },
  {
    name: "Earrings",
    slug: "earrings",
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    headline: "Face Framing",
    blurb: "Studs, hoops, and drops that catch the light.",
  },
  {
    name: "Chains & Bangles",
    slug: "chains-bangles",
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    headline: "Modern Classics",
    blurb: "Essential links and structures for the modern wardrobe.",
  },
  {
    name: "Bespoke Bridal",
    slug: "bespoke-bridal",
    image:
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80",
    headline: "The Big Day",
    blurb: "Exquisite pieces to celebrate your most special moments.",
  },
];

export default function PopularCategories() {
  return (
    <section className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <span className="text-sm uppercase tracking-[0.3em] text-amber-700 font-medium">
            Discover Our Collections
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-stone-900">
            Curated for You
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto font-light text-lg">
            Explore our hand-picked categories, featuring the finest craftsmanship and timeless designs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/collections/${category.slug}`}
              className="group relative block h-[500px] overflow-hidden bg-stone-200"
            >
              {/* Image Background */}
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-xs uppercase tracking-[0.2em] mb-2 opacity-90">
                    {category.headline}
                  </p>
                  <h3 className="text-3xl font-serif mb-3">
                    {category.name}
                  </h3>
                  <p className="text-stone-200 font-light mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 max-w-xs">
                    {category.blurb}
                  </p>
                  
                  <div className="inline-flex items-center gap-2 text-sm font-medium border-b border-white/0 group-hover:border-white/100 pb-1 transition-all duration-300">
                    Shop Collection
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
