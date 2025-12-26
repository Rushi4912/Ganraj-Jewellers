"use client";
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Product } from '../types/product';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ShoppingCartSidebar from '../components/cart/ShoppingCart';
import { X, Star, ShoppingCart, Check, Minus, AlertTriangle } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabase';
import { transformSupabaseProductList } from '../utils/transformSupabaseProduct';
import Link from 'next/link';
import Image from 'next/image';

export default function ComparePage() {
  const { compareList, toggleCompare, addToCart } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const toast = useToast();

  const compareProducts = allProducts.filter((product) =>
    compareList.includes(product.id)
  );

  useEffect(() => {
    let isMounted = true;

    const fetchCompareProducts = async () => {
      if (compareList.length === 0) {
        if (isMounted) {
          setAllProducts([]);
          setLoadingProducts(false);
          setFetchError(null);
        }
        return;
      }

      setLoadingProducts(true);
      setFetchError(null);

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (!isMounted) return;

        const transformed = transformSupabaseProductList(data);
        setAllProducts(transformed);
      } catch (error) {
        console.error('Error fetching compare products:', error);
        if (isMounted) {
          setFetchError('Unable to load comparison data right now. Please try again in a moment.');
        }
      } finally {
        if (isMounted) {
          setLoadingProducts(false);
        }
      }
    };

    fetchCompareProducts();

    return () => {
      isMounted = false;
    };
  }, [compareList, reloadKey]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const features = [
    { key: 'price', label: 'Price' },
    { key: 'rating', label: 'Rating' },
    { key: 'reviews', label: 'Reviews' },
    { key: 'category', label: 'Category' },
    { key: 'badge', label: 'Status' },
    { key: 'inStock', label: 'Availability' },
  ];

  return (
    <>
      <Navbar onCartOpen={() => setShowCart(true)} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/40 py-16">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Compare Products
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {compareList.length} of 3 products selected
          </p>
        </div>
      </section>

      {/* Comparison Content */}
      <section className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loadingProducts ? (
            <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-6"></div>
              <p className="text-gray-600 text-lg">Loading comparison items...</p>
            </div>
          ) : fetchError ? (
            <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
              <AlertTriangle size={48} className="mx-auto text-amber-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
              <p className="text-gray-600 mb-6">{fetchError}</p>
              <button
                onClick={() => {
                  setFetchError(null);
                  setReloadKey((prev) => prev + 1);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
              >
                Try Again
              </button>
            </div>
          ) : compareProducts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
              <div className="text-gray-300 mb-6">
                <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                No products to compare
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Add up to 3 products to compare their features
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-amber-50 to-orange-50">
                      <th className="p-6 text-left font-bold text-gray-900 w-48">
                        Feature
                      </th>
                      {compareProducts.map((product) => (
                        <th key={product.id} className="p-6 relative">
                          {/* Remove Button */}
                          <button
                            onClick={() => toggleCompare(product.id)}
                            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors z-10"
                            title="Remove from comparison"
                          >
                            <X size={18} className="text-red-500" />
                          </button>

                          {/* Product Image */}
                          <div className="relative aspect-square w-full max-w-[200px] mx-auto mb-4 rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="200px"
                              unoptimized
                            />
                          </div>

                          {/* Product Name */}
                          <h3 className="font-bold text-gray-900 text-lg mb-2">
                            {product.name}
                          </h3>

                          {/* Add to Cart Button */}
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={!product.inStock}
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ShoppingCart size={16} />
                            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                          </button>
                        </th>
                      ))}
                      {/* Empty slots */}
                      {[...Array(3 - compareProducts.length)].map((_, i) => (
                        <th key={`empty-${i}`} className="p-6">
                          <div className="aspect-square w-full max-w-[200px] mx-auto mb-4 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <div className="text-center text-gray-400">
                              <p className="text-sm">Add product</p>
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((feature, index) => (
                      <tr
                        key={feature.key}
                        className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      >
                        <td className="p-6 font-semibold text-gray-700 border-r border-gray-200">
                          {feature.label}
                        </td>
                        {compareProducts.map((product) => (
                          <td key={product.id} className="p-6 text-center">
                            {feature.key === 'price' && (
                              <div>
                                <span className="text-2xl font-bold text-gray-900">
                                  ₹ {product.price.toFixed(2)}
                                </span>
                                {product.originalPrice && (
                                  <div className="text-sm text-gray-400 line-through mt-1">
                                    ₹ {product.originalPrice.toFixed(2)}
                                  </div>
                                )}
                              </div>
                            )}
                            {feature.key === 'rating' && (
                              <div className="flex items-center justify-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={16}
                                    className={
                                      i < Math.floor(product.rating)
                                        ? 'text-amber-400 fill-amber-400'
                                        : 'text-gray-300'
                                    }
                                  />
                                ))}
                                <span className="ml-2 font-semibold text-gray-900">
                                  {product.rating}
                                </span>
                              </div>
                            )}
                            {feature.key === 'reviews' && (
                              <span className="text-gray-700">{product.reviews} reviews</span>
                            )}
                            {feature.key === 'category' && (
                              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold capitalize">
                                {product.category}
                              </span>
                            )}
                            {feature.key === 'badge' && (
                              <>
                                {product.badge ? (
                                  <span
                                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold text-white ${
                                      product.badge === 'SALE' ? 'bg-red-500' : 'bg-green-500'
                                    }`}
                                  >
                                    {product.badge}
                                  </span>
                                ) : (
                                  <Minus size={20} className="mx-auto text-gray-300" />
                                )}
                              </>
                            )}
                            {feature.key === 'inStock' && (
                              <>
                                {product.inStock ? (
                                  <div className="flex items-center justify-center gap-2 text-green-600">
                                    <Check size={20} />
                                    <span className="font-semibold">In Stock</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center gap-2 text-red-600">
                                    <X size={20} />
                                    <span className="font-semibold">Out of Stock</span>
                                  </div>
                                )}
                              </>
                            )}
                          </td>
                        ))}
                        {/* Empty cells for remaining slots */}
                        {[...Array(3 - compareProducts.length)].map((_, i) => (
                          <td key={`empty-${i}`} className="p-6"></td>
                        ))}
                      </tr>
                    ))}

                    {/* Description Row */}
                    <tr className="bg-white">
                      <td className="p-6 font-semibold text-gray-700 border-r border-gray-200">
                        Description
                      </td>
                      {compareProducts.map((product) => (
                        <td key={product.id} className="p-6">
                          <p className="text-sm text-gray-600 text-left">
                            {product.description}
                          </p>
                        </td>
                      ))}
                      {[...Array(3 - compareProducts.length)].map((_, i) => (
                        <td key={`empty-${i}`} className="p-6"></td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              <div className="p-6 bg-gray-50 border-t flex justify-between items-center">
                <Link
                  href="/shop"
                  className="text-gray-700 font-semibold hover:text-amber-600 transition-colors"
                >
                  ← Back to Shop
                </Link>
                <button
                  onClick={() => {
                    compareList.forEach(id => toggleCompare(id));
                    toast.info('Comparison cleared');
                  }}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-white transition-all font-semibold"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <ShoppingCartSidebar isOpen={showCart} onClose={() => setShowCart(false)} />
      <Footer />
    </>
  );
}