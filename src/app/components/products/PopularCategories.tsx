export default function PopularCategories() {
    const categories = [
      {
        name: 'Necklaces',
        image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=300'
      },
      {
        name: 'Rings',
        image: 'https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg?auto=compress&cs=tinysrgb&w=300'
      },
      {
        name: 'Necklaces',
        image: 'https://images.pexels.com/photos/1232931/pexels-photo-1232931.jpeg?auto=compress&cs=tinysrgb&w=300'
      },
      {
        name: 'Bracelets',
        image: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=300'
      },
      {
        name: 'Earrings',
        image: 'https://images.pexels.com/photos/1456221/pexels-photo-1456221.jpeg?auto=compress&cs=tinysrgb&w=300'
      },
      {
        name: 'Chains & Bangles',
        image: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=300'
      }
    ];
  
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Popular Categories
            </h2>
          </div>
  
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="group text-center">
                <div className="relative overflow-hidden rounded-full aspect-square mb-4 shadow-md hover:shadow-xl transition-shadow bg-white p-4">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                  {category.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  