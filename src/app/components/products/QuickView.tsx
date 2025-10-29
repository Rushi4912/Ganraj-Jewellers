"use client";
import React from 'react';
import { X, ShoppingCart, Heart, Star } from 'lucide-react';
import { Product } from '../../types/product';
import { useCart } from '../../context/CartContext';

interface QuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onViewFullDetails: (product: Product) => void;
}

export default function QuickView({
  product,
  isOpen,
  onClose,
  onViewFullDetails,
}: QuickViewProps) {
  const { addToCart, wishlist, toggleWishlist } = useCart();

  if (!isOpen || !product) return null;

  const isInWishlist = wishlist.includes(product.id);

  const handleAddToCart = () => {
    addToCart(product);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-1">
                  Quick View
                </h2>
                <p className="text-sm text-gray-500">
                  Take a quick look at this item
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="relative">
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Badge */}
                {product.badge && (
                  <span
                    className={`absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-semibold text-white shadow-lg ${
                      product.badge === 'SALE' ? 'bg-red-500' : 'bg-green-500'
                    }`}
                  >
                    {product.badge}
                  </span>
                )}

                {/* Stock Status */}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
                    <span className="text-white font-bold text-xl">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex flex-col">
                <div className="flex-1">
                  {/* Category */}
                  <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                    {product.category}
                  </p>

                  {/* Product Name */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={
                            i < Math.floor(product.rating)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-gray-300'
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      {product.rating}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({product.reviews} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xl text-gray-400 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                    {product.originalPrice && (
                      <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded-full">
                        Save{' '}
                        {Math.round(
                          ((product.originalPrice - product.price) /
                            product.originalPrice) *
                            100
                        )}
                        %
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {product.description}
                  </p>

                  {/* Features */}
                  <div className="bg-amber-50 rounded-lg p-4 mb-6 border border-amber-200">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2 text-gray-700">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                        Free shipping on orders over $100
                      </li>
                      <li className="flex items-center gap-2 text-gray-700">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                        30-day money-back guarantee
                      </li>
                      <li className="flex items-center gap-2 text-gray-700">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                        Authenticity certificate included
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <ShoppingCart
                      size={22}
                      className="group-hover:scale-110 transition-transform"
                    />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>

                  {/* Secondary Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Add to Wishlist */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`py-3 rounded-lg border-2 flex items-center justify-center gap-2 font-semibold transition-all ${
                        isInWishlist
                          ? 'border-red-500 text-red-500 bg-red-50'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      <Heart
                        size={20}
                        className={isInWishlist ? 'fill-red-500' : ''}
                      />
                      {isInWishlist ? 'Wishlisted' : 'Wishlist'}
                    </button>

                    {/* View Full Details */}
                    <button
                      onClick={() => {
                        onViewFullDetails(product);
                        onClose();
                      }}
                      className="py-3 rounded-lg border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 font-semibold transition-all"
                    >
                      Full Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}