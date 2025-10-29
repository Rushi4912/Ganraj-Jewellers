// components/ui/PageLoader.tsx
import { LucideIcon,ShoppingBag,CreditCard,CheckCircle } from 'lucide-react';

interface PageLoaderProps {
  icon?: LucideIcon;
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'cart' | 'payment' | 'success';
}

export default function PageLoader({ 
  icon: Icon, 
  title, 
  subtitle, 
  variant = 'default' 
}: PageLoaderProps) {
  
  const variants = {
    default: {
      icon: null,
      title: 'Loading...',
      subtitle: 'Please wait while we load your content',
      colors: 'from-amber-500 to-orange-500'
    },
    cart: {
      icon: ShoppingBag,
      title: 'Loading Your Cart',
      subtitle: 'Getting your items ready...',
      colors: 'from-blue-500 to-purple-500'
    },
    payment: {
      icon: CreditCard,
      title: 'Processing Payment',
      subtitle: 'Securing your transaction...',
      colors: 'from-green-500 to-teal-500'
    },
    success: {
      icon: CheckCircle,
      title: 'Almost There',
      subtitle: 'Completing your request...',
      colors: 'from-green-400 to-emerald-500'
    }
  };

  const config = variants[variant];
  const FinalIcon = Icon || config.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        {FinalIcon && (
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <FinalIcon className={`w-10 h-10 ${config.colors} text-transparent bg-clip-text`} />
            </div>
            <div className={`absolute inset-0 border-4 border-transparent rounded-full animate-spin ${config.colors.replace('from-', 'border-t-').replace(' to-', ' border-r-')}`}></div>
          </div>
        )}
        <h3 className="text-2xl font-bold text-gray-800 mb-3">
          {title || config.title}
        </h3>
        <p className="text-gray-600 mb-6">{subtitle || config.subtitle}</p>
        <div className="flex space-x-2 justify-center">
          {[0.1, 0.2, 0.3].map((delay) => (
            <div
              key={delay}
              className={`w-3 h-3 rounded-full animate-bounce ${config.colors.replace('from-', 'bg-').split(' ')[0]}`}
              style={{ animationDelay: `${delay}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}