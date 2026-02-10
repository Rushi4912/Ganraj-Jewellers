"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, ArrowRight } from "lucide-react";
import Image from "next/image";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ShoppingCartSidebar from "../components/cart/ShoppingCart";

const contactMethods = [
  {
    icon: Phone,
    title: "Call Support",
    detail: "+91 98765 43210",
    subDetail: "10 AM – 8 PM IST",
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

      <main className="bg-[#F2F0EB] min-h-screen">

        {/* ================= HERO / SPLIT LAYOUT ================= */}
        <div className="flex flex-col lg:flex-row min-h-screen">

          {/* LEFT: Info & Visuals */}
          <div className="lg:w-1/2 relative bg-[#2D2A26] text-[#F2F0EB] p-8 lg:p-16 flex flex-col justify-between overflow-hidden">

            {/* Background Effects */}
            <div className="absolute inset-0 z-0 opacity-20">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#8B7355] rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#6B5D52] rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3"></div>
            </div>

            {/* Content */}
            <div className="relative z-10">
              <span className="block text-[#8B7355] text-xs font-bold tracking-[0.2em] uppercase mb-6">
                Get in Touch
              </span>
              <h1 className="font-display text-5xl lg:text-7xl leading-tight mb-8">
                Let's start a <br />
                <span className="italic text-[#8B7355]">conversation.</span>
              </h1>
              <p className="text-[#F2F0EB]/70 text-lg max-w-md leading-relaxed mb-12">
                From custom commissions to care advice, our team is here to guide your journey with Ganraj.
              </p>

              <div className="space-y-8">
                {contactMethods.map((method, idx) => {
                  const Icon = method.icon;
                  return (
                    <div key={idx} className="flex items-start gap-4 group">
                      <div className="w-12 h-12 rounded-full border border-[#8B7355]/30 flex items-center justify-center text-[#8B7355] group-hover:bg-[#8B7355] group-hover:text-white transition-all duration-300">
                        <Icon size={20} />
                      </div>
                      <div>
                        <h3 className="font-display text-xl mb-1">{method.title}</h3>
                        <p className="text-[#F2F0EB]/90 font-medium">{method.detail}</p>
                        <p className="text-[#F2F0EB]/50 text-sm">{method.subDetail}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Bottom Image */}
            <div className="relative z-10 mt-12 lg:mt-0">
              <div className="relative w-full h-64 rounded-[30px] overflow-hidden border border-[#F2F0EB]/10">
                <Image
                  src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80"
                  alt="Studio Interior"
                  fill
                  className="object-cover opacity-80 hover:opacity-100 transition-opacity duration-500"
                  unoptimized
                />
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2">
                  <Clock size={14} className="text-[#8B7355]" />
                  <span className="text-xs text-white">Open 10 AM - 8 PM</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: Form */}
          <div className="lg:w-1/2 bg-[#F2F0EB] p-8 lg:p-16 flex items-center justify-center">
            <div className="w-full max-w-lg">
              <div className="mb-10">
                <h2 className="font-display text-4xl text-[#2D2A26] mb-3">Send a Message</h2>
                <p className="text-[#6B5D52]">We usually reply within 24 hours.</p>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-[#6B5D52] font-semibold">First Name</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-[#C5B4A5]/50 focus:border-[#8B7355] rounded-xl px-4 py-3 outline-none transition-colors text-[#2D2A26]"
                      placeholder="Jane"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-[#6B5D52] font-semibold">Last Name</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-[#C5B4A5]/50 focus:border-[#8B7355] rounded-xl px-4 py-3 outline-none transition-colors text-[#2D2A26]"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-[#6B5D52] font-semibold">Email Address</label>
                  <input
                    type="email"
                    className="w-full bg-white border border-[#C5B4A5]/50 focus:border-[#8B7355] rounded-xl px-4 py-3 outline-none transition-colors text-[#2D2A26]"
                    placeholder="jane@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-[#6B5D52] font-semibold">Subject</label>
                  <select className="w-full bg-white border border-[#C5B4A5]/50 focus:border-[#8B7355] rounded-xl px-4 py-3 outline-none transition-colors text-[#2D2A26] appearance-none">
                    <option>General Inquiry</option>
                    <option>Custom Commission</option>
                    <option>Order Support</option>
                    <option>Book Appointment</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-[#6B5D52] font-semibold">Message</label>
                  <textarea
                    rows={5}
                    className="w-full bg-white border border-[#C5B4A5]/50 focus:border-[#8B7355] rounded-xl px-4 py-3 outline-none transition-colors text-[#2D2A26] resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button
                  type="button"
                  className="w-full bg-[#2D2A26] text-white py-4 rounded-xl font-medium hover:bg-[#8B7355] transition-colors duration-300 flex items-center justify-center gap-2 group"
                >
                  Send Message
                  <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>

      <ShoppingCartSidebar isOpen={showCart} onClose={() => setShowCart(false)} />
      <Footer />
    </>
  );
}
