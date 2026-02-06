"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '../types/product';
import { supabase } from '../lib/supabase';
import { transformSupabaseProductList } from '../utils/transformSupabaseProduct';
import ProductGrid from '../components/products/ProductGrid';
import QuickView from '../components/products/QuickView';
import ShoppingCartSidebar from '../components/cart/ShoppingCart';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function ShopPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform Supabase data to match Product type
      const transformedProducts = transformSupabaseProductList(data);

      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const handleNavigateToProduct = (product: Product) => {
    const destination = product.slug ?? product.remoteId ?? product.id.toString();
    router.push(`/shop/${destination}`);
  };

  return (
    <>
      <Navbar onCartOpen={() => setShowCart(true)} />

      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 overflow-hidden" style={{ backgroundColor: '#F2F0EB' }}>
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#8B7355] fill-current">
            <path transform="translate(100 100)" d="M42.7,-73.4C55.9,-67.2,67.3,-57.4,75.6,-45.6C83.9,-33.8,89.1,-20,87.6,-6.8C86.1,6.4,78,19,69.1,30.3C60.2,41.6,50.6,51.6,39.4,59.3C28.2,67,15.5,72.4,2,70.9C-11.5,69.4,-25.8,61,-38.3,51.8C-50.8,42.6,-61.5,32.6,-68.9,20.3C-76.3,8,-80.4,-6.6,-77.1,-20.1C-73.8,-33.6,-63.1,-46.1,-50.8,-52.7C-38.5,-59.4,-24.6,-60.2,-11.2,-61.9C2.2,-63.6,15.6,-66.2,29.5,-72.6L42.7,-73.4Z" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <span className="block text-xs uppercase tracking-[0.3em] text-[#8B7355] font-medium mb-4 animate-fadeIn">
            Collections
          </span>

          <h1 className="font-serif text-5xl md:text-7xl text-[#2D2A26] mb-6 animate-fadeInUp">
            The <span className="italic text-[#8B7355]">Shop</span>
          </h1>

          <div className="max-w-2xl mx-auto">
            <p className="text-[#6B5D52] text-lg leading-relaxed font-light animate-fadeInUp-delay-1">
              Explore our curated selection of fine jewellery. Each piece is crafted with precision to bring elegance and sophistication to your collection.
            </p>
          </div>

          {/* Decorative line */}
          <div className="mt-8 flex justify-center animate-fadeInUp-delay-2">
            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#C5B4A5] to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      {loading ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      ) : (
        <ProductGrid
          products={products}
          onQuickView={handleQuickView}
        />
      )}

      {/* Quick View Modal */}
      <QuickView
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onViewFullDetails={handleNavigateToProduct}
      />

      {/* Shopping Cart Sidebar */}
      <ShoppingCartSidebar
        isOpen={showCart}
        onClose={() => setShowCart(false)}
      />

      <Footer />
    </>
  );
}