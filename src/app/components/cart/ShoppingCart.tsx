"use client";
import React, { useState } from "react";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  ArrowRight,
  Check,
  Tag,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { discountCodes } from "../../data/products";
import Image from "next/image";

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShoppingCartSidebar({
  isOpen,
  onClose,
}: ShoppingCartProps) {
  const {
    cart,
    cartCount,
    cartSubtotal,
    cartTotal,
    discountAmount,
    appliedDiscount,
    updateCartQuantity,
    removeFromCart,
    applyDiscount,
    removeDiscount,
  } = useCart();

  const [discountCode, setDiscountCode] = useState("");
  const [codeError, setCodeError] = useState("");

  const handleApplyDiscount = () => {
    const code = discountCodes[discountCode.toUpperCase()];
    if (code) {
      applyDiscount(code);
      setCodeError("");
      setDiscountCode("");
      // Toast is already shown in CartContext
    } else {
      setCodeError("Invalid discount code");
      setTimeout(() => setCodeError(""), 3000);
    }
  };
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-full md:max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 md:px-6 border-b bg-gradient-to-r from-amber-50 to-orange-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
            <p className="text-sm text-gray-600 mt-1">
              {cartCount} {cartCount === 1 ? "item" : "items"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-5 py-6 md:px-6">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-600 mb-6">
                Add some beautiful jewellery to get started!
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:shadow-xl transition-all duration-300 font-semibold"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div
                  key={item.variantId || item.id}
                  className="flex flex-col gap-4 pb-6 border-b border-gray-200 last:border-b-0 sm:flex-row"
                >
                  {/* Product Image */}
                  <div className="relative w-full max-w-sm flex-shrink-0 sm:w-24">
                    <div className="relative w-full h-48 sm:h-32 md:h-24">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain rounded-lg border border-gray-100 bg-gray-50"
                        sizes="(max-width: 640px) 100vw, 6rem"
                        unoptimized
                      />
                    </div>
                    {item.badge && (
                      <span
                        className={`absolute -top-2 -left-2 px-2 py-1 rounded-full text-xs font-semibold text-white ${
                          item.badge === "SALE" ? "bg-red-500" : "bg-green-500"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 truncate leading-tight">
                      {item.name}
                    </h3>
                    
                    {/* Display Selected Variants */}
                    {item.selectedVariants &&
                      Object.keys(item.selectedVariants).length > 0 && (
                        <div className="mb-2">
                          {Object.entries(item.selectedVariants).map(
                            ([type, value]) => {
                              const variant = item.variants?.find(
                                (v) => v.type === type
                              );
                              const option = variant?.options.find(
                                (o) => o.id === value
                              );
                              return (
                                <p key={type} className="text-xs text-gray-500">
                                  {variant?.label}:{" "}
                                  <span className="font-semibold">
                                    {option?.name}
                                  </span>
                                </p>
                              );
                            }
                          )}
                        </div>
                      )}

                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="text-lg font-bold text-amber-600">
                        ₹ {item.price.toFixed(2)}
                      </span>
                      {item.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹ {item.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => updateCartQuantity(item.id, -1, item.variantId)}
                          className="p-1.5 hover:bg-white rounded transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, 1, item.variantId)}
                          className="p-1.5 hover:bg-white rounded transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id, item.variantId)}
                        className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm font-medium transition-colors"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="mt-2 text-right">
                      <span className="text-sm text-gray-600">
                        Item total:{" "}
                        <span className="font-semibold text-gray-900">
                          ₹ {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Discount & Checkout */}
        {cart.length > 0 && (
          <div className="border-t bg-gray-50 px-5 py-6 md:px-6">
            {/* Discount Code Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Have a discount code?
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Tag
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={discountCode}
                    onChange={(e) =>
                      setDiscountCode(e.target.value.toUpperCase())
                    }
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleApplyDiscount()
                    }
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleApplyDiscount}
                  disabled={!discountCode.trim()}
                  className="px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Apply
                </button>
              </div>

              {/* Applied Discount */}
              {appliedDiscount && (
                <div className="mt-3 flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-700">
                    <Check size={18} />
                    <span className="text-sm font-semibold">
                      {appliedDiscount.description}
                    </span>
                  </div>
                  <button
                    onClick={removeDiscount}
                    className="text-green-700 hover:text-green-900 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Error Message */}
              {codeError && (
                <p className="mt-2 text-sm text-red-600">{codeError}</p>
              )}

              {/* Available Codes Hint */}
              {!appliedDiscount && (
                <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-xs text-gray-600 mb-1 font-semibold">
                    💡 Try these codes:
                  </p>
                  <p className="text-xs font-mono text-amber-700">
                    WELCOME10, SAVE20, LUXURY30
                  </p>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-semibold">
                  ₹ {cartSubtotal.toFixed(2)}
                </span>
              </div>

              {appliedDiscount && (
                <div className="flex justify-between text-green-600">
                  <span>
                    Discount ({(appliedDiscount.discount * 100).toFixed(0)}%):
                  </span>
                  <span className="font-semibold">
                    -₹ {discountAmount.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Shipping:</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>

              <div className="pt-3 border-t border-gray-300">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">
                    Total:
                  </span>
                  <span className="text-2xl font-bold text-amber-600">
                    ₹ {cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <a
              href="/checkout"
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-lg hover:shadow-xl transition-all duration-300 font-semibold flex items-center justify-center gap-2"
            >
              Proceed to Checkout
              <ArrowRight size={20} />
            </a>

            {/* Continue Shopping Link */}
            <button
              onClick={onClose}
              className="w-full mt-3 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
