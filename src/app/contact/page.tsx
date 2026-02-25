"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ShoppingCartSidebar from "../components/cart/ShoppingCart";

const contactMethods = [
  {
    icon: Phone,
    title: "Call Support",
    detail: "+91 98765 43210",
    subDetail: "10 AM \u2013 8 PM IST",
  },
  {
    icon: Mail,
    title: "Email Concierge",
    detail: "ganrajjewellers3@gmail.com",
    subDetail: "Replies within 24 hours.",
  },
  {
    icon: MapPin,
    title: "Studio Visit",
    detail: "Pune, Maharashtra",
    subDetail: "By appointment only.",
  },
];

export default function ContactPage() {
  const [showCart, setShowCart] = useState(false);

  return (
    <>
      <Navbar onCartOpen={() => setShowCart(true)} />

      <main className="bg-[#F2F0EB] min-h-screen py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white border border-[#E5E0D8] text-[#8B7355] mb-6">
              <MessageCircle size={20} />
            </div>
            <span className="block text-[#8B7355] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-4">
              Get in Touch
            </span>
            <h1 className="font-display text-4xl md:text-6xl text-[#2D2A26] leading-tight mb-6">
              Let's start a <br />
              <span className="italic text-[#8B7355]">conversation.</span>
            </h1>
            <p className="text-[#6B5D52] text-sm md:text-base max-w-lg mx-auto leading-relaxed">
              From custom commissions to care advice, our team is here to guide your journey with Ganraj. We usually reply within 24 hours.
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">

            {/* Contact Information */}
            <div className="lg:col-span-5 flex flex-col gap-8 lg:pr-8">
              <h2 className="font-display text-3xl text-[#2D2A26] mb-2">Direct Contact</h2>
              <div className="space-y-6">
                {contactMethods.map((method, idx) => {
                  const Icon = method.icon;
                  return (
                    <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-6 bg-white rounded-2xl border border-[#E5E0D8] group hover:border-[#8B7355]/30 transition-all duration-300">
                      <div className="w-12 h-12 shrink-0 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center text-[#8B7355] group-hover:bg-[#8B7355] group-hover:text-white transition-all duration-300">
                        <Icon size={20} />
                      </div>
                      <div>
                        <h3 className="font-display text-xl text-[#2D2A26] mb-1">{method.title}</h3>
                        <p className="text-[#6B5D52] font-medium text-sm">{method.detail}</p>
                        <p className="text-[#A89F91] text-xs mt-1">{method.subDetail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form Card */}
            <div className="lg:col-span-7 w-full">
              <div className="bg-white rounded-3xl shadow-xl shadow-[#C5B4A5]/10 border border-[#E5E0D8] p-8 sm:p-12 relative overflow-hidden">
                {/* Subtle Top Accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#8B7355] to-transparent opacity-60"></div>

                <div className="mb-8">
                  <h2 className="font-display text-3xl text-[#2D2A26] mb-2">Send a Message</h2>
                  <p className="text-[#6B5D52] text-sm">Fill out the form below and we'll be in touch shortly.</p>
                </div>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase tracking-wider text-[#6B5D52] font-semibold pl-1">First Name</label>
                      <input
                        type="text"
                        className="w-full bg-[#FAF8F5] border border-[#E5E0D8] focus:border-[#8B7355] focus:bg-white focus:ring-4 focus:ring-[#8B7355]/5 rounded-xl px-4 py-3.5 outline-none transition-all text-[#2D2A26] text-sm placeholder:text-[#A89F91]"
                        placeholder="Jane"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase tracking-wider text-[#6B5D52] font-semibold pl-1">Last Name</label>
                      <input
                        type="text"
                        className="w-full bg-[#FAF8F5] border border-[#E5E0D8] focus:border-[#8B7355] focus:bg-white focus:ring-4 focus:ring-[#8B7355]/5 rounded-xl px-4 py-3.5 outline-none transition-all text-[#2D2A26] text-sm placeholder:text-[#A89F91]"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-[#6B5D52] font-semibold pl-1">Email Address</label>
                    <input
                      type="email"
                      className="w-full bg-[#FAF8F5] border border-[#E5E0D8] focus:border-[#8B7355] focus:bg-white focus:ring-4 focus:ring-[#8B7355]/5 rounded-xl px-4 py-3.5 outline-none transition-all text-[#2D2A26] text-sm placeholder:text-[#A89F91]"
                      placeholder="jane@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-[#6B5D52] font-semibold pl-1">Subject</label>
                    <select className="w-full bg-[#FAF8F5] border border-[#E5E0D8] focus:border-[#8B7355] focus:bg-white focus:ring-4 focus:ring-[#8B7355]/5 rounded-xl px-4 py-3.5 outline-none transition-all text-[#2D2A26] text-sm appearance-none cursor-pointer">
                      <option>General Inquiry</option>
                      <option>Custom Commission</option>
                      <option>Order Support</option>
                      <option>Book Appointment</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-[#6B5D52] font-semibold pl-1">Message</label>
                    <textarea
                      rows={5}
                      className="w-full bg-[#FAF8F5] border border-[#E5E0D8] focus:border-[#8B7355] focus:bg-white focus:ring-4 focus:ring-[#8B7355]/5 rounded-xl px-4 py-3.5 outline-none transition-all text-[#2D2A26] text-sm resize-none placeholder:text-[#A89F91]"
                      placeholder="How can we help you?"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="button"
                    className="w-full bg-[#2D2A26] text-white py-4 rounded-xl text-sm font-medium hover:bg-[#8B7355] hover:shadow-lg hover:shadow-[#8B7355]/20 transition-all duration-300 flex items-center justify-center gap-2 group mt-4"
                  >
                    Send Message
                    <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </main>

      <ShoppingCartSidebar isOpen={showCart} onClose={() => setShowCart(false)} />
      <Footer />
    </>
  );
}
