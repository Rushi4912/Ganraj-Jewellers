"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { Product as ShopProduct } from "../../types/product";
import { useCart } from "../../context/CartContext";

interface ProductCardProps {
  product: ShopProduct;
  onQuickView?: (product: ShopProduct) => void;
  className?: string;
}

export default function ProductCard({
  product,
  onQuickView,
  className = "",
}: ProductCardProps) {
  const router = useRouter();
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const [imageError, setImageError] = useState(false);

  const isInWishlist = wishlist.includes(product.id);
  const currentImage =
    !imageError && product.image
      ? product.image
      : product.images && product.images.length > 0
        ? product.images[0]
        : "https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=400";

  const handleProductClick = () => {
    const destination = product.slug ?? product.remoteId ?? product.id.toString();
    router.push(`/shop/${destination}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView?.(product);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className={`group flex flex-col ${className}`}>
      {/* Image Container */}
      <div
        className="relative overflow-hidden rounded-[20px] bg-white shadow-sm mb-5 aspect-[4/5] cursor-pointer group-hover:shadow-[0_15px_30px_-5px_rgba(45,42,38,0.1)] transition-all duration-500"
        onClick={handleProductClick}
      >
        <Image
          src={currentImage}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          onError={() => setImageError(true)}
          unoptimized
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3">
            <span
              className={`px-3 py-1 text-[10px] font-bold tracking-widest uppercase text-white rounded-full ${product.badge === 'SALE' ? 'bg-[#B8923A]' : 'bg-[#2D2A26]'
                }`}
            >
              {product.badge}
            </span>
          </div>
        )}

        {/* Quick Actions Overlay */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out z-20">
          <button
            onClick={handleQuickViewClick}
            className="w-10 h-10 rounded-full bg-white text-[#5A4D41] flex items-center justify-center hover:bg-[#2D2A26] hover:text-white transition-all shadow-md hover:scale-110"
            title="Quick View"
          >
            <Eye size={16} />
          </button>

          <button
            onClick={handleWishlistClick}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md hover:scale-110 ${isInWishlist ? 'bg-[#8B7355] text-white' : 'bg-white text-[#5A4D41] hover:bg-[#8B7355] hover:text-white'
              }`}
          >
            <Heart size={16} className={isInWishlist ? 'fill-current' : ''} />
          </button>

          <button
            onClick={handleAddToCart}
            className="w-10 h-10 rounded-full bg-white text-[#5A4D41] flex items-center justify-center hover:bg-[#2D2A26] hover:text-white transition-all shadow-md hover:scale-110"
            title="Add to Cart"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="text-center space-y-1 px-2">
        <h3
          onClick={handleProductClick}
          className="text-base font-serif text-[#2D2A26] cursor-pointer hover:text-[#8B7355] transition-colors line-clamp-1"
        >
          {product.name}
        </h3>

        <div className="flex items-center justify-center gap-3 text-sm">
          <span className="font-semibold text-[#5A4D41]">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.originalPrice && (
            <span className="text-[#C5B4A5] line-through text-xs">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
