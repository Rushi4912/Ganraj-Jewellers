"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Heart, ShoppingCart, Eye, GitCompare } from "lucide-react";
import { Product } from "../../types/product";
import { useCart } from "../../context/CartContext";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({
  product,
  onQuickView,
}: ProductCardProps) {
  const { addToCart, wishlist, compareList, toggleWishlist, toggleCompare } = useCart();

  const isInWishlist = wishlist.includes(product.id);
  const productPath = product.slug ?? product.remoteId ?? product.id;

  return (
    <div className="group relative">
      {/* Product Image Container */}
      <div className="relative overflow-hidden rounded-xl mb-4 bg-gray-50 aspect-square">
        <Link
          href={`/shop/${productPath}`}
          className="block h-full"
          aria-label={`View ${product.name}`}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            unoptimized
          />
        </Link>

        {/* Badge */}
        {product.badge && (
          <span
            className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white ${
              product.badge === "SALE" ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {product.badge}
          </span>
        )}

        {/* Hover Actions */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity space-y-2">
          {/* Wishlist Button */}
          <button
            onClick={() => toggleWishlist(product.id)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-lg ${
              isInWishlist
                ? "bg-red-500 text-white"
                : "bg-white hover:bg-amber-500 hover:text-white"
            }`}
            title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={18} className={isInWishlist ? "fill-white" : ""} />
          </button>

          {/* Quick View Button */}
          <button
            onClick={() => onQuickView?.(product)}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors shadow-lg"
            title="Quick view"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => toggleCompare(product.id)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-lg ${
              compareList.includes(product.id)
                ? "bg-blue-500 text-white"
                : "bg-white hover:bg-amber-500 hover:text-white"
            }`}
            title="Add to compare"
          >
            <GitCompare size={18} />
          </button>

          {/* Add to Cart Button */}
          <button
            onClick={() => addToCart(product)}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors shadow-lg"
            title="Add to cart"
          >
            <ShoppingCart size={18} />
          </button>
        </div>

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="text-center">
        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
          Gold Jewellery
        </p>

        <Link
          href={`/shop/${productPath}`}
          className="text-sm font-semibold text-gray-900 mb-2 hover:text-amber-600 transition-colors cursor-pointer block"
        >
          {product.name}
        </Link>

        {/* Rating */}
        <div className="flex items-center justify-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={
                i < Math.floor(product.rating)
                  ? "text-amber-400 fill-amber-400"
                  : "text-gray-300"
              }
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">
            ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            ₹ {product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              ₹ {product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
