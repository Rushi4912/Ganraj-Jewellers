"use client";
import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronDown, Check, Star } from 'lucide-react';
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
    let filtered = products.filter((product) => {
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
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0 space-y-8">
             {/* Search Bar (Sidebar) */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Search</h3>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search jewellery..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-amber-50 text-amber-700 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {cat.name}
                    {selectedCategory === cat.id && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
             <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Price Range</h3>
              <div className="space-y-2">
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
                    className={`w-full flex items-center gap-3 text-left px-1 py-1 rounded text-sm transition-colors ${
                        priceRange === range.value ? 'text-amber-700 font-medium' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                     <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                         priceRange === range.value ? 'border-amber-500' : 'border-gray-300'
                     }`}>
                         {priceRange === range.value && <div className="w-2 h-2 rounded-full bg-amber-500"></div>}
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
                    We couldn't find any matches for "{searchQuery}"
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
