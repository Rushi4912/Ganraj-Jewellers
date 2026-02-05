import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function PopularCategories() {
  const categories = [
    {
      name: "Necklaces",
      slug: "necklaces",
      image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800&q=80",
      headline: "The Statement Edit",
      gridClass: "col-span-1 md:col-span-2 lg:col-span-2 row-span-2",
      heightClass: "h-[380px] lg:h-[450px]",
    },
    {
      name: "Rings",
      slug: "rings",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      headline: "Forever Symbols",
      gridClass: "col-span-1 md:col-span-1 lg:col-span-1 row-span-1",
      heightClass: "h-[220px]",
    },
    {
      name: "Bracelets",
      slug: "bracelets",
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80",
      headline: "Wrist Adornments",
      gridClass: "col-span-1 md:col-span-1 lg:col-span-1 row-span-1",
      heightClass: "h-[220px]",
    },
    {
      name: "Earrings",
      slug: "earrings",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
      headline: "Face Framing",
      gridClass: "col-span-1 md:col-span-1 lg:col-span-1 row-span-1",
      heightClass: "h-[260px]",
    },
    {
      name: "Bridal",
      slug: "bespoke-bridal",
      image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80",
      headline: "The Big Day",
      gridClass: "col-span-1 md:col-span-2 lg:col-span-2 row-span-1",
      heightClass: "h-[260px]",
    },
  ];

  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ backgroundColor: '#F2F0EB' }}
    >


      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <span className="block text-xs uppercase tracking-[0.3em] text-[#8B7355] font-medium animate-fadeIn">
              Curated Collections
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#2D2A26] leading-tight animate-fadeInUp">
              Discover unique <span className="italic text-[#8B7355]">perspectives</span>
            </h2>
          </div>
          <Link
            href="/collections"
            className="group hidden md:flex items-center gap-3 pb-2 border-b border-[#C5B4A5] text-[#5A4D41] hover:text-[#8B7355] transition-colors"
          >
            <span className="text-sm tracking-widest uppercase font-medium">View All Categories</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-2" />
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              href={`/collections/${category.slug}`}
              className={`group relative block overflow-hidden rounded-[32px] border border-[#E5E0D8] shadow-sm hover:shadow-xl transition-all duration-500 ${category.gridClass} ${category.heightClass}`}
            >
              {/* Image */}
              <div className="relative w-full h-full overflow-hidden bg-[#E5E0D8]">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  unoptimized
                />

                {/* Overlay - subtle dark gradient from bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                {/* Hover Reveal Overlay - Full fill for extra drama on some or just the existing gradient? Keeping it elegant with gradient. */}
              </div>

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-3 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    <span className="w-8 h-[1px] bg-[#B8923A]"></span>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/90">
                      {category.headline}
                    </p>
                  </div>

                  <div className="flex justify-between items-end">
                    <h3 className="text-3xl lg:text-4xl font-serif text-white leading-none">
                      {category.name}
                    </h3>
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-white hover:text-[#8B7355] text-white translate-x-4 group-hover:translate-x-0">
                      <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {/* Mobile View All Link - Shown only on Mobile */}
          <div className="md:hidden flex justify-center mt-8">
            <Link
              href="/collections"
              className="flex items-center gap-2 px-6 py-3 rounded-full border border-[#C5B4A5] text-[#5A4D41] hover:bg-[#8B7355] hover:text-white transition-all duration-300"
            >
              <span className="text-xs tracking-widest uppercase font-bold">View All Collections</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

