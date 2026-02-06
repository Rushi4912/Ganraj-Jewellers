"use client";
import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronDown, Check } from 'lucide-react';
import { Product } from '../../types/product';
import { categories } from '../../data/products';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onQuickView: (product: Product) => void;
}

export default function ProductGrid({ products, onQuickView }: ProductGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and Sort Products
  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;

      let matchesPrice = true;
      if (priceRange === 'under50') matchesPrice = product.price < 500;
      else if (priceRange === '50to100')
        matchesPrice = product.price >= 500 && product.price <= 1000;
      else if (priceRange === '100to200')
        matchesPrice = product.price >= 1000 && product.price <= 2000;
      else if (priceRange === 'over200') matchesPrice = product.price > 2000;

      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sorting
    if (sortBy === 'priceLow') filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === 'priceHigh') filtered.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'newest')
      filtered.sort((a, b) => (b.badge === 'NEW' ? 1 : 0) - (a.badge === 'NEW' ? 1 : 0));

    return filtered;
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  return (
    <section className="py-12 min-h-screen" style={{ backgroundColor: '#F2F0EB' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0 space-y-8 sticky top-24 self-start h-fit">
            {/* Search Bar (Sidebar) */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Search</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search jewellery..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-transparent focus:border-amber-200 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-500/20 outline-none transition-all placeholder-gray-400"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${selectedCategory === cat.id
                      ? 'bg-[#E5E0D8] text-[#8B7355] font-semibold translate-x-1 shadow-sm'
                      : 'text-gray-600 hover:bg-[#E5E0D8]/50 hover:text-gray-900 hover:translate-x-1'
                      }`}
                  >
                    {cat.name}
                    {selectedCategory === cat.id && <Check size={14} className="text-[#8B7355]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Price Range</h3>
              <div className="space-y-3">
                {[
                  { label: 'All Prices', value: 'all' },
                  { label: 'Under ₹500', value: 'under50' },
                  { label: '₹500 - ₹1000', value: '50to100' },
                  { label: '₹1000 - ₹2000', value: '100to200' },
                  { label: '₹2000+', value: 'over200' }
                ].map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setPriceRange(range.value)}
                    className={`w-full flex items-center gap-3 text-left px-1 py-0.5 rounded text-sm transition-colors group ${priceRange === range.value ? 'text-[#8B7355] font-medium' : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${priceRange === range.value ? 'border-[#8B7355]' : 'border-gray-300 group-hover:border-gray-400'
                      }`}>
                      {priceRange === range.value && <div className="w-2 h-2 rounded-full bg-[#8B7355]"></div>}
                    </div>
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Mobile Filter Toggle & Main Content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">All Products</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> results
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 flex-1 sm:flex-none"
                >
                  <Filter size={18} />
                  Filters
                </button>

                <div className="relative flex-1 sm:flex-none">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full sm:w-48 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none cursor-pointer"
                  >
                    <option value="featured">Sort by: Featured</option>
                    <option value="newest">Newest First</option>
                    <option value="priceLow">Price: Low to High</option>
                    <option value="priceHigh">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Mobile Filters Panel (Collapsible) */}
            {showFilters && (
              <div className="lg:hidden bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100 space-y-6 animate-fade-in">
                {/* Search Mobile */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                </div>

                {/* Categories Mobile */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Price Mobile */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Price</label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="all">All Prices</option>
                    <option value="under50">Under ₹500</option>
                    <option value="50to100">₹500 - ₹1000</option>
                    <option value="100to200">₹1000 - ₹2000</option>
                    <option value="over200">₹2000+</option>
                  </select>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={onQuickView}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-xl border border-dashed border-gray-200">
                <div className="text-gray-300 mb-4">
                  <Search size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  No products found
                </h3>
                <p className="text-gray-500 mb-6 text-sm">
                  We couldn&apos;t find any matches for &quot;{searchQuery}&quot;
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setPriceRange('all');
                    setSortBy('featured');
                  }}
                  className="px-6 py-2.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-all font-medium"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
