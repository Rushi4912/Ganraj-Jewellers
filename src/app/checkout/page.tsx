"use client";
import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { ShippingAddress, PaymentMethod } from "../types/product";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useRouter } from "next/navigation";
import LoadingSpinner from '../components/ui/LoadingSpinner';
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

  // Shipping Information
  const [shipping, setShipping] = useState<ShippingAddress>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
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
  const shippingCost = cartSubtotal > 100 ? 0 : 15;
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

// Show loading state while checking
// if (!isClient) {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
//       <div className="text-center">
//         <div className="relative">
//           {/* Outer spinning ring */}
//           <div className="w-20 h-20 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-6"></div>
//           {/* Inner pulsing circle */}
//           <div className="absolute inset-0 flex items-center justify-center">
//             <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-pulse"></div>
//           </div>
//         </div>
//         <h3 className="text-xl font-bold text-gray-800 mb-2">Loading Your Cart</h3>
//         <p className="text-gray-600">Getting your items ready...</p>
//       </div>
//     </div>
//   );
// }
  
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

  const handlePlaceOrder = () => {
    if (!validatePayment()) return;

    // Simulate order placement
    toast.success("Order placed successfully!");
    clearCart();

    // Redirect to order confirmation (we'll create this later)
    setTimeout(() => {
      router.push("/");
    }, 2000);
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
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 border-amber-500 text-white"
                          : "bg-white border-gray-300 text-gray-400"
                      }`}
                    >
                      <step.icon size={24} />
                    </div>
                    <span
                      className={`mt-2 text-sm font-semibold ${
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
                      className={`w-24 h-1 mx-4 mb-8 transition-all ${
                        currentStep > step.number
                          ? "bg-amber-500"
                          : "bg-gray-300"
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
              <div className="bg-white rounded-2xl shadow-lg p-8">
                {/* Step 1: Shipping Information */}
                {currentStep === 1 && (
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <Truck className="text-amber-600" size={32} />
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
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                              placeholder="+1 (555) 000-0000"
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
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            rows={3}
                            placeholder="123 Main Street, Apartment 4B"
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            placeholder="New York"
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            placeholder="NY"
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            placeholder="10001"
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
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none bg-white"
                          >
                            <option>United States</option>
                            <option>Canada</option>
                            <option>United Kingdom</option>
                            <option>Australia</option>
                            <option>Germany</option>
                            <option>France</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Payment Information */}
                {currentStep === 2 && (
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <CreditCard className="text-amber-600" size={32} />
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
                          className={`p-4 border-2 rounded-lg transition-all ${
                            payment.type === "card"
                              ? "border-amber-500 bg-amber-50"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <CreditCard className="mx-auto mb-2" size={32} />
                          <span className="font-semibold">Credit Card</span>
                        </button>

                        <button
                          onClick={() =>
                            setPayment({ ...payment, type: "paypal" })
                          }
                          className={`p-4 border-2 rounded-lg transition-all ${
                            payment.type === "paypal"
                              ? "border-amber-500 bg-amber-50"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <div className="text-blue-600 font-bold text-2xl mb-2">
                            PayPal
                          </div>
                          <span className="font-semibold text-sm">PayPal</span>
                        </button>

                        <button
                          onClick={() =>
                            setPayment({ ...payment, type: "cod" })
                          }
                          className={`p-4 border-2 rounded-lg transition-all ${
                            payment.type === "cod"
                              ? "border-amber-500 bg-amber-50"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <ShoppingBag className="mx-auto mb-2" size={32} />
                          <span className="font-semibold text-sm">
                            Cash on Delivery
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Card Payment Form */}
                    {payment.type === "card" && (
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Card Number *
                          </label>
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Cardholder Name *
                          </label>
                          <input
                            type="text"
                            value={payment.cardName}
                            onChange={(e) =>
                              setPayment({
                                ...payment,
                                cardName: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            placeholder="JOHN DOE"
                          />
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
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                              placeholder="MM/YY"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              CVV *
                            </label>
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
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                              placeholder="123"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg">
                          <Lock className="text-blue-600" size={20} />
                          <p className="text-sm text-blue-800">
                            Your payment information is encrypted and secure
                          </p>
                        </div>
                      </div>
                    )}

                    {/* PayPal Message */}
                    {payment.type === "paypal" && (
                      <div className="p-8 bg-blue-50 rounded-lg text-center">
                        <div className="text-blue-600 font-bold text-3xl mb-4">
                          PayPal
                        </div>
                        <p className="text-gray-700 mb-4">
                          You will be redirected to PayPal to complete your
                          purchase securely.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                          <Lock size={16} />
                          <span>Secure payment via PayPal</span>
                        </div>
                      </div>
                    )}

                    {/* Cash on Delivery Message */}
                    {payment.type === "cod" && (
                      <div className="p-8 bg-amber-50 rounded-lg">
                        <h3 className="font-bold text-lg text-gray-900 mb-3">
                          Cash on Delivery
                        </h3>
                        <p className="text-gray-700 mb-4">
                          Pay with cash when your order is delivered to your
                          doorstep.
                        </p>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li className="flex items-center gap-2">
                            <CheckCircle size={16} className="text-green-600" />
                            No online payment required
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle size={16} className="text-green-600" />
                            Pay only after receiving your order
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle size={16} className="text-green-600" />
                            Additional verification may be required
                          </li>
                        </ul>
                      </div>
                    )}

                    {/* Terms and Conditions */}
                    <div className="mt-8">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreedToTerms}
                          onChange={(e) => setAgreedToTerms(e.target.checked)}
                          className="mt-1 w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                        />
                        <span className="text-sm text-gray-700">
                          I agree to the{" "}
                          <a
                            href="#"
                            className="text-amber-600 hover:text-amber-700 font-semibold"
                          >
                            Terms and Conditions
                          </a>{" "}
                          and{" "}
                          <a
                            href="#"
                            className="text-amber-600 hover:text-amber-700 font-semibold"
                          >
                            Privacy Policy
                          </a>
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Step 3: Review Order */}
                {currentStep === 3 && (
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <CheckCircle className="text-amber-600" size={32} />
                      Review Your Order
                    </h2>

                    {/* Shipping Details */}
                    <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                      <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                        <Truck size={20} />
                        Shipping Address
                      </h3>
                      <div className="text-gray-700 space-y-1">
                        <p className="font-semibold">{shipping.fullName}</p>
                        <p>{shipping.address}</p>
                        <p>
                          {shipping.city}, {shipping.state} {shipping.zipCode}
                        </p>
                        <p>{shipping.country}</p>
                        <p className="pt-2">{shipping.email}</p>
                        <p>{shipping.phone}</p>
                      </div>
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="mt-4 text-amber-600 hover:text-amber-700 font-semibold text-sm"
                      >
                        Edit Address
                      </button>
                    </div>

                    {/* Payment Details */}
                    <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                      <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                        <CreditCard size={20} />
                        Payment Method
                      </h3>
                      <div className="text-gray-700">
                        {payment.type === "card" && (
                          <p>
                            Credit Card ending in{" "}
                            <span className="font-semibold">
                              {payment.cardNumber?.slice(-4)}
                            </span>
                          </p>
                        )}
                        {payment.type === "paypal" && (
                          <p className="font-semibold">PayPal</p>
                        )}
                        {payment.type === "cod" && (
                          <p className="font-semibold">Cash on Delivery</p>
                        )}
                      </div>
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="mt-4 text-amber-600 hover:text-amber-700 font-semibold text-sm"
                      >
                        Change Payment Method
                      </button>
                    </div>

                    {/* Order Items */}
                    <div className="mb-8">
                      <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                        <ShoppingBag size={20} />
                        Order Items ({cart.length})
                      </h3>
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <div
                            key={item.id}
                            className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">
                                {item.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-600">
                                ${item.price.toFixed(2)} each
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-8 pt-8 border-t">
                  {currentStep > 1 ? (
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 font-semibold transition-all"
                    >
                      <ArrowLeft size={20} />
                      Back
                    </button>
                  ) : (
                    <a
                      href="/shop"
                      className="text-gray-600 hover:text-gray-900 font-semibold"
                    >
                      ← Continue Shopping
                    </a>
                  )}

                  {currentStep < 3 ? (
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:shadow-xl transition-all duration-300 font-bold"
                    >
                      Continue
                      <ArrowRight size={20} />
                    </button>
                  ) : (
                    <button
                      onClick={handlePlaceOrder}
                      disabled={!agreedToTerms}
                      className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-xl transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Lock size={20} />
                      Place Order
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal ({cart.length} items)</span>
                    <span className="font-semibold">
                      ${cartSubtotal.toFixed(2)}
                    </span>
                  </div>

                  {appliedDiscount && (
                    <div className="flex justify-between text-green-600">
                      <span>
                        Discount ({(appliedDiscount.discount * 100).toFixed(0)}
                        %)
                      </span>
                      <span className="font-semibold">
                        -${discountAmount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="font-semibold">
                      {shippingCost === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `$${shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  {cartSubtotal < 100 && shippingCost > 0 && (
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <p className="text-xs text-amber-700">
                        Add ${(100 - cartSubtotal).toFixed(2)} more for FREE
                        shipping!
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">
                        Total
                      </span>
                      <span className="text-2xl font-bold text-amber-600">
                        ${finalTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Security Badges */}
                <div className="space-y-3 pt-6 border-t">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Lock size={16} className="text-green-600" />
                    <span>Secure SSL Encrypted Payment</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle size={16} className="text-green-600" />
                    <span>30-Day Money Back Guarantee</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Truck size={16} className="text-green-600" />
                    <span>Free Returns & Exchanges</span>
                  </div>
                </div>

                {/* Payment Methods Accepted */}
                <div className="mt-6 pt-6 border-t">
                  <p className="text-xs text-gray-500 text-center mb-3">
                    We Accept
                  </p>
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    <div className="px-3 py-2 bg-gray-100 rounded text-xs font-semibold text-gray-700">
                      VISA
                    </div>
                    <div className="px-3 py-2 bg-gray-100 rounded text-xs font-semibold text-gray-700">
                      MASTERCARD
                    </div>
                    <div className="px-3 py-2 bg-gray-100 rounded text-xs font-semibold text-gray-700">
                      AMEX
                    </div>
                    <div className="px-3 py-2 bg-gray-100 rounded text-xs font-semibold text-blue-600">
                      PayPal
                    </div>
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
