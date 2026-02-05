"use client";
import { Search, ShoppingCart, User, Heart, Menu, X, GitCompare, LogOut, Settings } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NavbarProps {
  onCartOpen?: () => void;
}

export default function Navbar({ onCartOpen }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const { cartCount, wishlist, compareList } = useCart();
  const { user, profile, signOut, loading } = useAuth();
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/collections", label: "Collections" },
    { href: "/shop", label: "Shop" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Stories" },
    { href: "/contact", label: "Contact" },
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

  useEffect(() => {
    if (mobileSearchOpen && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
  }, [mobileSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchFocused(false);
      setMobileSearchOpen(false);
      if (searchInputRef.current) searchInputRef.current.blur();
    }
  };

  return (
    <nav
      className="sticky top-0 z-50"
      style={{ backgroundColor: '#F2F0EB' }}
    >
      {/* Subtle bottom border with gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5B4A5] to-transparent opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left section (Logo + Menu toggle) */}
          <div className="flex items-center flex-shrink-0">
            <button
              className="lg:hidden mr-4 text-[#5A4D41] hover:text-[#8B7355] transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link href="/" className="flex flex-col group">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-serif tracking-wider uppercase text-[#2D2A26] group-hover:text-[#8B7355] transition-colors duration-300">
                  Ganraj
                </span>
                <div className="w-1.5 h-1.5 bg-[#B8923A] rounded-full mt-1 group-hover:scale-125 transition-transform duration-300"></div>
                <span className="text-[10px] font-bold text-[#8B7355] bg-[#E5E0D8] px-2 py-0.5 rounded-full border border-[#C5B4A5] uppercase tracking-wider ml-2 self-start transform -translate-y-1">
                  Beta
                </span>
              </div>
              <span className="text-[10px] tracking-[0.3em] text-[#6B5D52] uppercase ml-0.5">
                Jewellers
              </span>
            </Link>
          </div>

          {/* Center section (Search Bar) - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearchSubmit} className={`relative w-full transition-all duration-300 ${isSearchFocused ? 'scale-[1.02]' : ''}`}>
              <div className={`relative flex items-center w-full rounded-full border transition-all duration-300 ${isSearchFocused
                  ? 'border-[#8B7355] shadow-lg bg-white ring-4 ring-[#E5E0D8]'
                  : 'border-[#C5B4A5] bg-[#E5E0D8]/50 hover:border-[#8B7355]/50 hover:bg-[#E5E0D8]'
                }`}>
                <Search className={`absolute left-4 w-5 h-5 transition-colors duration-300 ${isSearchFocused ? 'text-[#8B7355]' : 'text-[#6B5D52]'}`} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for rings, necklaces..."
                  className="w-full py-2.5 pl-12 pr-10 bg-transparent border-none focus:ring-0 text-sm text-[#2D2A26] placeholder-[#8B7355]/60 outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-12 text-[#6B5D52] hover:text-[#8B7355] p-1 transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
                <button
                  type="submit"
                  className={`absolute right-1.5 p-1.5 rounded-full transition-all duration-300 ${isSearchFocused
                      ? 'bg-[#8B7355] text-white hover:bg-[#6B5D52]'
                      : 'bg-[#2D2A26] text-white hover:bg-[#8B7355]'
                    }`}
                >
                  <Search size={14} />
                </button>
              </div>
            </form>
          </div>

          {/* Right section (Icons) */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobile Search Icon */}
            <button
              className="lg:hidden p-2 text-[#5A4D41] hover:text-[#8B7355] hover:bg-[#E5E0D8] rounded-full transition-all"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            >
              <Search size={20} />
            </button>

            <Link
              href="/wishlist"
              className="p-2 text-[#5A4D41] hover:text-[#8B7355] hover:bg-[#E5E0D8] rounded-full transition-all relative group"
              title="Wishlist"
            >
              <Heart
                className={`transition-transform group-hover:scale-110 ${wishlist.length > 0 ? "fill-[#8B7355] text-[#8B7355]" : ""}`}
                size={20}
              />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 bg-[#8B7355] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-[#F2F0EB]">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              href="/compare"
              className="hidden sm:flex p-2 text-[#5A4D41] hover:text-[#8B7355] hover:bg-[#E5E0D8] rounded-full transition-all relative group"
              title="Compare"
            >
              <GitCompare size={20} className="transition-transform group-hover:scale-110" />
              {compareList.length > 0 && (
                <span className="absolute top-0 right-0 bg-[#B8923A] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-[#F2F0EB]">
                  {compareList.length}
                </span>
              )}
            </Link>

            <div className="relative" ref={userMenuRef}>
              {user ? (
                <>
                  <button
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    className="flex items-center gap-2 p-1 pl-2 rounded-full border border-[#C5B4A5] hover:border-[#8B7355] hover:bg-[#E5E0D8] transition-all ml-2"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-[#C5B4A5] to-[#8B7355] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-inner">
                      {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden lg:block text-xs font-semibold text-[#5A4D41] pr-2 max-w-[100px] truncate">
                      {profile?.fullName ? profile.fullName.split(" ")[0] : "Account"}
                    </span>
                  </button>

                  {userMenuOpen && (
                    <div
                      className="absolute right-0 mt-3 w-60 shadow-2xl rounded-2xl border border-[#C5B4A5] py-2 z-50 animate-fade-in origin-top-right"
                      style={{ backgroundColor: '#F2F0EB' }}
                    >
                      <div className="px-4 py-3 border-b border-[#E5E0D8] mb-2">
                        <p className="text-sm font-bold text-[#2D2A26] truncate">{profile?.fullName || 'User'}</p>
                        <p className="text-xs text-[#6B5D52] truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/account"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#5A4D41] hover:bg-[#E5E0D8] hover:text-[#8B7355] transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings size={16} />
                        Account Settings
                      </Link>
                      <Link
                        href="/orders"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#5A4D41] hover:bg-[#E5E0D8] hover:text-[#8B7355] transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <ShoppingBag size={16} />
                        My Orders
                      </Link>
                      <div className="h-px bg-[#E5E0D8] my-2"></div>
                      <button
                        onClick={() => {
                          signOut();
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#8B7355] hover:bg-[#E5E0D8] hover:text-[#6B5D52] transition-colors"
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
                  className="ml-2 px-5 py-2 rounded-full bg-[#2D2A26] text-white text-sm font-medium hover:bg-[#8B7355] transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <User size={16} />
                  <span className="hidden lg:inline">
                    {loading ? "..." : "Sign In"}
                  </span>
                </Link>
              )}
            </div>

            <button
              onClick={onCartOpen}
              className="p-2 text-[#5A4D41] hover:text-[#8B7355] hover:bg-[#E5E0D8] rounded-full transition-all relative group ml-1"
            >
              <ShoppingCart size={20} className="transition-transform group-hover:scale-110" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#B8923A] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-[#F2F0EB] shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Expandable */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileSearchOpen ? 'max-h-20 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B5D52]" size={18} />
            <input
              ref={mobileSearchInputRef}
              type="text"
              placeholder="Search for products..."
              className="w-full pl-11 pr-4 py-3 bg-[#E5E0D8] border border-[#C5B4A5] rounded-full text-sm text-[#2D2A26] placeholder-[#8B7355]/60 focus:ring-2 focus:ring-[#8B7355] focus:border-transparent outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B5D52] p-1"
              >
                <X size={16} />
              </button>
            )}
          </form>
        </div>

        {/* Secondary Navigation (Categories) - Desktop */}
        <div className="hidden lg:flex justify-center border-t border-[#C5B4A5]/30">
          <div className="flex space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative py-4 text-sm font-medium text-[#5A4D41] hover:text-[#8B7355] transition-colors duration-300 group tracking-wide"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#8B7355] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden border-t border-[#C5B4A5]/30 absolute w-full shadow-xl z-40 animate-slide-down"
          style={{ backgroundColor: '#F2F0EB' }}
        >
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-3 text-[#5A4D41] font-medium hover:bg-[#E5E0D8] hover:text-[#8B7355] rounded-xl transition-all duration-300"
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

// Helper Icon for Orders
function ShoppingBag({ size, className }: { size: number, className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
