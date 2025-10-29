"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product, CartItem, DiscountCode, SelectedVariants } from '../types/product';
import { useToast } from './ToastContext';

interface CartContextType {
  cart: CartItem[];
  wishlist: number[];
  compareList: number[];
  appliedDiscount: DiscountCode | null;
  addToCart: (product: Product, selectedVariants?: SelectedVariants) => void;
  removeFromCart: (productId: number, variantId?: string) => void;
  updateCartQuantity: (productId: number, delta: number, variantId?: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: number) => void;
  toggleCompare: (productId: number) => void;
  applyDiscount: (code: DiscountCode) => void;
  removeDiscount: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartTotal: number;
  discountAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [compareList, setCompareList] = useState<number[]>([]);
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const toast = useToast();

  // Load cart data from localStorage on component mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      const savedWishlist = localStorage.getItem('wishlist');
      const savedCompareList = localStorage.getItem('compareList');
      const savedDiscount = localStorage.getItem('appliedDiscount');

      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
      if (savedCompareList) {
        setCompareList(JSON.parse(savedCompareList));
      }
      if (savedDiscount) {
        setAppliedDiscount(JSON.parse(savedDiscount));
      }
    } catch (error) {
      console.error('Error loading cart data from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart data to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('compareList', JSON.stringify(compareList));
    }
  }, [compareList, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      if (appliedDiscount) {
        localStorage.setItem('appliedDiscount', JSON.stringify(appliedDiscount));
      } else {
        localStorage.removeItem('appliedDiscount');
      }
    }
  }, [appliedDiscount, isLoaded]);

  // Generate unique variant ID
  const generateVariantId = (productId: number, variants?: SelectedVariants): string => {
    if (!variants || Object.keys(variants).length === 0) {
      return `${productId}`;
    }
    const variantString = Object.entries(variants)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([key, value]) => `${key}:${value}`)
      .join('|');
    return `${productId}-${variantString}`;
  };

  // Calculate variant price
  const calculateVariantPrice = (product: Product, selectedVariants?: SelectedVariants): number => {
    let price = product.price;
    
    if (selectedVariants && product.variants) {
      product.variants.forEach(variantOption => {
        const selectedValue = selectedVariants[variantOption.type];
        if (selectedValue) {
          const variant = variantOption.options.find(opt => opt.id === selectedValue);
          if (variant && variant.priceModifier) {
            price += variant.priceModifier;
          }
        }
      });
    }
    
    return price;
  };

  const addToCart = (product: Product, selectedVariants?: SelectedVariants) => {
    // If product has variants but none selected, just use base product
    const variantId = generateVariantId(product.id, selectedVariants);
    const finalPrice = calculateVariantPrice(product, selectedVariants);
    
    setCart((prevCart) => {
      const existing = prevCart.find((item) => 
        item.variantId ? item.variantId === variantId : item.id === product.id
      );
      
      if (existing) {
        toast.success(`Updated ${product.name} quantity in cart!`);
        return prevCart.map((item) =>
          (item.variantId ? item.variantId === variantId : item.id === product.id)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      toast.success(`${product.name} added to cart!`);
      return [...prevCart, { 
        ...product, 
        price: finalPrice,
        quantity: 1, 
        selectedVariants,
        variantId 
      }];
    });
  };

  const removeFromCart = (productId: number, variantId?: string) => {
    const product = cart.find(item => 
      variantId ? item.variantId === variantId : item.id === productId
    );
    if (product) {
      toast.info(`${product.name} removed from cart`);
    }
    setCart((prevCart) => prevCart.filter((item) => 
      variantId ? item.variantId !== variantId : item.id !== productId
    ));
  };

  const updateCartQuantity = (productId: number, delta: number, variantId?: string) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          const matches = variantId 
            ? item.variantId === variantId 
            : item.id === productId;
            
          if (matches) {
            const newQuantity = item.quantity + delta;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedDiscount(null);
    toast.info('Cart cleared');
  };

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        toast.info('Removed from wishlist');
        return prev.filter((id) => id !== productId);
      } else {
        toast.success('Added to wishlist!');
        return [...prev, productId];
      }
    });
  };

  const toggleCompare = (productId: number) => {
    setCompareList((prev) => {
      if (prev.includes(productId)) {
        toast.info('Removed from comparison');
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 3) {
        toast.warning('You can compare maximum 3 products');
        return prev;
      }
      toast.success('Added to comparison!');
      return [...prev, productId];
    });
  };

  const applyDiscount = (code: DiscountCode) => {
    setAppliedDiscount(code);
    toast.success(`${code.description} applied!`);
  };

  const removeDiscount = () => {
    setAppliedDiscount(null);
    toast.info('Discount removed');
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = appliedDiscount ? cartSubtotal * appliedDiscount.discount : 0;
  const cartTotal = cartSubtotal - discountAmount;

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        compareList,
        appliedDiscount,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        toggleCompare,
        applyDiscount,
        removeDiscount,
        cartCount,
        cartSubtotal,
        cartTotal,
        discountAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}