import { Star, Heart, ShoppingCart } from 'lucide-react';

export default function TrendingProducts() {
  const products = [
    {
      name: 'Sparkle Gemstone Earrings',
      price: 34.21,
      originalPrice: 45.00,
      rating: 4,
      image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'SALE'
    },
    {
      name: 'Daisy Silver Pendant Necklace',
      price: 123.00,
      rating: 5,
      image: 'https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: null
    },
    {
      name: 'Classic Solitaire Ring',
      price: 87.00,
      rating: 5,
      image: 'https://images.pexels.com/photos/1232931/pexels-photo-1232931.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'NEW'
    },
    {
      name: 'Rose Gold Circle Pendant',
      price: 65.21,
      rating: 4,
      image: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: null
    },
    {
      name: 'Blue Sapphire Earrings',
      price: 203.55,
      rating: 5,
      image: 'https://images.pexels.com/photos/1456221/pexels-photo-1456221.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: null
    },
    {
      name: 'Elegant Pearl Ring',
      price: 67.00,
      originalPrice: 89.00,
      rating: 4,
      image: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'SALE'
    },
    {
      name: 'Diamond Solitaire Pendant',
      price: 203.10,
      rating: 5,
      image: 'https://images.pexels.com/photos/1432407/pexels-photo-1432407.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: null
    },
    {
      name: 'Ruby Heart Bracelet',
      price: 77.00,
      originalPrice: 95.00,
      rating: 5,
      image: 'https://images.pexels.com/photos/248077/pexels-photo-248077.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'SALE'
    }
  ];

  const tabs = ['FEATURED', 'NEW ARRIVALS', 'BEST SELLER'];

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
          {products.map((product, index) => (
            <div key={index} className="group relative">
              <div className="relative overflow-hidden rounded-xl mb-4 bg-gray-50 aspect-square">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.badge && (
                  <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white ${
                    product.badge === 'SALE' ? 'bg-red-500' : 'bg-green-500'
                  }`}>
                    {product.badge}
                  </span>
                )}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity space-y-2">
                  <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors shadow-lg">
                    <Heart size={18} />
                  </button>
                  <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors shadow-lg">
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Gold Jewelry</p>
                <h3 className="text-sm font-semibold text-gray-900 mb-2 hover:text-amber-600 transition-colors cursor-pointer">
                  {product.name}
                </h3>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < product.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors font-medium">
            VIEW ALL PRODUCTS
          </button>
        </div>
      </div>
    </section>
  );
}
