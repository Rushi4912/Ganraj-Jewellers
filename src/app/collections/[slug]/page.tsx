import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Shield,
  Star,
} from "lucide-react";

const collectionMap = {
  necklaces: {
    title: "Necklaces Atelier",
    subtitle: "Grace Your Neckline",
    hero:
      "https://images.unsplash.com/photo-1620656798579-1984d9e87df7?w=2000&auto=format&fit=crop&q=80",
    description:
      "Our necklace collection is a tribute to the art of layering. From delicate chains that whisper elegance to statement chokers that command attention, each piece is crafted to sit flawlessly.",
    details: [
      "Handcrafted in 22k Gold",
      "Ethically Sourced Gemstones",
      "Adjustable Lengths",
      "Heirloom Quality",
    ],
    images: [
      "https://images.unsplash.com/photo-1676329945867-01c9975aa9d1?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&auto=format&fit=crop&q=80",
    ],
  },

  rings: {
    title: "Ring Salon",
    subtitle: "Symbols of Eternity",
    hero:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=2000&auto=format&fit=crop&q=80",
    description:
      "Discover rings that speak a language of their own. Whether it's a solitaire marking a new beginning or a stackable band celebrating a milestone, our designs marry tradition with sculpted geometry.",
    details: [
      "Certified Diamonds",
      "Platinum & Gold Options",
      "Custom Engraving",
      "Comfort Fit Bands",
    ],
    images: [
      "https://images.unsplash.com/photo-1631883971900-fa9c798aee92?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1612239396116-4da3087f8f79?w=800&auto=format&fit=crop&q=80",
    ],
  },

  bracelets: {
    title: "Bracelets & Cuffs",
    subtitle: "Wrist Adornments",
    hero:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=2000&auto=format&fit=crop&q=80",
    description:
      "Fluidity meets structure in our bracelet collection. Tennis lines, open bangles, and flexible mesh designs move with you, offering a seamless blend of comfort and couture.",
    details: [
      "Secure Clasp Mechanisms",
      "Hypoallergenic Alloys",
      "Stackable Designs",
      "High-Polish Finish",
    ],
    images: [
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&auto=format&fit=crop&q=80",
    ],
  },

  earrings: {
    title: "Earring Library",
    subtitle: "Frame Your Face",
    hero:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=2000&auto=format&fit=crop&q=80",
    description:
      "From understated studs to dramatic chandeliers, our earrings are designed to catch the light and frame every occasion. Explore heritage meenakari and modern sculptural motifs.",
    details: [
      "Lightweight Engineering",
      "Secure Backings",
      "Variety of Styles",
      "Nickel-Free",
    ],
    images: [
      "https://images.unsplash.com/photo-1475179593777-bd12fd56b85d?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1693212793204-bcea856c75fe?w=800&auto=format&fit=crop&q=80",
    ],
  },

  "chains-bangles": {
    title: "Chains & Bangles",
    subtitle: "Modern Classics",
    hero:
      "https://images.unsplash.com/photo-1679156271456-d6068c543ee7?w=2000&auto=format&fit=crop&q=80",
    description:
      "The foundation of any jewellery wardrobe. Our chains and bangles bridge the gap between temple artistry and modern minimalism, perfect for mixing, matching, and making a statement.",
    details: [
      "Solid Gold Construction",
      "Durable Links",
      "Traditional Motifs",
      "Versatile Styling",
    ],
    images: [
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&q=80",
    ],
  },

  "bespoke-bridal": {
    title: "Bespoke Bridal",
    subtitle: "The Wedding Suite",
    hero:
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=2000&auto=format&fit=crop&q=80",
    description:
      "Your love story, immortalized in gold and gems. Our bespoke bridal service offers a collaborative journey to create heirloom suites that will be cherished for generations.",
    details: [
      "Personalized Consultation",
      "Custom Sketches",
      "Sourcing Rare Gems",
      "Trousseau Packaging",
    ],
    images: [
      "https://images.unsplash.com/flagged/photo-1551854716-8b811be39e7e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1610047614301-13c63f00c032?w=800&auto=format&fit=crop&q=80",
    ],
  },
} as const;

