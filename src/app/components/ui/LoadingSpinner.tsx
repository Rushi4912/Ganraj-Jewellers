
import { ShoppingBag } from 'lucide-react';

interface LoadingSpinnerProps {
  title?: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ 
  title = "Preparing Your Order", 
  subtitle = "Getting your items ready...",
  size = 'md'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className={`relative ${sizeClasses[size]} mx-auto mb-6`}>
          {/* Shopping cart icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <ShoppingBag className={`${iconSizes[size]} text-amber-500 animate-bounce`} />
          </div>
          {/* Rotating border */}
          <div className="absolute inset-0 border-4 border-transparent border-t-amber-400 border-r-orange-400 rounded-full animate-spin"></div>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-600 mb-4">{subtitle}</p>
        <div className="flex space-x-2 justify-center">
          <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
        </div>
      </div>
    </div>
  );
}