const categories = [
  {
    name: "Necklaces",
    image:
      "https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Delicate chains, sculpted pendants",
  },
  {
    name: "Rings",
    image:
      "https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Statement solitaires & stackables",
  },
  {
    name: "Bracelets",
    image:
      "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Modern cuffs & vintage-inspired links",
  },
  {
    name: "Earrings",
    image:
      "https://images.pexels.com/photos/1456221/pexels-photo-1456221.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Minimal hoops to chandelier drama",
  },
  {
    name: "Chains & Bangles",
    image:
      "https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Mixed textures, polished finishes",
  },
  {
    name: "Bespoke Bridal",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=compress&cs=tinysrgb&w=600",
    description: "Limited-edition couture suites",
  },
];

export default function PopularCategories() {
  return (
    <section className="py-20 bg-gradient-to-br from-white via-amber-50/30 to-rose-50/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-amber-500">Curated categories</p>
          <h2 className="text-4xl font-bold text-gray-900">Jewelry wardrobes we love</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From everyday gold to ceremonial couture, each category is artfully styled and ready to make moments glow.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div
              key={category.name}
              className="group rounded-[32px] bg-white p-6 shadow-xl border border-gray-100 hover:-translate-y-1 transition transform"
            >
              <div className="relative overflow-hidden rounded-[24px] mb-6 aspect-[4/3]">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <span className="absolute top-3 right-3 rounded-full bg-white/80 text-xs font-semibold px-3 py-1 text-amber-600">
                  New edit
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.description}</p>
                <button className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-amber-600">
                  Discover now
                  <span aria-hidden>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}