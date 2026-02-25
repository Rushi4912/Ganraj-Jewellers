"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Shield, ArrowRight, ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center bg-[#F2F0EB] relative px-4">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] bg-gradient-to-b from-[#E5E0D8]/40 to-transparent rounded-full blur-3xl mix-blend-multiply opacity-70"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-gradient-to-t from-[#E5E0D8]/50 to-transparent rounded-full blur-3xl mix-blend-multiply opacity-60"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#6B5D52] hover:text-[#8B7355] transition-colors mb-8 group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Return to Atelier
        </Link>

        <div className="bg-white rounded-3xl shadow-xl shadow-[#C5B4A5]/10 border border-[#E5E0D8] p-8 sm:p-12 overflow-hidden relative">

          {/* Subtle Top Accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#8B7355] to-transparent opacity-60"></div>

          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] text-[#8B7355] mb-5">
              <Sparkles size={20} />
            </div>
            <h1 className="font-display text-3xl text-[#2D2A26] mb-2">Welcome Back</h1>
            <p className="text-[#6B5D52] text-sm">Sign in to your private membership</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#6B5D52] font-semibold pl-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E5E0D8] focus:border-[#8B7355] focus:bg-white focus:ring-4 focus:ring-[#8B7355]/5 rounded-xl px-4 py-3.5 outline-none transition-all text-[#2D2A26] text-sm placeholder:text-[#A89F91]"
                placeholder="registered@email.com"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center pl-1">
                <label className="text-[11px] uppercase tracking-wider text-[#6B5D52] font-semibold">Password</label>
                <Link href="#" className="text-[11px] text-[#8B7355] hover:text-[#2D2A26] font-medium transition-colors">Forgot Password?</Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E5E0D8] focus:border-[#8B7355] focus:bg-white focus:ring-4 focus:ring-[#8B7355]/5 rounded-xl px-4 py-3.5 outline-none transition-all text-[#2D2A26] text-sm placeholder:text-[#A89F91]"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="text-red-600 text-[13px] bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex items-center gap-2 animate-fadeInUp">
                <Shield size={14} className="shrink-0" />
                <p className="leading-tight">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2D2A26] text-white py-3.5 rounded-xl text-sm font-medium hover:bg-[#8B7355] hover:shadow-lg hover:shadow-[#8B7355]/20 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? "Authenticating..." : "Sign In"}
              {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 text-center bg-[#FAF8F5] -mx-8 sm:-mx-12 -mb-8 sm:-mb-12 p-6 border-t border-[#E5E0D8]">
            <p className="text-[#6B5D52] text-xs">
              Not a member yet?{" "}
              <Link href="/signup" className="text-[#8B7355] font-semibold hover:text-[#2D2A26] transition-colors relative inline-block group">
                Request Access
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#2D2A26] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}