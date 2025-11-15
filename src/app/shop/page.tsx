"use client";
import React, { useState, useEffect } from 'react';
import { Product } from '../types/product';
import { supabase } from '../lib/supabase';
import ProductGrid from '../components/products/ProductGrid';
import QuickView from '../components/products/QuickView';
import ProductDetail from '../components/products/ProductDetails';
import ShoppingCartSidebar from '../components/cart/ShoppingCart';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
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
      const transformedProducts: Product[] = (data || []).map((item, index) => ({
        id: index + 1, // Use index as numeric ID for compatibility
        name: item.name,
        category: 'rings' as const, // Default category, you can enhance this later
        price: item.discount_price ? Number(item.discount_price) : Number(item.price),
        originalPrice: item.discount_price ? Number(item.price) : undefined,
        rating: 4.5, // Default rating
        reviews: Math.floor(Math.random() * 100) + 10, // Random review count
        image: item.images[0] || '',
        images: item.images || [],
        badge: item.discount_price ? 'SALE' : (item.is_featured ? 'NEW' : null),
        description: item.description || 'Beautiful handcrafted jewelry piece.',
        inStock: item.stock > 0,
        userReviews: [],
        variants: undefined
      }));

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

  const handleViewDetails = (product: Product) => {
    setDetailProduct(product);
    setQuickViewProduct(null);
  };

  return (
    <>
      <Navbar onCartOpen={() => setShowCart(true)} />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/40 py-16">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI0ZCQzAyRCIgc3Ryb2tlLXdpZHRoPSIuNSIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-40"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-amber-200 mb-6">
            <span className="text-sm font-semibold text-amber-700 tracking-wide uppercase">
              Premium Collection
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Discover Our
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">
              Jewelry Collection
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our exquisite selection of handcrafted jewelry pieces designed to make every moment special
          </p>
        </div>
      </section>

      {/* Product Grid */}
      {loading ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      ) : (
        <ProductGrid
          products={products}
          onQuickView={handleQuickView}
          onViewDetails={handleViewDetails}
        />
      )}

      {/* Quick View Modal */}
      <QuickView
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onViewFullDetails={handleViewDetails}
      />

      {/* Product Detail Modal */}
      <ProductDetail
        product={detailProduct}
        isOpen={!!detailProduct}
        onClose={() => setDetailProduct(null)}
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