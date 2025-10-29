
  export interface ShippingAddress {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }
  
  export interface PaymentMethod {
    type: 'card' | 'paypal' | 'cod';
    cardNumber?: string;
    cardName?: string;
    expiryDate?: string;
    cvv?: string;
  }
  
  export interface Order {
    id: string;
    items: CartItem[];
    shipping: ShippingAddress;
    payment: PaymentMethod;
    subtotal: number;
    discount: number;
    shipping_cost: number;
    total: number;
    date: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered';
  }
  export interface UserReview {
    name: string;
    rating: number;
    comment: string;
    date: string;
  }
  
  export interface Category {
    id: string;
    name: string;
  }
  
  export interface DiscountCode {
    discount: number;
    description: string;
  }
  
  export interface CartItem extends Product {
    quantity: number;
  }

  export interface ProductVariant {
    id: string;
    name: string;
    value: string;
    inStock: boolean;
    priceModifier?: number; // Additional cost for this variant
  }
  
  export interface ProductVariantOption {
    type: 'size' | 'length' | 'material' | 'color';
    label: string;
    required: boolean;
    options: ProductVariant[];
  }
  
  export interface Product {
    id: number;
    name: string;
    category: 'rings' | 'necklaces' | 'earrings' | 'bracelets';
    price: number;
    originalPrice?: number;
    rating: number;
    reviews: number;
    image: string;
    images: string[];
    badge?: 'SALE' | 'NEW' | null;
    description: string;
    inStock: boolean;
    userReviews: UserReview[];
    variants?: ProductVariantOption[]; // NEW: Add variants
  }
  
  export interface SelectedVariants {
    [key: string]: string; // e.g., { "size": "7", "material": "gold" }
  }
  
  // Update CartItem to include selected variants
  export interface CartItem extends Product {
    quantity: number;
    selectedVariants?: SelectedVariants; // NEW
    variantId?: string; // Unique ID for this variant combination
  }