"use client";

import { useState } from "react";
import { Product } from "../../types/product";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import ShoppingCartSidebar from "../../components/cart/ShoppingCart";
import ProductShowcase from "../../components/products/ProductShowcase";

interface ProductPageClientProps {
  product: Product;
}

export default function ProductPageClient({ product }: ProductPageClientProps) {
  const [showCart, setShowCart] = useState(false);

  return (
    <>
      <Navbar onCartOpen={() => setShowCart(true)} />
      <ProductShowcase product={product} />
      <ShoppingCartSidebar isOpen={showCart} onClose={() => setShowCart(false)} />
      <Footer />
    </>
  );
}

