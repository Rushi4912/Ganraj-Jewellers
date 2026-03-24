"use client";

import { useCart } from "../context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Trash2, ArrowRight, Heart } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ShoppingCartSidebar from "../components/cart/ShoppingCart";
import { useState } from "react";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const [showCart, setShowCart] = useState(false);

  // Products are now fully stored in the wishlist
  const wishlistProducts = wishlist;

  return (
    <>
      <Navbar onCartOpen={() => setShowCart(true)} />

      <main className="bg-[#F2F0EB] min-h-screen pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-[#C5B4A5]/30 pb-8">
            <div>
              <div className="inline-flex items-center gap-2 text-[#8B7355] text-xs font-bold tracking-[0.3em] uppercase mb-4 animate-fadeInUp">
                <Heart size={14} />
                <span>Your Curation</span>
              </div>
              <h1 className="font-display text-5xl text-[#2D2A26] animate-fadeInUp-delay-1">
                Wishlist
              </h1>
            </div>
            <div className="mt-6 md:mt-0 text-[#6B5D52] text-sm font-medium animate-fadeInUp-delay-2">
              {wishlistProducts.length} {wishlistProducts.length === 1 ? 'Treasure' : 'Treasures'} Saved
            </div>
          </div>

          {/* Content */}
          {wishlistProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center animate-fadeInUp">
              <div className="w-24 h-24 rounded-full bg-[#E5E0D8] flex items-center justify-center mb-8">
                <Heart size={32} className="text-[#C5B4A5]" />
              </div>
              <h2 className="font-display text-3xl text-[#2D2A26] mb-4">Your collection is waiting.</h2>
              <p className="text-[#6B5D52] max-w-md mx-auto mb-10 leading-relaxed">
                Explore our atelier to find pieces that speak to you. Save them here to curate your personal style.
              </p>
              <Link href="/shop" className="px-8 py-3 bg-[#2D2A26] text-white rounded-full font-medium hover:bg-[#8B7355] transition-colors duration-300">
                Discover Collections
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
              {wishlistProducts.map((product) => (
                <div key={product.id} className="group flex flex-col animate-fadeInUp">
                  {/* Image */}
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[20px] bg-[#E5E0D8] mb-6">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Actions Overlay */}
                    <div className="absolute inset-x-0 bottom-4 px-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => {
                          addToCart(product);
                          setShowCart(true);
                        }}
                        className="flex-1 bg-white/90 backdrop-blur text-[#2D2A26] py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#2D2A26] hover:text-white transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingBag size={14} />
                        Add to Bag
                      </button>
                      <button
                        onClick={() => toggleWishlist(product)}
                        className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-[#2D2A26] hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Details */}
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-display text-xl text-[#2D2A26] group-hover:text-[#8B7355] transition-colors">
                        <Link href={`/shop/${product.id}`}>{product.name}</Link>
                      </h3>
                      <span className="text-[#2D2A26] font-medium">₹{product.price.toLocaleString()}</span>
                    </div>
                    <p className="text-[#6B5D52] text-sm line-clamp-2 mb-4">{product.description}</p>
                    <Link
                      href={`/shop/${product.id}`}
                      className="inline-flex items-center gap-2 text-[#8B7355] text-xs font-bold uppercase tracking-wider hover:text-[#2D2A26] transition-colors"
                    >
                      View Details <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      <ShoppingCartSidebar isOpen={showCart} onClose={() => setShowCart(false)} />
      <Footer />
    </>
  );
}
