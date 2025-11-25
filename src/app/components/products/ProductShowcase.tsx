"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Heart,
  Share2,
  ShoppingCart,
  Sparkles,
  Star,
  ShieldCheck,
  Truck,
  BadgeCheck,
  RotateCcw,
} from "lucide-react";
import { Product, SelectedVariants } from "../../types/product";
import { useCart } from "../../context/CartContext";
import VariantSelector from "./VariantSelector";
import Image from "next/image";

interface ProductShowcaseProps {
  product: Product;
}

export default function ProductShowcase({ product }: ProductShowcaseProps) {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<SelectedVariants>({});

  const isInWishlist = wishlist.includes(product.id);

  const galleryImages = product.images.length > 0 ? product.images : [product.image];

  const finalPrice = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return product.price;
    }
    let price = product.price;
    product.variants.forEach((variant) => {
      const selectedValue = selectedVariants[variant.type];
      if (selectedValue) {
        const variantOption = variant.options.find((option) => option.id === selectedValue);
        if (variantOption?.priceModifier) {
          price += variantOption.priceModifier;
        }
      }
    });
    return price;
  }, [product, selectedVariants]);

  const canAddToCart = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return true;
    return product.variants
      .filter((variant) => variant.required)
      .every((variant) => selectedVariants[variant.type]);
  }, [product, selectedVariants]);

  const averageRating =
    product.userReviews.length > 0
      ? (
          product.userReviews.reduce((sum, review) => sum + review.rating, 0) /
          product.userReviews.length
        ).toFixed(1)
      : product.rating.toFixed(1);

  const handleVariantChange = (type: string, value: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleAddToCart = () => {
    if (!canAddToCart || !product.inStock) return;
    addToCart(product, selectedVariants);
  };

  return (
    <div className="bg-gray-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 py-16">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-y-0 w-64 bg-gradient-to-b from-amber-200 via-transparent to-transparent blur-3xl left-0"></div>
          <div className="absolute inset-y-0 w-64 bg-gradient-to-b from-orange-200 via-transparent to-transparent blur-3xl right-0"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 text-sm text-amber-800">
            <div className="flex items-center gap-2">
              <Link href="/shop" className="hover:text-amber-600 transition-colors">
                Shop
              </Link>
              <span>/</span>
              <span className="capitalize">{product.category}</span>
              <span>/</span>
              <span className="text-gray-900 font-semibold">{product.name}</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Star className="text-amber-500 fill-amber-500" size={18} />
                <span className="font-semibold text-gray-900">{averageRating}</span>
                <span className="text-gray-500">({product.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-amber-500" />
                <span className="text-gray-700">Artisan finish</span>
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight max-w-4xl">
            {product.name}
          </h1>
          <p className="text-lg text-gray-600 mt-4 max-w-3xl">
            {product.description}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Gallery */}
            <div className="space-y-6">
              <div className="relative rounded-3xl overflow-hidden shadow-xl bg-white h-[480px]">
                <Image
                  src={galleryImages[selectedImage] || product.image}
                  alt={`${product.name} view ${selectedImage + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  unoptimized
                />
                {product.badge && (
                  <div className="absolute top-6 left-6 px-4 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg">
                    {product.badge}
                  </div>
                )}
                <div className="absolute bottom-6 left-6 flex items-center gap-4 bg-white/80 backdrop-blur rounded-full px-4 py-2 shadow-lg">
                  <ShieldCheck className="text-emerald-500" size={18} />
                  <span className="text-sm font-semibold text-gray-800">
                    Certified authenticity
                  </span>
                </div>
              </div>

              {galleryImages.length > 1 && (
                <div className="grid grid-cols-3 gap-4">
                  {galleryImages.map((img, index) => (
                    <button
                      key={img + index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                        selectedImage === index
                          ? "border-amber-500 shadow-lg"
                          : "border-transparent hover:border-amber-200"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="150px"
                        unoptimized
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  {
                    icon: <Truck size={24} className="text-amber-600" />,
                    title: "Express Shipping",
                    subtitle: "2-5 days nationwide",
                  },
                  {
                    icon: <ShieldCheck size={24} className="text-amber-600" />,
                    title: "Lifetime Plating",
                    subtitle: "Complimentary refresh",
                  },
                  {
                    icon: <RotateCcw size={24} className="text-amber-600" />,
                    title: "Easy Returns",
                    subtitle: "30-day window",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="p-4 rounded-2xl bg-white border border-amber-100 flex gap-3 items-start"
                  >
                    <div className="p-2 rounded-xl bg-amber-50">{item.icon}</div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="bg-white rounded-3xl shadow-xl p-8 space-y-8">
              <div>
                <p className="uppercase text-xs tracking-[0.3em] text-gray-500 mb-2">
                  {product.category}
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ₹ {finalPrice.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-400 line-through">
                      ₹ {product.originalPrice.toFixed(2)}
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-sm font-semibold">
                      Save{" "}
                      {Math.round(
                        ((product.originalPrice - product.price) / product.originalPrice) * 100
                      )}
                      %
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {product.inStock ? "In stock. Ships within 24h." : "Currently unavailable"}
                </p>
              </div>

              {product.variants && product.variants.length > 0 && (
                <div className="border border-gray-100 rounded-2xl p-6 bg-gray-50">
                  <div className="flex items-center gap-2 mb-4">
                    <BadgeCheck className="text-amber-500" size={18} />
                    <p className="text-sm font-semibold text-gray-800">Customize your piece</p>
                  </div>
                  <VariantSelector
                    variants={product.variants}
                    selectedVariants={selectedVariants}
                    onChange={handleVariantChange}
                  />
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Jewellery story</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description ||
                    "Each piece is crafted by artisans with over two decades of experience, blending traditional workmanship with contemporary silhouettes."}
                </p>
                <ul className="grid sm:grid-cols-2 gap-3 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Hypoallergenic finish
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Complimentary gift wrap
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Lifetime cleaning
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Ethical sourcing
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || !canAddToCart}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-2xl text-lg font-semibold flex items-center justify-center gap-3 shadow-lg shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ShoppingCart size={20} />
                  {product.inStock ? (canAddToCart ? "Add to cart" : "Select options") : "Out of stock"}
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`flex items-center justify-center gap-2 py-3 rounded-2xl border text-sm font-semibold transition-all ${
                      isInWishlist
                        ? "border-red-500 bg-red-50 text-red-600"
                        : "border-gray-200 hover:border-amber-500 hover:text-amber-600"
                    }`}
                  >
                    <Heart
                      size={18}
                      className={isInWishlist ? "fill-red-500 text-red-500" : "text-gray-700"}
                    />
                    {isInWishlist ? "Wishlisted" : "Add to wishlist"}
                  </button>

                  <button className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-gray-200 text-sm font-semibold hover:border-amber-500 hover:text-amber-600 transition-all">
                    <Share2 size={18} />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-white to-amber-50 border border-amber-100 shadow-sm">
              <Sparkles className="text-amber-500 mb-4" size={32} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Craftsmanship</h3>
              <p className="text-gray-600">
                Hand-polished details with meticulous attention to every curve and setting.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-gradient-to-br from-white to-rose-50 border border-rose-100 shadow-sm">
              <Truck className="text-rose-500 mb-4" size={32} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium delivery</h3>
              <p className="text-gray-600">
                Insured priority shipping with real-time tracking and unboxing-ready packaging.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-gradient-to-br from-white to-emerald-50 border border-emerald-100 shadow-sm">
              <ShieldCheck className="text-emerald-500 mb-4" size={32} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Assurance</h3>
              <p className="text-gray-600">
                Lifetime warranty on plating, free annual spa service, and authenticity certificate.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

