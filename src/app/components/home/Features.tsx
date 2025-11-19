import { Truck, Shield, CreditCard, Headphones } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'On order over ₹2000'
    },
    {
      icon: Shield,
      title: 'Money Guarantee',
      description: 'Over 30 days & years'
    },
    {
      icon: CreditCard,
      title: 'Online Payment',
      description: 'Easy to payment'
    },
    {
      icon: Headphones,
      title: 'Online Support',
      description: 'Very helpful 24/7'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center">
                <feature.icon size={32} className="text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
