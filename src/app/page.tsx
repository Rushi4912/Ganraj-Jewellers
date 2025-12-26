 "use client";
 import { useState } from 'react';
 import Navbar from "./components/layout/Navbar";
 import HeroSection from "./components/home/HeroSection";
 import Features from "./components/home/Features";
 import TrendingProducts from "./components/products/TrendingProducts";
 import VideoSection from "./components/products/VideoSection";
 import PopularCategories from "./components/products/PopularCategories";
 import Newsletter from "./components/home/NewsLetter";
 import Footer from "./components/layout/Footer";
 import ShoppingCartSidebar from "./components/cart/ShoppingCart";


export default function HomePage(){
  const [showCart, setShowCart] = useState(false);


  return(
   <div>
    <Navbar onCartOpen={() => setShowCart(true)} />
    <HeroSection/>
    
    {/* <Features/> */}
    <VideoSection/>
    <TrendingProducts/>
    <PopularCategories/>
    <Newsletter/>
    <Footer/>
    <ShoppingCartSidebar
        isOpen={showCart}
        onClose={() => setShowCart(false)}
      />
   </div>
   
  );
  
}