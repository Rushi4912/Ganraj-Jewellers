"use client";
import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { ShippingAddress, PaymentMethod } from "../types/product";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useRouter } from "next/navigation";
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useOrder } from '../../app/context/OrderContext';
import {
  CreditCard,
  Truck,
  CheckCircle,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Lock,
  MapPin,
  User,
  Mail,
  Phone,
  Home,
  DollarSign,
  ShieldCheck
} from "lucide-react";

// Import SVG icons
// import { VisaIcon, MastercardIcon, AmexIcon, PayPalIcon } from "../components/ui/PaymentIcons";

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
  const shippingCost = cartSubtotal > 5000 ? 0 : 500; // Updated shipping threshold
  const finalTotal = cartTotal + shippingCost;
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (isClient && cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
          <div className="max-w-md mx-auto px-4 text-center">
            <div className="bg-white rounded-2xl shadow-lg p-12">
              <ShoppingBag size={64} className="mx-auto text-gray-300 mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-8">
                Add some items to your cart before checking out
              </p>
              <a
                href="/shop"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:shadow-xl transition-all duration-300 font-semibold"
              >
                Browse Products
              </a>
            </div>
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
    if (
      !shipping.fullName ||
      !shipping.email ||
      !shipping.phone ||
      !shipping.address ||
      !shipping.city ||
      !shipping.state ||
      !shipping.zipCode
    ) {
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
      if (
        !payment.cardNumber ||
        !payment.cardName ||
        !payment.expiryDate ||
        !payment.cvv
      ) {
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

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePlaceOrder = async () => {
    if (!validatePayment()) return;
    
    setIsPlacingOrder(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate order
    const orderNumber = `ORD-${Date.now()}`;
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Calculate estimated delivery (7-10 business days)
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 9);
    
    const order = {
      id: orderId,
      orderNumber: orderNumber,
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
    
    // Save order
    addOrder(order);
    
    toast.success('Order placed successfully!');
    clearCart();
    setIsPlacingOrder(false);
    
    // Redirect to confirmation page
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

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const steps = [
    { number: 1, title: "Shipping", icon: Truck },
    { number: 2, title: "Payment", icon: CreditCard },
    { number: 3, title: "Review", icon: CheckCircle },
  ];

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-center">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all ${
                        currentStep >= step.number
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 border-amber-500 text-white shadow-lg"
                          : "bg-white border-gray-200 text-gray-400"
                      }`}
                    >
                      <step.icon size={24} />
                    </div>
                    <span
                      className={`mt-3 text-sm font-bold uppercase tracking-wide ${
                        currentStep >= step.number
                          ? "text-amber-600"
                          : "text-gray-400"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-full max-w-[100px] h-1 mx-4 mb-8 transition-all rounded-full ${
                        currentStep > step.number
                          ? "bg-amber-500"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                {/* Step 1: Shipping Information */}
                {currentStep === 1 && (
                  <div className="animate-fade-in">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3 pb-6 border-b border-gray-100">
                      <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                        <Truck size={28} />
                      </div>
                      Shipping Information
                    </h2>

                    <div className="space-y-6">
                      {/* Full Name */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={20}
                          />
                          <input
                            type="text"
                            value={shipping.fullName}
                            onChange={(e) =>
                              setShipping({
                                ...shipping,
                                fullName: e.target.value,
                              })
                            }
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>

                      {/* Email & Phone */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <div className="relative">
                            <Mail
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              size={20}
                            />
                            <input
                              type="email"
                              value={shipping.email}
                              onChange={(e) =>
                                setShipping({
                                  ...shipping,
                                  email: e.target.value,
                                })
                              }
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                              placeholder="john@example.com"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Phone Number *
                          </label>
                          <div className="relative">
                            <Phone
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              size={20}
                            />
                            <input
                              type="tel"
                              value={shipping.phone}
                              onChange={(e) =>
                                setShipping({
                                  ...shipping,
                                  phone: e.target.value,
                                })
                              }
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                              placeholder="+91 98765 43210"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Address */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Street Address *
                        </label>
                        <div className="relative">
                          <Home
                            className="absolute left-3 top-4 text-gray-400"
                            size={20}
                          />
                          <textarea
                            value={shipping.address}
                            onChange={(e) =>
                              setShipping({
                                ...shipping,
                                address: e.target.value,
                              })
                            }
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                            rows={3}
                            placeholder="Flat No, Building Name, Street Area"
                          />
                        </div>
                      </div>

                      {/* City, State, ZIP */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            City *
                          </label>
                          <input
                            type="text"
                            value={shipping.city}
                            onChange={(e) =>
                              setShipping({ ...shipping, city: e.target.value })
                            }
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                            placeholder="Mumbai"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            State *
                          </label>
                          <input
                            type="text"
                            value={shipping.state}
                            onChange={(e) =>
                              setShipping({
                                ...shipping,
                                state: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                            placeholder="Maharashtra"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            ZIP Code *
                          </label>
                          <input
                            type="text"
                            value={shipping.zipCode}
                            onChange={(e) =>
                              setShipping({
                                ...shipping,
                                zipCode: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                            placeholder="400001"
                          />
                        </div>
                      </div>

                      {/* Country */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Country *
                        </label>
                        <div className="relative">
                          <MapPin
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={20}
                          />
                          <select
                            value={shipping.country}
                            onChange={(e) =>
                              setShipping({
                                ...shipping,
                                country: e.target.value,
                              })
                            }
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none bg-gray-50 focus:bg-white transition-all"
                          >
                            <option>India</option>
                            <option>United States</option>
                            <option>Canada</option>
                            <option>United Kingdom</option>
                            <option>Australia</option>
                            <option>Germany</option>
                            <option>France</option>
                            <option>Japan</option>
                            <option>Singapore</option>
                            <option>UAE</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Payment Information */}
                {currentStep === 2 && (
                  <div className="animate-fade-in">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3 pb-6 border-b border-gray-100">
                      <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                        <CreditCard size={28} />
                      </div>
                      Payment Information
                    </h2>

                    {/* Payment Method Selection */}
                    <div className="mb-8">
                      <label className="block text-sm font-semibold text-gray-700 mb-4">
                        Select Payment Method
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                          onClick={() =>
                            setPayment({ ...payment, type: "card" })
                          }
                          className={`p-4 border-2 rounded-xl transition-all flex flex-col items-center justify-center gap-3 h-32 ${
                            payment.type === "card"
                              ? "border-amber-500 bg-amber-50 shadow-md"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <CreditCard className={`w-8 h-8 ${payment.type === 'card' ? 'text-amber-600' : 'text-gray-400'}`} />
                          <span className={`font-semibold ${payment.type === 'card' ? 'text-amber-900' : 'text-gray-600'}`}>Credit/Debit Card</span>
                        </button>

                        <button
                          onClick={() =>
                            setPayment({ ...payment, type: "paypal" })
                          }
                          className={`p-4 border-2 rounded-xl transition-all flex flex-col items-center justify-center gap-3 h-32 ${
                            payment.type === "paypal"
                              ? "border-blue-500 bg-blue-50 shadow-md"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <div className="text-blue-600 font-bold text-2xl italic">PayPal</div>
                          <span className={`font-semibold ${payment.type === 'paypal' ? 'text-blue-900' : 'text-gray-600'}`}>PayPal</span>
                        </button>

                        <button
                          onClick={() =>
                            setPayment({ ...payment, type: "cod" })
                          }
                          className={`p-4 border-2 rounded-xl transition-all flex flex-col items-center justify-center gap-3 h-32 ${
                            payment.type === "cod"
                              ? "border-green-500 bg-green-50 shadow-md"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <ShoppingBag className={`w-8 h-8 ${payment.type === 'cod' ? 'text-green-600' : 'text-gray-400'}`} />
                          <span className={`font-semibold ${payment.type === 'cod' ? 'text-green-900' : 'text-gray-600'}`}>Cash on Delivery</span>
                        </button>
                      </div>
                    </div>

                    {/* Card Payment Form */}
                    {payment.type === "card" && (
                      <div className="space-y-6 animate-slide-up">
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl text-white mb-6 shadow-xl">
                          <div className="flex justify-between items-center mb-8">
                            <CreditCard className="text-white opacity-80" size={32} />
                            <div className="flex gap-2">
                                <div className="w-8 h-5 bg-white/20 rounded"></div>
                                <div className="w-8 h-5 bg-white/20 rounded"></div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="text-2xl tracking-widest font-mono">
                                {payment.cardNumber || '0000 0000 0000 0000'}
                            </div>
                            <div className="flex justify-between">
                                <div>
                                    <div className="text-xs opacity-70 mb-1">Card Holder</div>
                                    <div className="font-medium uppercase">{payment.cardName || 'YOUR NAME'}</div>
                                </div>
                                <div>
                                    <div className="text-xs opacity-70 mb-1">Expires</div>
                                    <div className="font-medium">{payment.expiryDate || 'MM/YY'}</div>
                                </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Card Number *
                          </label>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                              type="text"
                              value={payment.cardNumber}
                              onChange={(e) =>
                                setPayment({
                                  ...payment,
                                  cardNumber: formatCardNumber(e.target.value),
                                })
                              }
                              maxLength={19}
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all font-mono"
                              placeholder="0000 0000 0000 0000"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Cardholder Name *
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                              type="text"
                              value={payment.cardName}
                              onChange={(e) =>
                                setPayment({
                                  ...payment,
                                  cardName: e.target.value,
                                })
                              }
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all uppercase"
                              placeholder="JOHN DOE"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Expiry Date *
                            </label>
                            <input
                              type="text"
                              value={payment.expiryDate}
                              onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, "");
                                if (value.length >= 2) {
                                  value =
                                    value.slice(0, 2) + "/" + value.slice(2, 4);
                                }
                                setPayment({ ...payment, expiryDate: value });
                              }}
                              maxLength={5}
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all text-center"
                              placeholder="MM/YY"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              CVV *
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                type="text"
                                value={payment.cvv}
                                onChange={(e) =>
                                    setPayment({
                                    ...payment,
                                    cvv: e.target.value
                                        .replace(/\D/g, "")
                                        .slice(0, 3),
                                    })
                                }
                                maxLength={3}
                                className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all text-center"
                                placeholder="123"
                                />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg text-sm text-gray-600 border border-gray-100">
                            <ShieldCheck className="text-green-600 flex-shrink-0" size={20} />
                            <p>Your payment details are securely encrypted via 256-bit SSL protection.</p>
                        </div>
                      </div>
                    )}

                    {/* PayPal Message */}
                    {payment.type === "paypal" && (
                      <div className="p-8 bg-blue-50 rounded-xl text-center border border-blue-100 animate-fade-in">
                        <div className="text-blue-600 font-bold text-3xl mb-4 italic">
                          PayPal
                        </div>
                        <p className="text-gray-700 mb-6 text-lg">
                          You will be redirected to PayPal to complete your purchase securely.
                        </p>
                        <button className="bg-[#0070ba] text-white px-8 py-3 rounded-full font-bold hover:bg-[#003087] transition-colors shadow-lg inline-flex items-center gap-2">
                            Proceed to PayPal <ArrowRight size={18} />
                        </button>
                      </div>
                    )}

                    {/* Cash on Delivery Message */}
                    {payment.type === "cod" && (
                      <div className="p-8 bg-green-50 rounded-xl border border-green-100 animate-fade-in">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-100 rounded-full text-green-600">
                                <ShoppingBag size={24} />
                            </div>
                            <h3 className="font-bold text-xl text-gray-900">
                            Cash on Delivery
                            </h3>
                        </div>
                        <p className="text-gray-700 mb-6 text-lg">
                          Pay with cash when your order is delivered to your
                          doorstep. Simple and secure.
                        </p>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                                <CheckCircle className="text-green-500 mb-2" size={24} />
                                <h4 className="font-semibold text-gray-900 mb-1">No Advance Payment</h4>
                                <p className="text-xs text-gray-500">Pay only upon receipt</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                                <Truck className="text-green-500 mb-2" size={24} />
                                <h4 className="font-semibold text-gray-900 mb-1">Fast Delivery</h4>
                                <p className="text-xs text-gray-500">Priority shipping included</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                                <ShieldCheck className="text-green-500 mb-2" size={24} />
                                <h4 className="font-semibold text-gray-900 mb-1">Safe & Secure</h4>
                                <p className="text-xs text-gray-500">Zero risk transaction</p>
                            </div>
                        </div>
                      </div>
                    )}

                    {/* Terms and Conditions */}
                    <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <div className="relative flex items-center">
                            <input
                            type="checkbox"
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                            className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 bg-white checked:bg-amber-500 checked:border-amber-500 transition-all"
                            />
                             <CheckCircle className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" size={14} />
                        </div>
                        <span className="text-sm text-gray-600 leading-relaxed">
                          I agree to the{" "}
                          <a
                            href="#"
                            className="text-amber-600 hover:text-amber-700 font-semibold underline decoration-amber-200 underline-offset-2"
                          >
                            Terms and Conditions
                          </a>{" "}
                          and{" "}
                          <a
                            href="#"
                            className="text-amber-600 hover:text-amber-700 font-semibold underline decoration-amber-200 underline-offset-2"
                          >
                            Privacy Policy
                          </a>. I acknowledge that my data will be used to process my order.
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Step 3: Review Order */}
                {currentStep === 3 && (
                  <div className="animate-fade-in">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3 pb-6 border-b border-gray-100">
                      <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                        <CheckCircle size={28} />
                      </div>
                      Review Your Order
                    </h2>

                    {/* Shipping Details */}
                    <div className="mb-8 bg-gray-50 rounded-xl p-6 border border-gray-200 relative group">
                        <button
                        onClick={() => setCurrentStep(1)}
                        className="absolute top-6 right-6 text-amber-600 hover:text-amber-700 font-semibold text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                        Edit <ArrowRight size={14} />
                        </button>
                      <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                        <Truck size={20} className="text-gray-500" />
                        Shipping Address
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <p className="font-semibold text-gray-900">{shipping.fullName}</p>
                            <p className="text-gray-600">{shipping.address}</p>
                            <p className="text-gray-600">
                            {shipping.city}, {shipping.state} - {shipping.zipCode}
                            </p>
                            <p className="text-gray-600 font-medium">{shipping.country}</p>
                        </div>
                        <div className="space-y-1 border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Mail size={16} /> {shipping.email}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Phone size={16} /> {shipping.phone}
                            </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="mb-8 bg-gray-50 rounded-xl p-6 border border-gray-200 relative group">
                        <button
                        onClick={() => setCurrentStep(2)}
                        className="absolute top-6 right-6 text-amber-600 hover:text-amber-700 font-semibold text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                        Change <ArrowRight size={14} />
                        </button>
                      <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                        <CreditCard size={20} className="text-gray-500" />
                        Payment Method
                      </h3>
                      <div className="flex items-center gap-4">
                        {payment.type === "card" && (
                            <>
                                <div className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center">
                                    <div className="w-8 h-5 bg-gray-800 rounded-sm"></div>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Credit Card</p>
                                    <p className="text-sm text-gray-500">Ending in •••• {payment.cardNumber?.slice(-4)}</p>
                                </div>
                            </>
                        )}
                        {payment.type === "paypal" && (
                           <>
                                <div className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center text-blue-600 font-bold italic text-xs">
                                    PayPal
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">PayPal</p>
                                    <p className="text-sm text-gray-500">Secure online payment</p>
                                </div>
                           </>
                        )}
                        {payment.type === "cod" && (
                            <>
                                <div className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center text-green-600">
                                    <ShoppingBag size={16} />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Cash on Delivery</p>
                                    <p className="text-sm text-gray-500">Pay upon receipt</p>
                                </div>
                            </>
                        )}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-8">
                      <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                        <ShoppingBag size={20} className="text-gray-500" />
                        Order Items <span className="text-gray-400 text-base font-normal">({cart.length} items)</span>
                      </h3>
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <div
                            key={item.id}
                            className="flex gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition-shadow"
                          >
                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                                <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                              <h4 className="font-bold text-gray-900 text-lg">
                                {item.name}
                              </h4>
                              <p className="text-sm text-gray-500 mt-1">
                                Qty: <span className="font-semibold text-gray-900">{item.quantity}</span>
                              </p>
                            </div>
                            <div className="text-right flex flex-col justify-center">
                              <p className="font-bold text-gray-900 text-lg">
                                ₹ {(item.price * item.quantity).toFixed(2)}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                ₹ {item.price.toFixed(2)} / each
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-10 pt-8 border-t border-gray-100">
                  {currentStep > 1 ? (
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 font-semibold transition-colors"
                    >
                      <ArrowLeft size={20} />
                      Back
                    </button>
                  ) : (
                    <a
                      href="/shop"
                      className="text-gray-600 hover:text-amber-600 font-semibold flex items-center gap-2 transition-colors"
                    >
                      <ArrowLeft size={20} /> Continue Shopping
                    </a>
                  )}

                  {currentStep < 3 ? (
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-2 px-10 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Continue to {currentStep === 1 ? 'Payment' : 'Review'}
                      <ArrowRight size={20} />
                    </button>
                  ) : (
                    <button
                      onClick={handlePlaceOrder}
                      disabled={!agreedToTerms || isPlacingOrder}
                      className="flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:shadow-green-200 hover:shadow-xl transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transform hover:-translate-y-0.5 text-lg"
                    >
                      {isPlacingOrder ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Processing...
                          </>
                      ) : (
                          <>
                            <Lock size={20} />
                            Confirm & Pay ₹ {finalTotal.toFixed(2)}
                          </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-24 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                  Order Summary
                </h3>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cart.length} items)</span>
                    <span className="font-semibold text-gray-900">
                      ₹ {cartSubtotal.toFixed(2)}
                    </span>
                  </div>

                  {appliedDiscount && (
                    <div className="flex justify-between text-green-600 bg-green-50 p-2 rounded-lg">
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-green-200 flex items-center justify-center text-[10px] font-bold">
                            %
                        </div>
                        Discount ({(appliedDiscount.discount * 100).toFixed(0)}%)
                      </span>
                      <span className="font-bold">
                        -₹ {discountAmount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold text-gray-900">
                      {shippingCost === 0 ? (
                        <span className="text-green-600 font-bold tracking-wide">FREE</span>
                      ) : (
                        `₹ ${shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  {cartSubtotal < 5000 && shippingCost > 0 && (
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                        <div className="text-amber-500 mt-0.5">
                            <ShoppingBag size={18} />
                        </div>
                      <p className="text-xs text-amber-800 leading-relaxed">
                        Add <span className="font-bold">₹ {(5000 - cartSubtotal).toFixed(2)}</span> more to your cart to unlock <span className="font-bold">FREE Express Shipping!</span>
                      </p>
                    </div>
                  )}

                  <div className="pt-6 border-t border-gray-100 mt-2">
                    <div className="flex justify-between items-end">
                      <span className="text-lg font-bold text-gray-700">
                        Total Amount
                      </span>
                      <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        ₹ {finalTotal.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-right text-xs text-gray-400 mt-1">
                        Including GST
                    </p>
                  </div>
                </div>

                {/* Security Badges */}
                <div className="space-y-4 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="p-1.5 bg-green-50 rounded-full text-green-600">
                        <Lock size={14} />
                    </div>
                    <span>Secure SSL Encrypted Payment</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="p-1.5 bg-green-50 rounded-full text-green-600">
                        <CheckCircle size={14} />
                    </div>
                    <span>100% Money Back Guarantee</span>
                  </div>
                </div>

                {/* Payment Methods Accepted */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 text-center uppercase tracking-widest mb-4">
                    Secure Payment Partners
                  </p>
                  <div className="flex items-center justify-center gap-2 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
                    {/* Replaced div badges with Visa/Mastercard/etc placeholders or SVGs if available. 
                        Using text/styled divs for now to keep it clean without external assets */}
                    <div className="h-8 px-2 bg-white border border-gray-200 rounded flex items-center font-bold text-blue-800 italic text-xs">VISA</div>
                    <div className="h-8 px-2 bg-white border border-gray-200 rounded flex items-center font-bold text-red-600 text-xs">MasterCard</div>
                    <div className="h-8 px-2 bg-white border border-gray-200 rounded flex items-center font-bold text-blue-500 text-xs">Amex</div>
                    <div className="h-8 px-2 bg-white border border-gray-200 rounded flex items-center font-bold text-indigo-800 text-xs">RuPay</div>
                    <div className="h-8 px-2 bg-white border border-gray-200 rounded flex items-center font-bold text-gray-800 text-xs">UPI</div>
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
