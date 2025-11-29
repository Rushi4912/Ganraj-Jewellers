"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, MessageCircle, Send } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ShoppingCartSidebar from "../components/cart/ShoppingCart";

const contactMethods = [
  {
    icon: Phone,
    title: "WhatsApp & Call Support",
    detail: "Callback window: 10 AM – 8 PM IST",
    subDetail: "Share your number in the form and we ring you back the same day.",
  },
  {
    icon: Mail,
    title: "Email concierge",
    detail: "ganrajjewellers3@gmail.com",
    subDetail: "Detailed replies within 24 hours with sketches, invoices, or tracking.",
  },
  {
    icon: MapPin,
    title: "Pickup & studio visits",
    detail: "By appointment only",
    subDetail: "We prep purity cards and secure packaging before you arrive.",
  },
];

const hours = [
  { day: "Order processing", time: "Within 24 hrs" },
  { day: "Festival QC window", time: "Up to 48 hrs" },
  { day: "Return assistance", time: "15-day coverage" },
];

export default function ContactPage() {
  const [showCart, setShowCart] = useState(false);

  return (
    <>
      <Navbar onCartOpen={() => setShowCart(true)} />
      <main className="bg-gray-50 min-h-screen">
        <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 py-20">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-72 h-72 bg-amber-100 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-200 blur-3xl" />
          </div>
          <div className="relative max-w-4xl mx-auto text-center px-6">
            <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 text-amber-600 font-semibold">
              <MessageCircle size={18} />
              Real humans, real-time updates
            </p>
            <h1 className="mt-6 text-4xl md:text-5xl font-bold text-gray-900">
              Support that follows your order from purity check to doorstep
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Every piece is inspected within 24 hours (48 hours during festivals), packed with purity cards, and tracked
              via WhatsApp, SMS, and email. Reach out anytime for sizing help, order changes, or returns.
            </p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
          <div className="grid md:grid-cols-3 gap-6">
            {contactMethods.map(({ icon: Icon, title, detail, subDetail }) => (
              <div key={title} className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                  <Icon size={22} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <p className="mt-2 text-gray-900 font-medium">{detail}</p>
                <p className="text-sm text-gray-500">{subDetail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-2 gap-10">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <p className="text-sm font-semibold text-amber-600 uppercase tracking-[0.3em]">Write to us</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-4">Tell us what you need—we’ll handle the rest</h2>
            <p className="text-gray-600 mt-2">
              Use the form for custom briefings, tracking questions, returns, or purity clarifications. A stylist replies
              within 24 hours with sketches, quotes, or logistics updates.
            </p>
            <form className="mt-8 space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full name"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <input
                type="text"
                placeholder="Phone number"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <select className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                <option>I’m interested in...</option>
                <option>Custom or ready-to-ship piece</option>
                <option>Shipping or tracking update</option>
                <option>Return / replacement request</option>
                <option>General inquiry</option>
              </select>
              <textarea
                rows={5}
                placeholder="Tell us how we can help..."
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <button
                type="button"
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg shadow-amber-500/30"
              >
                <Send size={18} />
                Send message
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="rounded-3xl bg-white shadow-lg border border-gray-100 p-8">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="text-amber-500" size={20} />
                Service timelines
              </h3>
              <div className="mt-4 space-y-3">
                {hours.map(({ day, time }) => (
                  <div key={day} className="flex justify-between text-gray-600">
                    <span>{day}</span>
                    <span className="font-semibold text-gray-900">{time}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl bg-gradient-to-r from-gray-900 to-gray-800 text-white p-8">
              <p className="text-sm uppercase tracking-[0.4em] text-gray-300">Visit us</p>
              <h3 className="text-2xl font-semibold mt-3">Ganraj Experience Desk</h3>
              <p className="mt-2 text-gray-200">
                Book a slot for pickups, purity verification, engraving, or styling consults. We prepare your pieces,
                documentation, and secure packaging before you arrive.
              </p>
              <button className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-gray-900 font-semibold">
                Request an appointment
              </button>
            </div>
          </div>
        </section>
      </main>
      <ShoppingCartSidebar isOpen={showCart} onClose={() => setShowCart(false)} />
      <Footer />
    </>
  );
}
