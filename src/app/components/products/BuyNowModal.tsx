"use client";
import React, { useState, useEffect } from "react";
import { X, Zap, ShoppingCart, ChevronRight, Check } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product, SelectedVariants } from "../../types/product";
import { useCart } from "../../context/CartContext";
import VariantSelector from "./VariantSelector";

interface BuyNowModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

// Smart size options per jewelry category
const RING_SIZES = ["5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "16", "18", "20"];
const NECKLACE_LENGTHS = [
    { id: "16", name: '16"', desc: "Choker" },
    { id: "18", name: '18"', desc: "Princess" },
    { id: "20", name: '20"', desc: "Matinee" },
    { id: "22", name: '22"', desc: "Opera" },
    { id: "24", name: '24"', desc: "Rope" },
];
const BRACELET_SIZES = [
    { id: "S", name: "S", desc: "6.5 inch" },
    { id: "M", name: "M", desc: "7 inch" },
    { id: "L", name: "L", desc: "7.5 inch" },
    { id: "XL", name: "XL", desc: "8 inch" },
];

export default function BuyNowModal({ product, isOpen, onClose }: BuyNowModalProps) {
    const router = useRouter();
    const { addToCart, clearCart } = useCart();
    const [selectedVariants, setSelectedVariants] = useState<SelectedVariants>({});
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (product && isOpen) {
            setSelectedVariants({});
            setSelectedSize("");
            setIsProcessing(false);
        }
    }, [product, isOpen]);

    // Prevent body scroll when modal open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    if (!isOpen || !product) return null;

    const category = product.category;
    const hasCustomVariants = product.variants && product.variants.length > 0;
    const needsSize = category === "rings" || category === "necklaces" || category === "bracelets";

    // Check if selection is complete
    const isSelectionComplete = () => {
        if (hasCustomVariants) {
            // If product has custom variants, check all required ones
            return product.variants!
                .filter((v) => v.required)
                .every((v) => selectedVariants[v.type]);
        }
        if (needsSize) return selectedSize !== "";
        return true; // earrings — no size needed
    };

    const handleVariantChange = (type: string, value: string) => {
        setSelectedVariants((prev) => ({ ...prev, [type]: value }));
    };

    const handleBuyNow = async () => {
        if (!isSelectionComplete()) return;
        setIsProcessing(true);

        const finalVariants: SelectedVariants = { ...selectedVariants };

        // Merge simple size selection into variants
        if (!hasCustomVariants && needsSize) {
            if (category === "rings") finalVariants["size"] = selectedSize;
            else if (category === "necklaces") finalVariants["length"] = selectedSize;
            else if (category === "bracelets") finalVariants["size"] = selectedSize;
        }

        // Clear existing cart and add this item only
        clearCart();
        // Small delay to let clearCart settle
        await new Promise((r) => setTimeout(r, 50));
        addToCart(product, Object.keys(finalVariants).length > 0 ? finalVariants : undefined);
        onClose();
        router.push("/checkout");
    };

    const handleAddToBagInstead = () => {
        const finalVariants: SelectedVariants = { ...selectedVariants };
        if (!hasCustomVariants && needsSize && selectedSize) {
            if (category === "rings") finalVariants["size"] = selectedSize;
            else if (category === "necklaces") finalVariants["length"] = selectedSize;
            else if (category === "bracelets") finalVariants["size"] = selectedSize;
        }
        addToCart(product, Object.keys(finalVariants).length > 0 ? finalVariants : undefined);
        onClose();
    };

    const getSizeLabel = () => {
        if (category === "rings") return "Select Ring Size";
        if (category === "necklaces") return "Select Chain Length";
        if (category === "bracelets") return "Select Bracelet Size";
        return "";
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
                onClick={onClose}
            >
                {/* Modal */}
                <div
                    className="relative bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden"
                    style={{ maxHeight: "90vh", overflowY: "auto" }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Top drag handle (mobile) */}
                    <div className="flex justify-center pt-3 pb-1 sm:hidden">
                        <div className="w-10 h-1 bg-gray-200 rounded-full" />
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 pt-4 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
                                <Zap size={16} className="text-amber-600 fill-amber-400" />
                            </div>
                            <div>
                                <h2 className="font-bold text-gray-900 text-base leading-tight">Buy Now</h2>
                                <p className="text-[11px] text-gray-400">Quick checkout</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                        >
                            <X size={18} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Product Summary */}
                    <div className="flex items-center gap-4 px-6 py-4 bg-[#FAFAF8]">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm line-clamp-2 leading-snug">
                                {product.name}
                            </p>
                            <p className="text-xs text-gray-500 capitalize mt-0.5">{product.category}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="font-bold text-[#8B7355]">
                                    ₹{product.price.toLocaleString("en-IN")}
                                </span>
                                {product.originalPrice && (
                                    <span className="text-xs text-gray-400 line-through">
                                        ₹{product.originalPrice.toLocaleString("en-IN")}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Size / Variant Selection */}
                    <div className="px-6 py-5">
                        {/* Custom variants from product data */}
                        {hasCustomVariants ? (
                            <div className="mb-2">
                                <h3 className="font-bold text-gray-900 text-sm mb-4">Customize Your Order</h3>
                                <VariantSelector
                                    variants={product.variants!}
                                    selectedVariants={selectedVariants}
                                    onChange={handleVariantChange}
                                />
                            </div>
                        ) : needsSize ? (
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-gray-900 text-sm">{getSizeLabel()}</h3>
                                    {selectedSize && (
                                        <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
                                            <Check size={12} /> Selected: {selectedSize}
                                            {category === "necklaces" && '"'}
                                        </span>
                                    )}
                                </div>

                                {/* Ring Sizes */}
                                {category === "rings" && (
                                    <div className="grid grid-cols-5 gap-2">
                                        {RING_SIZES.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-150 ${selectedSize === size
                                                        ? "border-[#8B7355] bg-[#8B7355] text-white shadow-md scale-105"
                                                        : "border-gray-200 text-gray-700 hover:border-[#8B7355]/50 hover:bg-amber-50"
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Necklace Lengths */}
                                {category === "necklaces" && (
                                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                        {NECKLACE_LENGTHS.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => setSelectedSize(item.id)}
                                                className={`flex flex-col items-center py-3 px-2 rounded-xl border-2 transition-all duration-150 ${selectedSize === item.id
                                                        ? "border-[#8B7355] bg-[#8B7355] text-white shadow-md scale-105"
                                                        : "border-gray-200 text-gray-700 hover:border-[#8B7355]/50 hover:bg-amber-50"
                                                    }`}
                                            >
                                                <span className="font-bold text-sm">{item.name}</span>
                                                <span className={`text-[10px] mt-0.5 ${selectedSize === item.id ? "text-amber-100" : "text-gray-400"}`}>
                                                    {item.desc}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Bracelet Sizes */}
                                {category === "bracelets" && (
                                    <div className="grid grid-cols-4 gap-2">
                                        {BRACELET_SIZES.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => setSelectedSize(item.id)}
                                                className={`flex flex-col items-center py-3 rounded-xl border-2 transition-all duration-150 ${selectedSize === item.id
                                                        ? "border-[#8B7355] bg-[#8B7355] text-white shadow-md scale-105"
                                                        : "border-gray-200 text-gray-700 hover:border-[#8B7355]/50 hover:bg-amber-50"
                                                    }`}
                                            >
                                                <span className="font-bold text-base">{item.name}</span>
                                                <span className={`text-[10px] mt-0.5 ${selectedSize === item.id ? "text-amber-100" : "text-gray-400"}`}>
                                                    {item.desc}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Size Guide hint */}
                                <p className="text-[11px] text-gray-400 mt-2">
                                    {category === "rings"
                                        ? "Indian ring sizes. Need help? Check our size guide."
                                        : category === "necklaces"
                                            ? "Standard chain lengths in inches."
                                            : "Measured around the wrist."}
                                </p>
                            </div>
                        ) : (
                            // Earrings – no size needed
                            <div className="flex items-center gap-3 py-3 px-4 bg-green-50 border border-green-200 rounded-xl">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                    <Check size={16} className="text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-green-800">One Size — Ready to Go!</p>
                                    <p className="text-xs text-green-600">Earrings are a universal fit — no size selection needed.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="px-6 pb-6 pt-2 space-y-3">
                        <button
                            onClick={handleBuyNow}
                            disabled={!isSelectionComplete() || isProcessing || !product.inStock}
                            className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all duration-200 ${isSelectionComplete() && product.inStock && !isProcessing
                                    ? "bg-[#2D2A26] text-white hover:bg-[#8B7355] shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]"
                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                        >
                            {isProcessing ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    Processing...
                                </span>
                            ) : !product.inStock ? (
                                "Out of Stock"
                            ) : !isSelectionComplete() ? (
                                <>
                                    <Zap size={18} />
                                    {needsSize || hasCustomVariants ? "Select a Size First" : "Proceed to Checkout"}
                                </>
                            ) : (
                                <>
                                    <Zap size={18} className="fill-amber-300" />
                                    Proceed to Checkout
                                    <ChevronRight size={16} />
                                </>
                            )}
                        </button>

                        {product.inStock && (
                            <button
                                onClick={handleAddToBagInstead}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm border-2 border-gray-200 text-gray-600 hover:border-[#8B7355]/40 hover:text-[#8B7355] hover:bg-amber-50 transition-all duration-200"
                            >
                                <ShoppingCart size={16} />
                                Add to Bag Instead
                            </button>
                        )}

                        <p className="text-center text-[11px] text-gray-400 flex items-center justify-center gap-1">
                            🔒 Secure checkout · Free returns within 30 days
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
