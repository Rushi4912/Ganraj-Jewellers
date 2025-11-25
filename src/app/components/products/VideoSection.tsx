"use client";

import React from "react";
import { ShoppingCart } from "lucide-react";
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
    <section className="w-full bg-gradient-to-b from-slate-50 to-white py-16">
      {/* Headline */}
      <div className="max-w-7xl mx-auto px-4 text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-serif font-light tracking-wide mb-3 text-gray-900">
          Jewellery in Motion
        </h2>
        <p className="text-gray-500 text-sm md:text-base tracking-wider uppercase">
          Experience our craftsmanship through elegant showcases
        </p>
      </div>
      {/* Video Products */}
      <div className="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-6 px-4 max-w-7xl mx-auto">
        {videos.map((video, index) => (
          <div
            key={`${video.title}-${index}`}
            className="group w-full sm:w-[48%] md:w-[30%] lg:w-[18%] bg-white rounded-[28px] overflow-hidden shadow-2xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
          >
            <div className="relative w-full h-[250px] sm:h-[300px] md:h-[320px] overflow-hidden bg-gray-100">
              <video
                autoPlay
                loop
                muted
                playsInline
                controls
                preload="metadata"
                poster={video.poster}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              >
                <source src={video.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            </div>
            <div className="px-6 py-5">
              <h3 className="font-serif text-lg text-gray-900 mb-1 tracking-wide">{video.title}</h3>
              <p className="text-xl font-light text-gray-800 mb-4 tracking-wide">{video.price}</p>
              <button
                onClick={() => handleAddToCart(video, index)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2.5 px-4 text-xs tracking-[0.3em] uppercase rounded-2xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/40 transition-all duration-200"
              >
                <ShoppingCart className="w-3 h-3 transition-transform duration-200" />
                Add to cart
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