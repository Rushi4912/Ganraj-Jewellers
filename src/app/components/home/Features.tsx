import { Truck, Shield, CreditCard, Headphones } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'On orders over ₹2000'
    },
    {
      icon: Shield,
      title: '30 Days Return',
      description: 'Money back guarantee'
    },
    {
      icon: CreditCard,
      title: 'Secure Payment',
      description: '100% secure payment'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Dedicated support team'
    }
  ];

  return (
    <section className="py-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group flex flex-col items-center text-center space-y-4 p-6 rounded-2xl transition-all duration-300 hover:bg-white hover:shadow-xl hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center transition-colors duration-300 group-hover:bg-amber-600">
                <feature.icon size={30} className="text-amber-700 transition-colors duration-300 group-hover:text-white" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-500 font-medium">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
