import { Mail } from 'lucide-react';

export default function Newsletter() {
  return (
    <section className="py-20 bg-gradient-to-r from-amber-500 to-orange-500 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <Mail size={48} className="text-white mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Get the latest updates on new products and upcoming sales
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-gray-900 text-white px-8 py-4 rounded-md hover:bg-gray-800 transition-colors font-medium whitespace-nowrap">
              SUBSCRIBE
            </button>
          </div>

          <p className="text-sm text-white/80 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
