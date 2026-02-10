"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Shield, Star, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else if (data.user) {
        router.push("/account");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F2F0EB]">

      {/* ================= LEFT: IMAGE ================= */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#2D2A26] items-center justify-center p-12">

        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1200&q=80"
            alt="Atelier"
            fill
            className="object-cover opacity-60 mix-blend-overlay"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2D2A26] via-transparent to-transparent opacity-90"></div>
        </div>

        <div className="relative z-10 max-w-lg text-[#F2F0EB]">
          <div className="inline-flex items-center gap-2 mb-6 border border-[#8B7355] text-[#8B7355] px-4 py-2 rounded-full uppercase tracking-[0.2em] text-xs">
            <Sparkles size={14} />
            Atelier Access
          </div>
          <h1 className="font-display text-5xl lg:text-6xl mb-6 leading-tight">
            Return to <br />
            <span className="italic text-[#8B7355]">exclusivity.</span>
          </h1>
          <p className="text-[#F2F0EB]/70 text-lg leading-relaxed mb-10">
            Your personal portal to curated collections, bespoke commissions, and priority support.
          </p>

          <div className="space-y-4">
            {[
              { icon: Star, text: "Early access to new collections" },
              { icon: Shield, text: "Secure, encrypted profile" },
              { icon: Lock, text: "Private wishlist & history" },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-sm font-medium text-[#F2F0EB]/90">
                <feature.icon size={18} className="text-[#8B7355]" />
                {feature.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= RIGHT: FORM ================= */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-20 relative">
        <Link href="/" className="absolute top-8 left-8 text-[#6B5D52] hover:text-[#2D2A26] transition-colors flex items-center gap-2 text-sm font-medium uppercase tracking-wider">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="max-w-md mx-auto w-full">
          <div className="mb-10 text-center lg:text-left">
            <span className="text-[#8B7355] text-xs font-bold tracking-[0.2em] uppercase block mb-3">
              Welcome Back
            </span>
            <h2 className="font-display text-4xl text-[#2D2A26]">Sign in to your account</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-[#6B5D52] font-semibold">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-[#C5B4A5]/50 focus:border-[#8B7355] rounded-xl px-4 py-4 outline-none transition-colors text-[#2D2A26]"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs uppercase tracking-wider text-[#6B5D52] font-semibold">Password</label>
                <a href="#" className="text-xs text-[#8B7355] hover:text-[#2D2A26] transition-colors">Forgot Password?</a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-[#C5B4A5]/50 focus:border-[#8B7355] rounded-xl px-4 py-4 outline-none transition-colors text-[#2D2A26]"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg px-4 py-3 flex items-center gap-2">
                <Shield size={14} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2D2A26] text-white py-4 rounded-xl font-medium hover:bg-[#8B7355] transition-colors duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Enter Atelier"}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="mt-10 text-center text-[#6B5D52] text-sm">
            Not a member yet?{" "}
            <Link href="/signup" className="text-[#8B7355] font-semibold hover:text-[#2D2A26] transition-colors">
              Request Access
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}