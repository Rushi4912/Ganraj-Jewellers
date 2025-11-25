"use client";
import React, { useState, useEffect } from "react";
import {
  X,
  ShoppingCart,
  Heart,
  Star,
  Package,
  Shield,
  Truck,
  Award,
} from "lucide-react";
import { Product } from "../../types/product";
import { useCart } from "../../context/CartContext";
import VariantSelector from "./VariantSelector";
import { SelectedVariants } from "../../types/product";
import Image from "next/image";
interface ProductDetailProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetail({
  product,
  isOpen,
  onClose,
}: ProductDetailProps) {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<
    "description" | "reviews" | "details"
  >("description");
  const [selectedVariants, setSelectedVariants] = useState<SelectedVariants>(
    {}
  ); // NEW

  useEffect(() => {
    if (product && isOpen) {
      setSelectedVariants({});
      setSelectedImage(0);
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const isInWishlist = wishlist.includes(product.id);

  // Handle variant selection
  const handleVariantChange = (type: string, value: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  // Calculate final price with variants
  const calculateFinalPrice = () => {
    let price = product.price;

    if (selectedVariants && product.variants) {
      product.variants.forEach((variantOption) => {
        const selectedValue = selectedVariants[variantOption.type];
        if (selectedValue) {
          const variant = variantOption.options.find(
            (opt) => opt.id === selectedValue
          );
          if (variant && variant.priceModifier) {
            price += variant.priceModifier;
          }
        }
      });
    }

    return price;
  };

  // Check if all required variants are selected
  const canAddToCart = () => {
    if (!product.variants) return true;

    return product.variants
      .filter((v) => v.required)
      .every((v) => selectedVariants[v.type]);
  };

  const handleAddToCart = () => {
    if (!canAddToCart()) {
      alert("Please select all required options");
      return;
    }
    addToCart(product, selectedVariants);
  };

  const finalPrice = calculateFinalPrice();
  // Calculate average rating from user reviews
  const calculateAverageRating = () => {
    if (product.userReviews.length === 0) return product.rating.toString(); // Return as string for display
    const sum = product.userReviews.reduce(
      (acc, review) => acc + review.rating,
      0
    );
    return (sum / product.userReviews.length).toFixed(1);
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
          className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h2>
                <p className="text-sm text-gray-500 uppercase tracking-wide">
                  {product.category}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              >
                <X size={28} />
              </button>
            </div>

            {/* Content Grid */}
            <div className="grid md:grid-cols-2 gap-12 mb-8">
              {/* Left Column - Images */}
              <div>
                {/* Main Image */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4">
                  <Image
                    src={product.images[selectedImage] || product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized
                  />

                  {/* Badge */}
                  {product.badge && (
                    <span
                      className={`absolute top-6 left-6 px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg ${
                        product.badge === "SALE" ? "bg-red-500" : "bg-green-500"
                      }`}
                    >
                      {product.badge}
                    </span>
                  )}

                  {/* Stock Status */}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Thumbnail Images */}
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {product.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === index
                            ? "border-amber-500 shadow-lg"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`${product.name} ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="100px"
                          unoptimized
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column - Details */}
              <div className="flex flex-col">
                {/* Rating */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={
                          i < Math.floor(parseFloat(calculateAverageRating()))
                            ? "text-amber-400 fill-amber-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {calculateAverageRating()}
                  </span>
                  <span className="text-gray-500">
                    ({product.reviews} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-4xl font-bold text-gray-900">
                      ₹ {finalPrice.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <>
                        <span className="text-2xl text-gray-400 line-through">
                          ₹ {product.originalPrice.toFixed(2)}
                        </span>
                        <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-bold rounded-full">
                          Save{" "}
                          {Math.round(
                            ((product.originalPrice - product.price) /
                              product.originalPrice) *
                              100
                          )}
                          %
                        </span>
                      </>
                    )}
                  </div>
                  {finalPrice !== product.price && (
                    <p className="text-sm text-green-600 font-semibold">
                      +₹ {(finalPrice - product.price).toFixed(2)} for selected
                      options
                    </p>
                  )}
                  <p className="text-sm text-green-600 font-semibold">
                    ✓ In stock and ready to ship
                  </p>
                </div>
                {/* Description */}
                <p className="text-gray-600 leading-relaxed mb-6">
                  {product.description}
                </p>
                {/* Variant Selector */}
                {product.variants && product.variants.length > 0 && (
                  <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="font-bold text-lg text-gray-900 mb-4">
                      Customize Your Item
                    </h3>
                    <VariantSelector
                      variants={product.variants}
                      selectedVariants={selectedVariants}
                      onChange={handleVariantChange}
                    />
                  </div>
                )}

                {/* Key Features */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Truck
                      className="text-amber-600 flex-shrink-0 mt-1"
                      size={24}
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">
                        Free Shipping
                      </h4>
                      <p className="text-xs text-gray-600">
                        On orders over ₹100
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Shield
                      className="text-amber-600 flex-shrink-0 mt-1"
                      size={24}
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">
                        30-Day Returns
                      </h4>
                      <p className="text-xs text-gray-600">
                        Money back guarantee
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Award
                      className="text-amber-600 flex-shrink-0 mt-1"
                      size={24}
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">
                        Certified Authentic
                      </h4>
                      <p className="text-xs text-gray-600">
                        Certificate included
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Package
                      className="text-amber-600 flex-shrink-0 mt-1"
                      size={24}
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">
                        Gift Packaging
                      </h4>
                      <p className="text-xs text-gray-600">Free luxury box</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 mt-auto">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock || !canAddToCart()}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <ShoppingCart
                      size={24}
                      className="group-hover:scale-110 transition-transform"
                    />
                    {!product.inStock
                      ? "Out of Stock"
                      : !canAddToCart()
                      ? "Select Options"
                      : "Add to Cart"}
                  </button>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`w-full py-4 rounded-lg border-2 flex items-center justify-center gap-3 font-bold text-lg transition-all ${
                      isInWishlist
                        ? "border-red-500 text-red-500 bg-red-50"
                        : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    <Heart
                      size={24}
                      className={isInWishlist ? "fill-red-500" : ""}
                    />
                    {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="border-t pt-8">
              {/* Tab Navigation */}
              <div className="flex gap-8 mb-8 border-b">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`pb-4 font-semibold transition-colors relative ${
                    activeTab === "description"
                      ? "text-amber-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Description
                  {activeTab === "description" && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600"></span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`pb-4 font-semibold transition-colors relative ${
                    activeTab === "reviews"
                      ? "text-amber-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Reviews ({product.userReviews.length})
                  {activeTab === "reviews" && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600"></span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("details")}
                  className={`pb-4 font-semibold transition-colors relative ${
                    activeTab === "details"
                      ? "text-amber-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Details
                  {activeTab === "details" && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600"></span>
                  )}
                </button>
              </div>

              {/* Tab Content */}
              <div className="min-h-[200px]">
                {activeTab === "description" && (
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed text-lg mb-4">
                      {product.description}
                    </p>
                    <h4 className="font-bold text-gray-900 mb-3">
                      Product Highlights:
                    </h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>✨ Premium quality craftsmanship</li>
                      <li>
                        💎 Genuine materials with certificate of authenticity
                      </li>
                      <li>🎁 Perfect for gifting on special occasions</li>
                      <li>♻️ Ethically sourced and sustainably made</li>
                      <li>🔒 Secure clasp/closure mechanism</li>
                    </ul>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div>
                    {product.userReviews.length > 0 ? (
                      <div className="space-y-6">
                        {/* Review Summary */}
                        <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="text-center">
                              <div className="text-5xl font-bold text-gray-900 mb-1">
                                {calculateAverageRating()}
                              </div>
                              <div className="flex items-center justify-center mb-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={20}
                                    className={
                                      i <
                                      Math.floor(
                                        parseFloat(calculateAverageRating())
                                      )
                                        ? "text-amber-400 fill-amber-400"
                                        : "text-gray-300"
                                    }
                                  />
                                ))}
                              </div>
                              <p className="text-sm text-gray-600">
                                Based on {product.reviews} reviews
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Individual Reviews */}
                        {product.userReviews.map((review, index) => (
                          <div
                            key={index}
                            className="border-b pb-6 last:border-b-0"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-bold text-gray-900">
                                  {review.name}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {review.date}
                                </p>
                              </div>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={16}
                                    className={
                                      i < review.rating
                                        ? "text-amber-400 fill-amber-400"
                                        : "text-gray-300"
                                    }
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Star
                          size={48}
                          className="mx-auto text-gray-300 mb-4"
                        />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          No reviews yet
                        </h3>
                        <p className="text-gray-600">
                          Be the first to review this product!
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "details" && (
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-4">
                        Product Specifications
                      </h4>
                      <dl className="space-y-3">
                        <div className="flex justify-between py-2 border-b">
                          <dt className="text-gray-600">Category:</dt>
                          <dd className="font-semibold text-gray-900 capitalize">
                            {product.category}
                          </dd>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <dt className="text-gray-600">Material:</dt>
                          <dd className="font-semibold text-gray-900">
                            18K Gold
                          </dd>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <dt className="text-gray-600">Weight:</dt>
                          <dd className="font-semibold text-gray-900">
                            Varies
                          </dd>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <dt className="text-gray-600">Availability:</dt>
                          <dd
                            className={`font-semibold ${
                              product.inStock
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {product.inStock ? "In Stock" : "Out of Stock"}
                          </dd>
                        </div>
                      </dl>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-4">
                        Care Instructions
                      </h4>
                      <ul className="space-y-3 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-amber-600 mt-1">•</span>
                          <span>Clean with soft cloth after each use</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-600 mt-1">•</span>
                          <span>Store in provided jewellery box</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-600 mt-1">•</span>
                          <span>Avoid contact with perfumes and chemicals</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-600 mt-1">•</span>
                          <span>Remove before swimming or showering</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
