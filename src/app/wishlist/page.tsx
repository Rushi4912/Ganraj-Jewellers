"use client";
import React, { useState } from 'react';
import { Heart, ShoppingCart, Trash2, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import { Product } from '../types/product';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ShoppingCartSidebar from '../components/cart/ShoppingCart';
import ProductDetail from '../components/products/ProductDetails';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  const wishlistProducts = products.filter((product) =>
    wishlist.includes(product.id)
  );

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  return (
    <>
      <Navbar onCartOpen={() => setShowCart(true)} />

      <section className="relative bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/40 py-16">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart size={48} className="mx-auto text-red-500 fill-red-500 mb-4" />
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Your Wishlist
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {wishlist.length} items saved for later
          </p>
        </div>
      </section>

      <section className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {wishlistProducts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
              <Heart size={64} className="mx-auto text-gray-300 mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Your wishlist is empty
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Start adding items you love to your wishlist!
              </p>

              {/* Fixed: missing <a> tag was causing syntax/unreachable code */}
              <a
                href="/shop"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg"
              >
                Explore Products
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                      onClick={() => setDetailProduct(product)}
                    />

                    {product.badge && (
                      <span
                        className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white ${
                          product.badge === 'SALE' ? 'bg-red-500' : 'bg-green-500'
                        }`}
                      >
                        {product.badge}
                      </span>
                    )}

                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                  </div>

                  <div className="p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      {product.category}
                    </p>

                    <h3
                      className="text-lg font-bold text-gray-900 mb-2 hover:text-amber-600 transition-colors cursor-pointer overflow-hidden"
                      onClick={() => setDetailProduct(product)}
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < Math.floor(product.rating)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-gray-300'
                          }
                        />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">
                        ({product.reviews})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.inStock}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ShoppingCart size={18} />
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </button>

                      <button
                        onClick={() => setDetailProduct(product)}
                        className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all font-semibold"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <ProductDetail
        product={detailProduct}
        isOpen={!!detailProduct}
        onClose={() => setDetailProduct(null)}
      />

      <ShoppingCartSidebar
        isOpen={showCart}
        onClose={() => setShowCart(false)}
      />

      <Footer />
    </>
  );
}
