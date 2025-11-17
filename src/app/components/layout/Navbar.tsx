"use client";
import { Search, ShoppingCart, User, Heart, Menu, X, GitCompare, LogOut, Settings } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";

interface NavbarProps {
  onCartOpen?: () => void;
}

export default function Navbar({ onCartOpen }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { cartCount, wishlist, compareList } = useCart();
  const { user, profile, signOut, loading } = useAuth();
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
    { href: "/orders", label: "Orders" },
  ];

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      window.addEventListener("click", handler);
    }
    return () => window.removeEventListener("click", handler);
  }, [userMenuOpen]);

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
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative inline-flex items-center px-1 py-1 text-gray-700 font-medium transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <span className="relative z-10">{link.label}</span>
                <span className="absolute inset-x-0 -bottom-1 h-0.5 w-full origin-left scale-x-0 bg-gradient-to-r from-amber-500 to-orange-500 transition-transform duration-300 group-hover:scale-x-100 group-active:scale-x-100" />
              </Link>
            ))}
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

            <div className="relative" ref={userMenuRef}>
              {user ? (
                <>
                  <button
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    className="text-gray-700 hover:text-gray-900 flex items-center gap-2"
                  >
                    <span className="hidden lg:inline-flex text-sm font-semibold">
                      {profile?.fullName
                        ? profile.fullName.split(" ")[0]
                        : user.email?.split("@")[0]}
                    </span>
                    <User size={20} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white shadow-2xl rounded-2xl border border-gray-100 py-2 z-50">
                      <Link
                        href="/account"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings size={16} />
                        Account
                      </Link>
                      <Link
                        href="/orders"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <GitCompare size={16} />
                        Orders
                      </Link>
                      <button
                        onClick={() => {
                          signOut();
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        <LogOut size={16} />
                        Sign out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={loading ? "#" : "/login"}
                  className="text-gray-700 hover:text-gray-900 flex items-center gap-2"
                >
                  <User size={20} />
                  <span className="hidden lg:inline text-sm font-semibold">
                    {loading ? "Loading..." : "Sign in"}
                  </span>
                </Link>
              )}
            </div>

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
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
