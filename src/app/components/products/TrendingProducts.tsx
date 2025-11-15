'use client';

import { Star, Heart, ShoppingCart, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { useCart } from '@/app/context/CartContext';
import { Product as ShopProduct } from '@/app/types/product';
import QuickView from './QuickView';
import { useRouter } from 'next/navigation';

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

export default function TrendingProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, number>>({});
  const [quickViewProduct, setQuickViewProduct] = useState<ShopProduct | null>(null);
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(8)
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('Fetched products:', data);
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath: string) => {
    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(imagePath);
    console.log('Image path:', imagePath, '→ URL:', data.publicUrl);
    return data.publicUrl;
  };

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
    
    // Try images in order
    if (errorIndex < product.images.length && product.images[errorIndex]) {
      return product.images[errorIndex];
    }
    
    // Fallback image
    return 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=400';
  };

  const getBadge = (product: Product) => {
    if (product.discount_price) return 'SALE';
    if (product.is_featured) return 'NEW';
    return null;
  };

  const getRandomRating = () => {
    return Math.random() > 0.5 ? 5 : 4;
  };

  const transformToShopProduct = (product: Product, index: number): ShopProduct => {
    return {
      id: index + 1,
      name: product.name,
      category: 'rings' as const,
      price: product.discount_price ? Number(product.discount_price) : Number(product.price),
      originalPrice: product.discount_price ? Number(product.price) : undefined,
      rating: 4.5,
      reviews: Math.floor(Math.random() * 100) + 10,
      image: product.images[0] || '',
      images: product.images || [],
      badge: product.discount_price ? 'SALE' : (product.is_featured ? 'NEW' : null),
      description: product.description || 'Beautiful handcrafted jewelry piece.',
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
    router.push('/shop');
  };

  const tabs = ['FEATURED', 'NEW ARRIVALS', 'BEST SELLER'];

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Trending Products
          </h2>
          <div className="flex justify-center gap-8 flex-wrap">
            {tabs.map((tab, index) => (
              <button
                key={index}
                className={`text-sm font-semibold tracking-wide ${
                  index === 0 ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-500 hover:text-gray-900'
                } pb-2 transition-colors`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => {
            const badge = getBadge(product);
            const rating = getRandomRating();
            const currentImage = getCurrentImage(product);

            return (
              <div key={product.id} className="group relative">
                <div className="relative overflow-hidden rounded-xl mb-4 bg-gray-50 aspect-square cursor-pointer"
                     onClick={() => handleProductClick(product)}>
                  {currentImage ? (
                    <img
                      src={currentImage}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={() => handleImageError(product.id)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  {badge && (
                    <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white ${
                      badge === 'SALE' ? 'bg-red-500' : 'bg-green-500'
                    }`}>
                      {badge}
                    </span>
                  )}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity space-y-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickView(product, index);
                      }}
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors shadow-lg"
                      title="Quick View"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add to wishlist functionality
                      }}
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors shadow-lg"
                      title="Add to Wishlist"
                    >
                      <Heart size={18} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product, index);
                      }}
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors shadow-lg"
                      title="Add to Cart"
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Gold Jewelry</p>
                  <h3 
                    onClick={() => handleProductClick(product)}
                    className="text-sm font-semibold text-gray-900 mb-2 hover:text-amber-600 transition-colors cursor-pointer">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                    ₹ {product.discount_price ? Number(product.discount_price).toFixed(2) : Number(product.price).toFixed(2)}
                    </span>
                    {product.discount_price && (
                      <span className="text-sm text-gray-400 line-through">
                        ₹ {Number(product.price).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <button 
            onClick={() => router.push('/shop')}
            className="bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors font-medium">
            VIEW ALL PRODUCTS
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
          router.push('/shop');
        }}
      />
    </section>
  );
}