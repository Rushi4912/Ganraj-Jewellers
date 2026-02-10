"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Heart,
  Share2,
  Star,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  RefreshCcw,
  Lock
} from "lucide-react";
import { Product, SelectedVariants } from "../../types/product";
import { useCart } from "../../context/CartContext";
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
    <div className="border-b border-[#E5E0D8]">
      <button
        type="button"
        className="w-full py-4 flex items-center justify-between text-left group"
        onClick={onClick}
      >
        <span className={`text-sm tracking-wide font-medium transition-colors ${isOpen ? 'text-[#2D2A26]' : 'text-[#6B5D52] group-hover:text-[#8B7355]'}`}>
          {title}
        </span>
        {isOpen ? (
          <Minus size={16} className="text-[#2D2A26]" />
        ) : (
          <Plus size={16} className="text-[#C5B4A5] group-hover:text-[#2D2A26]" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100 mb-6" : "max-h-0 opacity-0"
          }`}
      >
        <div className="text-sm text-[#6B5D52] leading-relaxed font-light pt-2">{children}</div>
      </div>
    </div>
  );
};

export default function ProductShowcase({ product }: ProductShowcaseProps) {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<SelectedVariants>({});
  const [openAccordion, setOpenAccordion] = useState<string | null>("Description");
  const [isAdding, setIsAdding] = useState(false);

  const isInWishlist = wishlist.includes(product.id);

  // Robust image handling
  const galleryImages = useMemo(() => {
    const images: string[] = [];

    // Add product.images if available
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach(img => {
        if (img && typeof img === 'string') images.push(img);
      });
    }

    // Fallback to product.image
    if (images.length === 0 && product.image) {
      images.push(product.image);
    }

    // Ultimate fallback
    if (images.length === 0) {
      return ["/placeholder.jpg"];
    }

    return images;
  }, [product]);

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

  const handleVariantChange = (type: string, value: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleAddToCart = async () => {
    if (!canAddToCart || !product.inStock) return;
    setIsAdding(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    addToCart(product, selectedVariants);
    setIsAdding(false);
  };

  const toggleAccordion = (title: string) => {
    setOpenAccordion((prev) => (prev === title ? null : title));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Ganraj Jewellers`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen font-sans">
      {/* Reduced top padding to fix margin issues */}
      <section className="relative pt-8 pb-16 lg:pt-12 lg:pb-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-widest text-[#8B8B8B] mb-8">
            <Link href="/" className="hover:text-[#2D2A26] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#2D2A26] transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-[#2D2A26] font-medium">{product.category}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20">

            {/* Gallery Section */}
            <div className="space-y-4">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-white shadow-sm border border-[#E5E0D8]">
                <Image
                  src={galleryImages[selectedImage]}
                  alt={`${product.name} - View ${selectedImage + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  priority
                />
                {product.badge && (
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-[#2D2A26] text-white text-[10px] font-bold tracking-widest uppercase">
                    {product.badge}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {galleryImages.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {galleryImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square overflow-hidden border transition-all duration-300 ${selectedImage === index
                          ? "border-[#2D2A26] ring-1 ring-[#2D2A26]"
                          : "border-transparent opacity-70 hover:opacity-100 hover:border-[#E5E0D8]"
                        }`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Section */}
            <div className="flex flex-col">

              <div className="mb-6 border-b border-[#E5E0D8] pb-6">
                {/* Category & Title */}
                <span className="text-xs font-bold tracking-widest text-[#8B8B8B] uppercase mb-2 block">
                  {product.category}
                </span>
                <h1 className="font-serif text-3xl md:text-4xl text-[#2D2A26] mb-4 leading-tight">
                  {product.name}
                </h1>

                {/* Price & Rating */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-medium text-[#2D2A26]">
                      ₹{finalPrice.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <>
                        <span className="text-sm text-[#8B8B8B] line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                        <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded">
                          Save {Math.round(((product.originalPrice - finalPrice) / product.originalPrice) * 100)}%
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs font-medium">
                    <div className="flex items-center gap-1">
                      <Star className="fill-black text-black" size={12} />
                      <span className="text-[#2D2A26]">{averageRating}</span>
                    </div>
                    <span className="text-[#8B8B8B]">|</span>
                    <span className="text-[#8B8B8B] decoration-solid underline">{product.reviews} Reviews</span>
                    <span className="text-[#8B8B8B]">|</span>
                    <span className={`${product.inStock ? 'text-green-700' : 'text-red-600'}`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-8">

                {/* Variants */}
                {product.variants && product.variants.length > 0 && (
                  <div className="space-y-4">
                    {product.variants.map((variant) => (
                      <div key={variant.type}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold uppercase tracking-widest text-[#2D2A26]">{variant.label}</span>
                          {variant.required && <span className="text-[10px] text-[#8B8B8B] uppercase">* Required</span>}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {variant.options.map((option) => {
                            const isSelected = selectedVariants[variant.type] === option.id;
                            const isAvailable = option.inStock ?? true;

                            return (
                              <button
                                key={option.id}
                                onClick={() => isAvailable && handleVariantChange(variant.type, option.id)}
                                disabled={!isAvailable}
                                className={`
                                            min-w-[3.5rem] px-3 py-2 border text-xs font-medium transition-all duration-200
                                            ${isSelected
                                    ? 'border-[#2D2A26] bg-[#2D2A26] text-white'
                                    : isAvailable
                                      ? 'border-[#E5E0D8] bg-white text-[#6B5D52] hover:border-[#2D2A26]'
                                      : 'border-dashed border-[#E5E0D8] text-[#C5B4A5] cursor-not-allowed'
                                  }
                                         `}
                              >
                                {option.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock || !canAddToCart || isAdding}
                    className="w-full py-4 bg-black text-white font-bold uppercase tracking-[0.15em] text-xs hover:bg-[#2D2A26]/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isAdding ? 'Adding...' : !product.inStock ? 'Out of Stock' : 'Add to Bag'}
                    {product.inStock && !isAdding && <ArrowRight size={16} />}
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`py-3 border uppercase tracking-widest text-[10px] font-bold flex items-center justify-center gap-2 transition-all duration-300 ${isInWishlist ? 'border-[#2D2A26] bg-[#2D2A26] text-white' : 'border-[#E5E0D8] text-[#2D2A26] hover:border-[#2D2A26]'}`}
                    >
                      <Heart size={14} className={isInWishlist ? "fill-white" : ""} />
                      Wishlist
                    </button>
                    <button
                      onClick={handleShare}
                      className="py-3 border border-[#E5E0D8] text-[#2D2A26] uppercase tracking-widest text-[10px] font-bold flex items-center justify-center gap-2 hover:border-[#2D2A26] transition-all duration-300"
                    >
                      <Share2 size={14} />
                      Share
                    </button>
                  </div>
                </div>

                {/* Accordions */}
                <div className="pt-2">
                  <AccordionItem
                    title="Description"
                    isOpen={openAccordion === "Description"}
                    onClick={() => toggleAccordion("Description")}
                  >
                    <div className="prose prose-sm max-w-none text-[#6B5D52]">
                      {product.description || "No description available."}
                    </div>
                  </AccordionItem>

                  <AccordionItem
                    title="Specification"
                    isOpen={openAccordion === "Specification"}
                    onClick={() => toggleAccordion("Specification")}
                  >
                    <div className="prose prose-sm max-w-none text-[#6B5D52]">
                      {product.specification ? (
                        <p>{product.specification}</p>
                      ) : (
                        <ul className="list-disc pl-4 space-y-1">
                          <li>Material: Sterling Silver / Gold Vermeil</li>
                          <li>Gemstone: Cubic Zirconia (if applicable)</li>
                          <li>Weight: Approx 5g</li>
                          <li>Warranty: 1 Year</li>
                        </ul>
                      )}
                    </div>
                  </AccordionItem>

                  <AccordionItem
                    title="Supplier Information"
                    isOpen={openAccordion === "Supplier"}
                    onClick={() => toggleAccordion("Supplier")}
                  >
                    <p className="text-[#6B5D52]">
                      {product.supplierInfo || "Sourced from certified ethical artisanal workshops in Jaipur, India."}
                    </p>
                  </AccordionItem>

                  <AccordionItem
                    title="Size Guide"
                    isOpen={openAccordion === "Size"}
                    onClick={() => toggleAccordion("Size")}
                  >
                    <div className="text-[#6B5D52]">
                      <p className="mb-2">Find your perfect fit:</p>
                      <ul className="list-disc pl-4 space-y-1">
                        {product.ringSizes && <li>Rings: US Sizes {product.ringSizes.join(", ")}</li>}
                        {product.braceletSizes && <li>Bracelets: {product.braceletSizes.join(", ")}</li>}
                        {!product.ringSizes && !product.braceletSizes && <li>Standard sizing applies. Please refer to our general size chart.</li>}
                      </ul>
                    </div>
                  </AccordionItem>

                  <AccordionItem
                    title="Returns"
                    isOpen={openAccordion === "Returns"}
                    onClick={() => toggleAccordion("Returns")}
                  >
                    <p className="text-[#6B5D52]">
                      We offer a 15-day return policy for all unused and unworn items. Original packaging must be intact. Custom orders are non-refundable.
                    </p>
                  </AccordionItem>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 pt-8 border-t border-[#E5E0D8]">
                  <div className="flex flex-col items-center text-center gap-2">
                    <Truck size={20} className="text-[#2D2A26]" />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#2D2A26]">Fast Shipping</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <ShieldCheck size={20} className="text-[#2D2A26]" />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#2D2A26]">Lifetime Warranty</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <RefreshCcw size={20} className="text-[#2D2A26]" />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#2D2A26]">Easy Returns</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}