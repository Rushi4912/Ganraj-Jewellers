"use client";

import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import { useCart } from "../../context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShoppingCartSidebar({ isOpen, onClose }: ShoppingCartProps) {
  const { cart, removeFromCart, updateCartQuantity, cartSubtotal, cartTotal } = useCart();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isOpen) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-[#F2F0EB] z-50 shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#C5B4A5]/30 bg-[#F2F0EB]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E5E0D8] flex items-center justify-center text-[#8B7355]">
              <ShoppingBag size={20} />
            </div>
            <div>
              <h2 className="font-display text-xl text-[#2D2A26]">Your Bag</h2>
              <p className="text-xs text-[#6B5D52] uppercase tracking-wider">{cart.length} {cart.length === 1 ? 'Item' : 'Items'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-[#C5B4A5]/30 flex items-center justify-center text-[#6B5D52] hover:bg-[#2D2A26] hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-[#E5E0D8]/50 flex items-center justify-center mb-6 text-[#C5B4A5]">
                <ShoppingBag size={32} />
              </div>
              <p className="text-[#2D2A26] font-display text-2xl mb-2">Your Bag is Empty</p>
              <p className="text-[#6B5D52] max-w-xs mb-8">
                Discover our collection of handcrafted silver treasures.
              </p>
              <button
                onClick={onClose}
                className="px-8 py-3 bg-[#2D2A26] text-white rounded-full text-sm font-bold uppercase tracking-wider hover:bg-[#8B7355] transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                {/* Image */}
                <div className="relative w-24 h-32 flex-shrink-0 bg-[#E5E0D8] rounded-xl overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-display text-lg text-[#2D2A26] leading-tight mb-1">{item.name}</h3>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#C5B4A5] hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-[#6B5D52] text-xs uppercase tracking-wide mb-2">{item.category}</p>
                    <p className="text-[#2D2A26] font-medium">₹{item.price.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-[#C5B4A5] rounded-full px-2 py-1">
                      <button
                        onClick={() => updateCartQuantity(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center text-[#6B5D52] hover:text-[#2D2A26]"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-[#2D2A26]">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center text-[#6B5D52] hover:text-[#2D2A26]"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-[#C5B4A5]/30 bg-white p-6 space-y-4">
            <div className="space-y-2 text-sm text-[#6B5D52]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#2D2A26] font-medium">₹{cartSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-lg font-display text-[#2D2A26] pt-4 border-t border-[#C5B4A5]/10">
              <span>Total</span>
              <span>₹{cartTotal.toLocaleString()}</span>
            </div>

            <Link
              href="/checkout"
              onClick={onClose}
              className="w-full bg-[#2D2A26] text-white py-4 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#8B7355] transition-all duration-300 group"
            >
              Checkout <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}

      </div>
    </>
  );
}
