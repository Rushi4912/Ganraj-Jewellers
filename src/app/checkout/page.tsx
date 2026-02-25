"use client";
import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { ShippingAddress, PaymentMethod } from "../types/product";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useOrder } from '../../app/context/OrderContext';
import {
  CreditCard,
  Truck,
  CheckCircle,
  ShoppingBag,
  ArrowRight,
  Lock,
  User,
  Mail,
  Phone,
  Home,
  ShieldCheck,
  ChevronRight
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    cartSubtotal,
    cartTotal,
    discountAmount,
    appliedDiscount,
    clearCart,
  } = useCart();
  const toast = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const { addOrder } = useOrder();

  // Shipping Information
  const [shipping, setShipping] = useState<ShippingAddress>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });

  // Payment Information
  const [payment, setPayment] = useState<PaymentMethod>({
    type: "card",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const shippingCost = cartSubtotal > 5000 ? 0 : 500;
  const finalTotal = cartTotal + shippingCost;

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (isClient && cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#F2F0EB] flex items-center justify-center py-20 px-6">
          <div className="max-w-md w-full text-center">
            <div className="w-24 h-24 rounded-full bg-[#E5E0D8] flex items-center justify-center mb-8 mx-auto text-[#C5B4A5]">
              <ShoppingBag size={32} />
            </div>
            <h2 className="font-display text-4xl text-[#2D2A26] mb-4">
              Your bag is empty
            </h2>
            <p className="text-[#6B5D52] mb-10 text-lg">
              Our atelier awaits. exquisite pieces are just a click away.
            </p>
            <Link
              href="/shop"
              className="px-8 py-4 bg-[#2D2A26] text-white rounded-full font-medium hover:bg-[#8B7355] transition-colors duration-300 uppercase tracking-widest text-xs"
            >
              Return to Shop
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!isClient) {
    return (
      <LoadingSpinner
        title="Loading Checkout"
        subtitle="Preparing your secure checkout experience..."
        size="lg"
      />
    );
  }

  const validateShipping = () => {
    if (!shipping.fullName || !shipping.email || !shipping.phone || !shipping.address || !shipping.city || !shipping.state || !shipping.zipCode) {
      toast.error("Please fill in all shipping fields");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shipping.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const validatePayment = () => {
    if (payment.type === "card") {
      if (!payment.cardNumber || !payment.cardName || !payment.expiryDate || !payment.cvv) {
        toast.error("Please fill in all card details");
        return false;
      }
      if (payment.cardNumber.replace(/\s/g, "").length !== 16) {
        toast.error("Please enter a valid 16-digit card number");
        return false;
      }
      if (payment.cvv.length !== 3) {
        toast.error("Please enter a valid 3-digit CVV");
        return false;
      }
    }
    if (!agreedToTerms) {
      toast.error("Please agree to the terms and conditions");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateShipping()) return;
    if (currentStep === 2 && !validatePayment()) return;
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePlaceOrder = async () => {
    if (!validatePayment()) return;
    setIsPlacingOrder(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 9);

    const order = {
      id: orderId,
      orderNumber: `ORD-${Date.now()}`,
      items: cart,
      shipping: shipping,
      payment: payment,
      subtotal: cartSubtotal,
      discount: discountAmount,
      discountCode: appliedDiscount?.description,
      shippingCost: shippingCost,
      total: finalTotal,
      date: new Date().toISOString(),
      estimatedDelivery: estimatedDelivery.toISOString(),
      status: 'processing' as const,
    };

    addOrder(order);
    toast.success('Order placed successfully!');
    clearCart();
    setIsPlacingOrder(false);
    setTimeout(() => {
      router.push(`/order-confirmation?orderId=${orderId}`);
    }, 1000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-12">
      {[
        { num: 1, label: "Shipping" },
        { num: 2, label: "Payment" },
        { num: 3, label: "Review" }
      ].map((step, idx) => (
        <div key={step.num} className="flex items-center">
          <div className={`flex flex-col items-center gap-2 ${currentStep === step.num ? 'text-[#8B7355]' : currentStep > step.num ? 'text-[#2D2A26]' : 'text-[#C5B4A5]'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${currentStep === step.num ? 'border-[#8B7355] bg-[#8B7355] text-white' :
              currentStep > step.num ? 'border-[#2D2A26] bg-[#2D2A26] text-white' :
                'border-[#C5B4A5] text-[#C5B4A5]'
              }`}>
              {currentStep > step.num ? <CheckCircle size={14} /> : step.num}
            </div>
            <span className="text-[10px] uppercase tracking-widest font-bold">{step.label}</span>
          </div>
          {idx < 2 && (
            <div className={`w-12 h-[1px] mx-4 mb-5 ${currentStep > step.num ? 'bg-[#2D2A26]' : 'bg-[#C5B4A5]/30'}`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F2F0EB] py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">

          <StepIndicator />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Left Column: Forms */}
            <div className="lg:col-span-2 space-y-8">

              {/* Shipping Form */}
              {currentStep === 1 && (
                <div className="bg-white p-8 md:p-12 rounded-[20px] shadow-sm animate-fadeInUp">
                  <h2 className="font-display text-3xl text-[#2D2A26] mb-8">Shipping Address</h2>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-[#6B5D52] font-bold">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C5B4A5]" size={16} />
                          <input
                            type="text"
                            value={shipping.fullName}
                            onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                            className="w-full bg-[#FAFAFA] border border-[#E5E0D8] rounded-xl py-3 pl-12 pr-4 focus:border-[#8B7355] outline-none transition-colors"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-[#6B5D52] font-bold">Phone</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C5B4A5]" size={16} />
                          <input
                            type="text"
                            value={shipping.phone}
                            onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                            className="w-full bg-[#FAFAFA] border border-[#E5E0D8] rounded-xl py-3 pl-12 pr-4 focus:border-[#8B7355] outline-none transition-colors"
                            placeholder="+91 99999 99999"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-[#6B5D52] font-bold">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C5B4A5]" size={16} />
                        <input
                          type="email"
                          value={shipping.email}
                          onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                          className="w-full bg-[#FAFAFA] border border-[#E5E0D8] rounded-xl py-3 pl-12 pr-4 focus:border-[#8B7355] outline-none transition-colors"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-[#6B5D52] font-bold">Street Address</label>
                      <div className="relative">
                        <Home className="absolute left-4 top-4 text-[#C5B4A5]" size={16} />
                        <textarea
                          value={shipping.address}
                          onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                          className="w-full bg-[#FAFAFA] border border-[#E5E0D8] rounded-xl py-3 pl-12 pr-4 focus:border-[#8B7355] outline-none transition-colors min-h-[100px]"
                          placeholder="Flat No, Building, Street"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-[#6B5D52] font-bold">City</label>
                        <input
                          type="text"
                          value={shipping.city}
                          onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                          className="w-full bg-[#FAFAFA] border border-[#E5E0D8] rounded-xl py-3 px-4 focus:border-[#8B7355] outline-none transition-colors"
                          placeholder="Mumbai"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-[#6B5D52] font-bold">State</label>
                        <input
                          type="text"
                          value={shipping.state}
                          onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                          className="w-full bg-[#FAFAFA] border border-[#E5E0D8] rounded-xl py-3 px-4 focus:border-[#8B7355] outline-none transition-colors"
                          placeholder="Maharashtra"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1 space-y-2">
                        <label className="text-xs uppercase tracking-wider text-[#6B5D52] font-bold">Pincode</label>
                        <input
                          type="text"
                          value={shipping.zipCode}
                          onChange={(e) => setShipping({ ...shipping, zipCode: e.target.value })}
                          className="w-full bg-[#FAFAFA] border border-[#E5E0D8] rounded-xl py-3 px-4 focus:border-[#8B7355] outline-none transition-colors"
                          placeholder="400001"
                        />
                      </div>
                    </div>

                    <div className="pt-6 border-t border-[#E5E0D8]">
                      <button
                        onClick={handleNext}
                        className="w-full bg-[#2D2A26] text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-[#8B7355] transition-all duration-300 flex items-center justify-center gap-2 group"
                      >
                        Continue to Payment <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Form */}
              {currentStep === 2 && (
                <div className="bg-white p-8 md:p-12 rounded-[20px] shadow-sm animate-fadeInUp">
                  <h2 className="font-display text-3xl text-[#2D2A26] mb-8">Secure Payment</h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {['card', 'paypal', 'cod'].map((method) => (
                      <button
                        key={method}
                        onClick={() => setPayment({ ...payment, type: method as any })}
                        className={`p-4 rounded-xl border border-[#E5E0D8] flex flex-col items-center justify-center gap-3 transition-all ${payment.type === method ? 'bg-[#2D2A26] text-white border-[#2D2A26]' : 'bg-[#FAFAFA] text-[#6B5D52] hover:bg-[#E5E0D8]'}`}
                      >
                        {method === 'card' && <CreditCard size={24} />}
                        {method === 'paypal' && <span className="font-bold italic">PayPal</span>}
                        {method === 'cod' && <ShoppingBag size={24} />}
                        <span className="text-xs font-bold uppercase tracking-wider">
                          {method === 'cod' ? 'Cash on Delivery' : method}
                        </span>
                      </button>
                    ))}
                  </div>

                  {payment.type === 'card' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-[#6B5D52] font-bold">Card Number</label>
                        <div className="relative">
                          <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C5B4A5]" size={16} />
                          <input
                            type="text"
                            value={payment.cardNumber}
                            onChange={(e) => setPayment({ ...payment, cardNumber: formatCardNumber(e.target.value) })}
                            maxLength={19}
                            className="w-full bg-[#FAFAFA] border border-[#E5E0D8] rounded-xl py-3 pl-12 pr-4 focus:border-[#8B7355] outline-none transition-colors font-mono"
                            placeholder="0000 0000 0000 0000"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-[#6B5D52] font-bold">Name on Card</label>
                        <input
                          type="text"
                          value={payment.cardName}
                          onChange={(e) => setPayment({ ...payment, cardName: e.target.value })}
                          className="w-full bg-[#FAFAFA] border border-[#E5E0D8] rounded-xl py-3 px-4 focus:border-[#8B7355] outline-none transition-colors uppercase"
                          placeholder="JOHN DOE"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-wider text-[#6B5D52] font-bold">Expiry</label>
                          <input
                            type="text"
                            value={payment.expiryDate}
                            onChange={(e) => {
                              let v = e.target.value.replace(/\D/g, "");
                              if (v.length >= 2) v = v.slice(0, 2) + "/" + v.slice(2, 4);
                              setPayment({ ...payment, expiryDate: v });
                            }}
                            maxLength={5}
                            className="w-full bg-[#FAFAFA] border border-[#E5E0D8] rounded-xl py-3 px-4 focus:border-[#8B7355] outline-none transition-colors text-center"
                            placeholder="MM/YY"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-wider text-[#6B5D52] font-bold">CVV</label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C5B4A5]" size={16} />
                            <input
                              type="text"
                              value={payment.cvv}
                              onChange={(e) => setPayment({ ...payment, cvv: e.target.value.slice(0, 3) })}
                              maxLength={3}
                              className="w-full bg-[#FAFAFA] border border-[#E5E0D8] rounded-xl py-3 pl-12 pr-4 focus:border-[#8B7355] outline-none transition-colors text-center"
                              placeholder="123"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-8 pt-6 border-t border-[#E5E0D8]">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="w-5 h-5 accent-[#8B7355] cursor-pointer"
                      />
                      <span className="text-sm text-[#6B5D52] group-hover:text-[#2D2A26] transition-colors">
                        I agree to the <Link href="/terms" className="underline">Terms</Link> & <Link href="/privacy" className="underline">Privacy Policy</Link>
                      </span>
                    </label>
                  </div>

                  <div className="mt-8 flex gap-4">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-4 rounded-xl border border-[#C5B4A5] text-[#6B5D52] font-bold uppercase tracking-wider hover:bg-[#FAFAFA] transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNext}
                      className="flex-1 bg-[#2D2A26] text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-[#8B7355] transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                      Review Order <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              )}

              {/* Review Step */}
              {currentStep === 3 && (
                <div className="bg-white p-8 md:p-12 rounded-[20px] shadow-sm animate-fadeInUp">
                  <h2 className="font-display text-3xl text-[#2D2A26] mb-8">Order Summary</h2>

                  <div className="space-y-6 text-[#6B5D52]">
                    <div className="flex justify-between items-start p-4 bg-[#FAFAFA] rounded-xl border border-[#E5E0D8]">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider block mb-1 text-[#8B7355]">Ship To</span>
                        <p className="font-medium text-[#2D2A26]">{shipping.fullName}</p>
                        <p className="text-sm">{shipping.address}, {shipping.city}</p>
                        <p className="text-sm">{shipping.state} - {shipping.zipCode}</p>
                      </div>
                      <button onClick={() => setCurrentStep(1)} className="text-xs font-bold underline">Edit</button>
                    </div>

                    <div className="flex justify-between items-start p-4 bg-[#FAFAFA] rounded-xl border border-[#E5E0D8]">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider block mb-1 text-[#8B7355]">Payment Method</span>
                        <p className="font-medium text-[#2D2A26] uppercase">{payment.type === 'cod' ? 'Cash on Delivery' : payment.type}</p>
                        {payment.type === 'card' && payment.cardNumber && <p className="text-sm">Ending in {payment.cardNumber.slice(-4)}</p>}
                      </div>
                      <button onClick={() => setCurrentStep(2)} className="text-xs font-bold underline">Edit</button>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-[#E5E0D8] space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6B5D52]">Subtotal</span>
                      <span className="text-[#2D2A26] font-medium">₹{cartSubtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6B5D52]">Shipping</span>
                      <span className="text-[#2D2A26] font-medium">{shippingCost > 0 ? `₹${shippingCost}` : 'Free'}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-3 border-t border-[#E5E0D8]">
                      <span className="text-[#2D2A26]">Total</span>
                      <span className="text-[#8B7355]">₹{finalTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                    className="w-full mt-8 bg-[#2D2A26] text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-[#8B7355] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isPlacingOrder ? 'Processing...' : 'Confirm Order'}
                    {!isPlacingOrder && <ShieldCheck size={18} />}
                  </button>
                  <p className="text-center text-xs text-[#C5B4A5] mt-4 flex items-center justify-center gap-1">
                    <Lock size={12} /> SSL Secured Transaction
                  </p>
                </div>
              )}

            </div>

            {/* Right Column: Mini Cart Summary */}
            <div className="hidden lg:block">
              <div className="sticky top-28 bg-white p-6 rounded-[20px] shadow-sm border border-[#E5E0D8]/50">
                <h3 className="font-display text-xl text-[#2D2A26] mb-6">In Your Bag</h3>
                <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 bg-[#F2F0EB] rounded-lg overflow-hidden relative flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#2D2A26] line-clamp-2">{item.name}</p>
                        <p className="text-xs text-[#6B5D52] mt-1">Qty: {item.quantity}</p>
                        <p className="text-sm font-bold text-[#8B7355] mt-1">₹{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-[#E5E0D8]">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[#6B5D52]">Total to Pay</span>
                    <span className="text-xl font-bold text-[#2D2A26]">₹{finalTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
