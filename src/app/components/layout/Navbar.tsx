"use client";
import { Search, ShoppingCart, User, Heart, Menu, X , GitCompare } from "lucide-react";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import Link from "next/link";

interface NavbarProps {
  onCartOpen?: () => void;
}

export default function Navbar({ onCartOpen }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount, wishlist,compareList } = useCart();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left section (Logo + Menu toggle) */}
          <div className="flex items-center">
            <button
              className="md:hidden mr-4"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Jwellery4u
            </Link>
          </div>

          {/* Center section (Navigation Links) */}
          <div className="hidden md:flex space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Shop
            </Link>
            <Link
              href="/collections"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Collections
            </Link>
            <Link
              href="/products"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Products
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Contact
            </Link>
          </div>

          {/* Right section (Icons) */}
          <div className="flex items-center space-x-4">
            <Link href="/shop" className="text-gray-700 hover:text-gray-900">
              <Search size={20} />
            </Link>

            <Link
              href="/wishlist"
              className="text-gray-700 hover:text-gray-900 relative"
            >
              <Heart
                className={
                  wishlist.length > 0 ? "fill-red-500 text-red-500" : ""
                }
                size={20}
              />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Compare Link */}
            <Link
              href="/compare"
              className="text-gray-700 hover:text-gray-900 relative"
            >
              <GitCompare size={20} />
              {compareList.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {compareList.length}
                </span>
              )}
            </Link>

            <button className="text-gray-700 hover:text-gray-900">
              <User size={20} />
            </button>

            <button
              onClick={onCartOpen}
              className="text-gray-700 hover:text-gray-900 relative"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-50"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-50"
            >
              Shop
            </Link>
            <Link
              href="/collections"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-50"
            >
              Collections
            </Link>
            <Link
              href="/products"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-50"
            >
              Products
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-50"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-50"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
