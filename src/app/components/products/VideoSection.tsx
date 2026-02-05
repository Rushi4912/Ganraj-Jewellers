"use client";

import React from "react";
import { ShoppingCart, Play } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { useToast } from "@/app/context/ToastContext";
import { Product } from "@/app/types/product";

const videos = [
  {
    src: "/videos/video1.mp4",
    title: "Elegant Necklace",
    price: "₹ 2990",
    poster:
      "https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    src: "/videos/video2.mp4",
    title: "Diamond Ring",
    price: "₹ 1999",
    poster:
      "https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    src: "/videos/video3.mp4",
    title: "Gold Bracelet",
    price: "₹ 1990",
    poster:
      "https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    src: "/videos/video4.mp4",
    title: "Silver Earrings",
    price: "₹ 1490",
    poster:
      "https://images.pexels.com/photos/1456221/pexels-photo-1456221.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    src: "/videos/video5.mp4",
    title: "Pearl Collection",
    price: "₹ 1500",
    poster:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=compress&cs=tinysrgb&w=600",
  },
];

const VideoSection = () => {
  const { addToCart } = useCart();
  const toast = useToast();

  const handleAddToCart = (video: (typeof videos)[number], index: number) => {
    const fallbackImage = video.poster;
    const priceValue = Number(video.price.replace(/[^0-9.]/g, "")) || 0;

    const product: Product = {
      id: 9000 + index,
      remoteId: `video-${index}`,
      slug: `atelier-video-${index}`,
      name: `${video.title} Showcase`,
      category: "necklaces",
      price: priceValue,
      originalPrice: undefined,
      rating: 4.8,
      reviews: 48,
      image: fallbackImage,
      images: [fallbackImage],
      badge: "NEW",
      description: "A curated piece inspired by our motion stories.",
      inStock: true,
      userReviews: [],
      variants: undefined,
    };

    addToCart(product);
    toast.success("Added to cart!");
  };

  return (
    <section
      className="w-full pt-20 pb-10 relative overflow-hidden"
      style={{ backgroundColor: '#F2F0EB' }}
    >


      {/* Headline */}
      <div className="max-w-7xl mx-auto px-6 text-center mb-16 relative z-10">
        <h2 className="text-4xl md:text-6xl font-serif font-medium tracking-tight mb-4 text-[#2D2A26] animate-fadeInUp">
          <span className="block text-[#8B7355] text-lg md:text-xl font-sans uppercase tracking-[0.3em] mb-4">Cinematic Experience</span>
          Jewellery in Motion
        </h2>
        <p className="text-[#6B5D52] text-base md:text-lg max-w-2xl mx-auto leading-relaxed animate-fadeInUp-delay-1">
          Witness the light dance across our finest cuts. A visual journey through craftsmanship and elegance.
        </p>
      </div>

      {/* Video Products Grid */}
      <div className="flex flex-wrap justify-center gap-8 px-4 max-w-[1400px] mx-auto">
        {videos.map((video, index) => (
          <div
            key={`${video.title}-${index}`}
            className="group w-full sm:w-[48%] lg:w-[18%] bg-white rounded-[24px] overflow-hidden shadow-[0_10px_30px_-10px_rgba(45,42,38,0.1)] hover:shadow-[0_20px_40px_-10px_rgba(139,115,85,0.2)] transition-all duration-500 border border-[#E5E0D8]/50 animate-fadeInUp-delay-2"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Video Container */}
            <div className="relative w-full h-[320px] overflow-hidden bg-[#E5E0D8]">
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                poster={video.poster}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              >
                <source src={video.src} type="video/mp4" />
                <img src={video.poster} alt={video.title} className="w-full h-full object-cover" />
              </video>

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D2A26]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Play Icon Hint */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/50 flex items-center justify-center">
                  <Play size={20} className="text-white fill-white ml-1" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-5 py-6 flex flex-col items-center text-center bg-gradient-to-b from-white to-[#F9F8F6]">
              <h3 className="font-serif text-lg text-[#2D2A26] mb-1 group-hover:text-[#8B7355] transition-colors duration-300">
                {video.title}
              </h3>
              <p className="text-[#8B7355] font-medium text-sm tracking-wider mb-5">
                {video.price}
              </p>

              <button
                onClick={() => handleAddToCart(video, index)}
                className="w-full flex items-center justify-center gap-2 bg-[#2D2A26] text-white py-3 px-4 text-[10px] tracking-[0.2em] uppercase font-bold rounded-lg hover:bg-[#8B7355] transition-all duration-300 group-hover:translate-y-0 translate-y-2 opacity-90 group-hover:opacity-100"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>


    </section>
  );
};

export default function JewelleryShowcase() {
  return (
    <div>
      <VideoSection />
    </div>
  );
}