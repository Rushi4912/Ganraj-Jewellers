"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";
import { Crown, Gem, Lock, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/login`
          : undefined;

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo,
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(
          "Welcome to the atelier. Confirm the link we sent to your email to activate access."
        );
      }
    } catch (err) {
      setError("An unexpected error occurred during signup.");
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
            src="https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=1200&q=80"
            alt="Craftsmanship"
            fill
            className="object-cover opacity-50 mix-blend-overlay"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2D2A26] via-[#2D2A26]/40 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-lg text-[#F2F0EB]">
          <div className="inline-flex items-center gap-2 mb-6 border border-[#8B7355] text-[#8B7355] px-4 py-2 rounded-full uppercase tracking-[0.2em] text-xs">
            <Crown size={14} />
            Private Membership
          </div>
          <h1 className="font-display text-5xl lg:text-6xl mb-6 leading-tight">
            Craft your <br />
            <span className="italic text-[#8B7355]">legacy story.</span>
          </h1>
          <p className="text-[#F2F0EB]/70 text-lg leading-relaxed mb-10">
            Unlock order histories, atelier alerts, and a personalized address book across our luxury ecosystem.
          </p>

          <div className="space-y-4">
            {[
              "Priority previews & limited drops",
              "Saved measurements & preferences",
              "Seamless checkout with encrypted data",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm font-medium text-[#F2F0EB]/90">
                <CheckCircle2 size={18} className="text-[#8B7355]" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= RIGHT: FORM ================= */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-20 relative overflow-y-auto">
        <Link href="/" className="absolute top-8 left-8 text-[#6B5D52] hover:text-[#2D2A26] transition-colors flex items-center gap-2 text-sm font-medium uppercase tracking-wider">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="max-w-md mx-auto w-full mt-10 lg:mt-0">
          <div className="mb-10 text-center lg:text-left">
            <span className="text-[#8B7355] text-xs font-bold tracking-[0.2em] uppercase block mb-3">
              Join the Atelier
            </span>
            <h2 className="font-display text-4xl text-[#2D2A26]">Create your account</h2>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-[#6B5D52] font-semibold">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-[#C5B4A5]/50 focus:border-[#8B7355] rounded-xl px-4 py-4 outline-none transition-colors text-[#2D2A26]"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-[#6B5D52] font-semibold">Confirm</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white border border-[#C5B4A5]/50 focus:border-[#8B7355] rounded-xl px-4 py-4 outline-none transition-colors text-[#2D2A26]"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg px-4 py-3 flex items-center gap-2">
                <Lock size={14} />
                {error}
              </div>
            )}

            {success && (
              <div className="text-green-600 text-sm bg-green-50 border border-green-100 rounded-lg px-4 py-3 flex items-center gap-2">
                <CheckCircle2 size={14} />
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2D2A26] text-white py-4 rounded-xl font-medium hover:bg-[#8B7355] transition-colors duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Join Membership"}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="mt-10 text-center text-[#6B5D52] text-sm">
            Already a member?{" "}
            <Link href="/login" className="text-[#8B7355] font-semibold hover:text-[#2D2A26] transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