type CollectionSlug = keyof typeof collectionMap;

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const key = slug as CollectionSlug;
  const collection = collectionMap[key];

  if (!collection) {
    notFound();
  }

  return (
    <main className="bg-white min-h-screen">
      {/* Navigation Breadcrumb */}
      <div className="fixed top-0 left-0 z-50 p-6 w-full pointer-events-none">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <Link
            href="/collections"
            className="pointer-events-auto inline-flex items-center gap-3 text-white/90 hover:text-white transition-all duration-300 text-sm uppercase tracking-widest font-medium bg-black/20 backdrop-blur-md px-6 py-3 rounded-full hover:bg-black/40 border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <img
          src={collection.hero}
          alt={collection.title}
          className="absolute inset-0 w-full h-full object-cover animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent opacity-90" />

        <div className="absolute bottom-0 left-0 w-full p-8 md:p-20">
          <div className="max-w-[1400px] mx-auto">
            <div className="animate-fade-in-up space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-[1px] w-12 bg-amber-400/80"></div>
                <span className="text-amber-300 text-sm md:text-base uppercase tracking-[0.4em] font-semibold">
                  {collection.subtitle}
                </span>
              </div>
              <h1 className="text-5xl md:text-8xl lg:text-9xl font-serif text-white leading-none tracking-tight">
                {collection.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative z-10 -mt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left Column: Description & Details */}
          <div className="lg:col-span-5 space-y-12 pt-12">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-stone-100">
              <h2 className="text-3xl font-serif text-stone-900 mb-8">
                The Collection
              </h2>
              <p className="text-stone-600 text-lg leading-relaxed font-light mb-10">
                {collection.description}
              </p>

              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400">
                  Highlights
                </h3>
                <ul className="space-y-4">
                  {collection.details.map((detail, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-4 text-stone-700 group"
                    >
                      <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                        <Check className="w-4 h-4 text-amber-600" />
                      </div>
                      <span className="font-medium">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-12 pt-8 border-t border-stone-100 flex flex-col gap-4">
                <Link
                  href="/contact"
                  className="w-full bg-stone-900 text-white px-8 py-4 rounded-xl text-center font-medium hover:bg-stone-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                >
                  Book Private Viewing
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/shop"
                  className="w-full bg-white border border-stone-200 text-stone-900 px-8 py-4 rounded-xl text-center font-medium hover:bg-stone-50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  View Catalog
                </Link>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-stone-50 p-6 rounded-2xl text-center">
                <Shield className="w-8 h-8 text-stone-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-stone-600">
                  Lifetime Warranty
                </p>
              </div>
              <div className="bg-stone-50 p-6 rounded-2xl text-center">
                <Star className="w-8 h-8 text-stone-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-stone-600">
                  Certified Quality
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Gallery */}
          <div className="lg:col-span-7 space-y-8 lg:pt-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {collection.images.map((img, idx) => (
                <div
                  key={idx}
                  className={`relative overflow-hidden rounded-3xl shadow-lg group`}
                >
                  <div className="aspect-[3/4]">
                    <img
                      src={img}
                      alt={`${collection.title} detail ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-amber-900 text-white p-8 md:p-10 rounded-3xl shadow-xl relative overflow-hidden mt-16">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-800 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
              <div className="relative z-10 flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 backdrop-blur-sm border border-white/20">
                  <Clock className="w-6 h-6 text-amber-200" />
                </div>
                <div>
                  <h4 className="text-xl font-serif mb-2 text-amber-50">
                    Made to Order
                  </h4>
                  <p className="text-white/70 leading-relaxed font-light">
                    Each piece in this collection is crafted specifically for
                    you by our master artisans. Please allow 2-4 weeks for the
                    creation and delivery of your bespoke item.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
