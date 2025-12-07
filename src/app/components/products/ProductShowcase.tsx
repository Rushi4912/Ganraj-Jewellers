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
  Plus,
  Minus,
} from "lucide-react";
import { Product, SelectedVariants } from "../../types/product";
import { useCart } from "../../context/CartContext";
import VariantSelector from "./VariantSelector";
import Image from "next/image";

interface ProductShowcaseProps {
  product: Product;
}

const AccordionItem = ({
  title,
  children,
  isOpen,
  onClick,
}: {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <div className="border-b border-gray-200">
      <button
        type="button"
        className="w-full py-4 flex items-center justify-between text-left group"
        onClick={onClick}
      >
        <span className="text-base font-medium text-gray-900 group-hover:text-amber-600 transition-colors">
          {title}
        </span>
        {isOpen ? (
          <Minus size={20} className="text-gray-900" />
        ) : (
          <Plus size={20} className="text-gray-900" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100 mb-4" : "max-h-0 opacity-0"
        }`}
      >
        <div className="text-sm text-gray-600 leading-relaxed">{children}</div>
      </div>
    </div>
  );
};

export default function ProductShowcase({ product }: ProductShowcaseProps) {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<SelectedVariants>({});
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const isInWishlist = wishlist.includes(product.id);

  // Ensure at least 3 images for the gallery layout as requested
  const galleryImages = useMemo(() => {
    const images =
      product.images.length > 0 ? product.images : [product.image];
    
    // If we have fewer than 3 images, duplicate the first one to fill the slots
    // to meet the "need 3 images" requirement for the layout
    if (images.length < 3) {
      const filledImages = [...images];
      while (filledImages.length < 3) {
        filledImages.push(images[0]);
      }
      return filledImages;
    }
    return images;
  }, [product.images, product.image]);

  const finalPrice = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return product.price;
    }
    let price = product.price;
    product.variants.forEach((variant) => {
      const selectedValue = selectedVariants[variant.type];
      if (selectedValue) {
        const variantOption = variant.options.find(
          (option) => option.id === selectedValue
        );
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

  const ringSizes = product.ringSizes?.length ? product.ringSizes : ["6", "7", "8", "9"];
  const braceletSizes = product.braceletSizes?.length ? product.braceletSizes : ["6.5\"", "7\"", "7.5\""];
  const payalSizes = product.payalSizes?.length ? product.payalSizes : ["8\"", "9\"", "10\""];

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

  const toggleAccordion = (title: string) => {
    // Keep interactions lightweight; avoid scroll jumps
    requestAnimationFrame(() => {
      setOpenAccordion((prev) => (prev === title ? null : title));
    });
  };

  return (
    <div className="bg-white">
      <section className="relative py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Gallery Section */}
            <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <div className="relative aspect-square rounded-none overflow-hidden bg-gray-100">
                <Image
                  src={galleryImages[selectedImage] || product.image}
                  alt={`${product.name} view ${selectedImage + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  unoptimized
                  priority
                />
                {product.badge && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-black text-white text-xs font-bold tracking-wider uppercase">
                    {product.badge}
                  </div>
                )}
              </div>

              {galleryImages.length > 1 && (
                <div className="grid grid-cols-3 gap-4">
                  {galleryImages.map((img, index) => (
                    <button
                      key={img + index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square overflow-hidden transition-all duration-200 ${
                        selectedImage === index
                          ? "ring-1 ring-black opacity-100"
                          : "opacity-70 hover:opacity-100"
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
            </div>

            {/* Product Info Section */}
            <div className="flex flex-col pt-6 lg:pt-0">
              <div className="border-b border-gray-200 pb-6 mb-6">
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Link
                      href="/shop"
                      className="hover:text-black transition-colors uppercase tracking-wider text-xs"
                    >
                      Home
                    </Link>
                    <span>/</span>
                    <span className="uppercase tracking-wider text-xs">
                      {product.category}
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-medium text-gray-900 tracking-tight">
                    {product.name}
                  </h1>
                </div>

                <div className="flex items-end gap-4 mb-4">
                  <div className="text-2xl font-medium text-gray-900">
                    ₹ {finalPrice.toFixed(2)}
                  </div>
                  {product.originalPrice && (
                    <div className="text-lg text-gray-400 line-through mb-1">
                      ₹ {product.originalPrice.toFixed(2)}
                    </div>
                  )}
                  {product.originalPrice && (
                    <span className="text-green-600 text-sm font-medium mb-1">
                      Save{" "}
                      {Math.round(
                        ((product.originalPrice - product.price) /
                          product.originalPrice) *
                          100
                      )}
                      %
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="text-black fill-black" size={14} />
                    <span className="font-medium">{averageRating}</span>
                  </div>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-600">
                    {product.reviews} Reviews
                  </span>
                  <span className="text-gray-300">|</span>
                  <span
                    className={`${
                      product.inStock ? "text-green-600" : "text-red-600"
                    } font-medium`}
                  >
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>

              {product.variants && product.variants.length > 0 && (
                <div className="mb-8">
                  <p className="text-sm font-medium text-gray-900 mb-3 uppercase tracking-wide">
                    Customize
                  </p>
                  <VariantSelector
                    variants={product.variants}
                    selectedVariants={selectedVariants}
                    onChange={handleVariantChange}
                  />
                </div>
              )}

              <div className="flex flex-col gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || !canAddToCart}
                  className="w-full bg-black text-white h-14 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {product.inStock ? (
                    canAddToCart ? (
                      <>
                        ADD TO BAG <span className="ml-2">→</span>
                      </>
                    ) : (
                      "Select Options"
                    )
                  ) : (
                    "Out of Stock"
                  )}
                </button>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`h-12 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider border transition-colors ${
                      isInWishlist
                        ? "border-black bg-black text-white"
                        : "border-gray-200 hover:border-black text-gray-900"
                    }`}
                  >
                    <Heart
                      size={16}
                      className={isInWishlist ? "fill-white" : ""}
                    />
                    {isInWishlist ? "Saved" : "Wishlist"}
                  </button>
                  <button className="h-12 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider border border-gray-200 hover:border-black text-gray-900 transition-colors">
                    <Share2 size={16} />
                    Share
                  </button>
                </div>
              </div>

              {/* Accordion Section */}
              <div className="border-t border-gray-200">
                <AccordionItem
                  title="Description"
                  isOpen={openAccordion === "Description"}
                  onClick={() => toggleAccordion("Description")}
                >
                  <p>
                    {product.description ||
                      "Each piece is crafted by artisans with over two decades of experience, blending traditional workmanship with contemporary silhouettes."}
                  </p>
                  <ul className="mt-4 space-y-2 list-disc pl-4">
                    <li>Authentic 999 Fine Silver / S925 Sterling Silver</li>
                    <li>Hypoallergenic & Nickel-Free</li>
                    <li>Handcrafted with precision</li>
                  </ul>
                </AccordionItem>

                <AccordionItem
                  title="Specification"
                  isOpen={openAccordion === "Specification"}
                  onClick={() => toggleAccordion("Specification")}
                >
                  {product.specification ? (
                    <p className="text-sm text-gray-700 leading-relaxed">{product.specification}</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                      <span className="text-gray-500">Material</span>
                      <span className="font-medium">Sterling Silver</span>
                      <span className="text-gray-500">Purity</span>
                      <span className="font-medium">925 / 999</span>
                      <span className="text-gray-500">Finish</span>
                      <span className="font-medium">High Polish / Matte</span>
                      <span className="text-gray-500">Origin</span>
                      <span className="font-medium">India</span>
                    </div>
                  )}
                </AccordionItem>

                <AccordionItem
                  title="Supplier Information"
                  isOpen={openAccordion === "Supplier Information"}
                  onClick={() => toggleAccordion("Supplier Information")}
                >
                  <p>
                    {product.supplierInfo ||
                      "Sourced directly from our trusted artisan network in Mumbai and Jaipur. We ensure fair trade practices and sustainable sourcing for all our materials."}
                  </p>
                </AccordionItem>

                <AccordionItem
                  title="Size Guide"
                  isOpen={openAccordion === "Size Guide"}
                  onClick={() => toggleAccordion("Size Guide")}
                >
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Ring sizes</p>
                      <div className="flex flex-wrap gap-2">
                        {ringSizes.map((size) => (
                          <span
                            key={size}
                            className="text-xs px-3 py-1 rounded-full border border-gray-200 text-gray-800"
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Bracelet sizes</p>
                      <div className="flex flex-wrap gap-2">
                        {braceletSizes.map((size) => (
                          <span
                            key={size}
                            className="text-xs px-3 py-1 rounded-full border border-gray-200 text-gray-800"
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Payal sizes</p>
                      <div className="flex flex-wrap gap-2">
                        {payalSizes.map((size) => (
                          <span
                            key={size}
                            className="text-xs px-3 py-1 rounded-full border border-gray-200 text-gray-800"
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </AccordionItem>

                <AccordionItem
                  title="Returns"
                  isOpen={openAccordion === "Returns"}
                  onClick={() => toggleAccordion("Returns")}
                >
                  <p>
                    We offer a 15-day return policy for unused and unworn items. 
                    Returns must include original packaging and purity certificates.
                    Personalized items are non-returnable.
                  </p>
                </AccordionItem>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-200">
                <div className="text-center space-y-2">
                  <div className="mx-auto w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                    <Truck size={20} className="text-gray-900" />
                  </div>
                  <p className="text-xs font-medium uppercase tracking-wide">
                    Fast Shipping
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <div className="mx-auto w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                    <ShieldCheck size={20} className="text-gray-900" />
                  </div>
                  <p className="text-xs font-medium uppercase tracking-wide">
                    Lifetime Warranty
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <div className="mx-auto w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                    <RotateCcw size={20} className="text-gray-900" />
                  </div>
                  <p className="text-xs font-medium uppercase tracking-wide">
                    Easy Returns
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}