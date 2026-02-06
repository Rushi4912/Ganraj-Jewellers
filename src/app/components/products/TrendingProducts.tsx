'use client';

import { ArrowRight, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { useCart } from '@/app/context/CartContext';
import { Product as ShopProduct } from '@/app/types/product';
import QuickView from './QuickView';
import { useRouter } from 'next/navigation';
import ProductCard from './ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  discount_price: number | null;
  images: string[];
  is_featured: boolean;
  stock: number;
  slug?: string;
  description?: string;
}

const TABS = ['FEATURED', 'NEW ARRIVALS', 'BEST SELLER'] as const;

export default function TrendingProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, number>>({});
  const [quickViewProduct, setQuickViewProduct] = useState<ShopProduct | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const initialLoadRef = useRef(true);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const router = useRouter();

  useEffect(() => {
    fetchProducts(TABS[activeTab]);
  }, [activeTab]);

  const fetchProducts = async (tab: string) => {
    const isInitialLoad = initialLoadRef.current;

    if (isInitialLoad) {
      setLoading(true);
    } else {
      setIsTransitioning(true);
    }

    try {
      let query = supabase.from('products').select('*');

      if (tab === 'FEATURED') {
        query = query.limit(8).order('created_at', { ascending: false });
      } else if (tab === 'NEW ARRIVALS') {
        query = query.order('created_at', { ascending: false }).limit(8);
      } else if (tab === 'BEST SELLER') {
        query = query.order('created_at', { ascending: false }).limit(8);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error(`Error fetching ${tab} products:`, error);
    } finally {
      if (isInitialLoad) {
        setLoading(false);
        initialLoadRef.current = false;
      } else {
        if (transitionTimeoutRef.current) {
          clearTimeout(transitionTimeoutRef.current);
        }
        transitionTimeoutRef.current = setTimeout(() => {
          setIsTransitioning(false);
          transitionTimeoutRef.current = null;
        }, 350);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const handleImageError = (productId: string) => {
    setImageErrors(prev => {
      const currentIndex = prev[productId] || 0;
      return {
        ...prev,
        [productId]: currentIndex + 1
      };
    });
  };

  const getCurrentImage = (product: Product) => {
    const errorIndex = imageErrors[product.id] || 0;
    if (errorIndex < product.images.length && product.images[errorIndex]) {
      return product.images[errorIndex];
    }
    return 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=400';
  };

  const getRandomRating = () => Math.random() > 0.5 ? 5 : 4;

  const transformToShopProduct = (product: Product, index: number): ShopProduct => {
    const numericId = Number(product.id);
    const resolvedId = Number.isFinite(numericId) ? numericId : index + 1;
    return {
      id: resolvedId,
      remoteId: product.id?.toString(),
      slug: product.slug,
      name: product.name,
      category: 'rings' as const,
      price: product.discount_price ? Number(product.discount_price) : Number(product.price),
      originalPrice: product.discount_price ? Number(product.price) : undefined,
      rating: 4.5,
      reviews: Math.floor(Math.random() * 100) + 10,
      image: product.images[0] || '',
      images: product.images || [],
      badge: product.discount_price ? 'SALE' : (product.is_featured ? 'NEW' : null),
      description: product.description || 'Beautiful handcrafted jewellery piece.',
      inStock: product.stock > 0,
      userReviews: [],
      variants: undefined
    };
  };

  const handleQuickView = (product: Product, index: number) => {
    const shopProduct = transformToShopProduct(product, index);
    setQuickViewProduct(shopProduct);
  };

  const handleAddToCart = (product: Product, index: number) => {
    const shopProduct = transformToShopProduct(product, index);
    addToCart(shopProduct);
  };

  const handleProductClick = (product: Product) => {
    router.push(`/shop/${product.slug ?? product.id}`);
  };

  const handleTabClick = (index: number) => {
    if (index !== activeTab) {
      setActiveTab(index);
    }
  };

  return (
    <section
      className="py-12 relative"
      style={{ backgroundColor: '#F2F0EB' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="text-center mb-12 space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-[#8B7355] font-medium block animate-fadeIn">
            In Demand
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-[#2D2A26] animate-fadeInUp">
            Trending <span className="italic text-[#8B7355]">Pieces</span>
          </h2>

          {/* Tabs */}
          <div className="flex justify-center gap-8 mt-8 border-b border-[#C5B4A5]/30 inline-flex pb-1">
            {TABS.map((tab, index) => (
              <button
                key={index}
                onClick={() => handleTabClick(index)}
                className={`text-xs font-bold tracking-[0.2em] uppercase pb-3 transition-all duration-300 relative ${activeTab === index
                  ? 'text-[#8B7355]'
                  : 'text-[#5A4D41]/60 hover:text-[#5A4D41]'
                  }`}
              >
                {tab}
                <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#8B7355] transition-transform duration-300 ${activeTab === index ? 'scale-x-100' : 'scale-x-0'}`}></span>
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20 min-h-[400px]">
            <Loader2 className="w-8 h-8 text-[#8B7355] animate-spin" />
          </div>
        ) : (
          <div className="relative min-h-[400px]">
            {isTransitioning && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#F2F0EB]/60 z-10 backdrop-blur-[1px] transition-all duration-500">
              </div>
            )}

            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 transition-opacity duration-500 ${isTransitioning ? 'opacity-40' : 'opacity-100'
                }`}
            >
              {products.map((product, index) => {
                const shopProduct = transformToShopProduct(product, index);

                return (
                  <ProductCard
                    key={product.id}
                    product={shopProduct}
                    onQuickView={() => handleQuickView(product, index)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-16">
          <button
            onClick={() => router.push('/shop')}
            className="group inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-[#5A4D41] hover:text-[#8B7355] transition-colors border-b border-[#C5B4A5] pb-1 hover:border-[#8B7355]"
          >
            Explore All Collections
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickView
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onViewFullDetails={(product) => {
          setQuickViewProduct(null);
          const destination = product.slug ?? product.remoteId ?? product.id.toString();
          router.push(`/shop/${destination}`);
        }}
      />
    </section>
  );
}