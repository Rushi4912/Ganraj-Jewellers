"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Shield, Star, Lock } from "lucide-react";

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
    <section className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full uppercase tracking-[0.4em] text-xs">
            <Sparkles size={16} />
            Atelier access
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
            Welcome back to the{" "}
            <span className="text-amber-400">Ganraj Jewellers atelier.</span>
          </h1>
          <p className="text-slate-300 text-lg">
            Unlock your saved addresses, curated orders, and bespoke styling
            diaries. Your credentials secure a private gallery curated just for
            you.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-200">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
              <Star className="text-amber-400" size={20} />
              <p className="font-semibold">Priority styling alerts</p>
              <p className="text-slate-400">
                Be first to know about launches & atelier drops.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
              <Shield className="text-amber-400" size={20} />
              <p className="font-semibold">Secure, private access</p>
              <p className="text-slate-400">
                Encrypted sessions keep your details discreet.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/95 text-gray-900 rounded-[32px] shadow-2xl p-8 lg:p-10">
          <div className="text-center space-y-2 mb-8">
            <p className="text-sm uppercase tracking-[0.4em] text-gray-400">
              Sign in
            </p>
            <h2 className="text-3xl font-bold">Enter your atelier portal</h2>
            <p className="text-gray-500">
              Continue with your email and password.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Email
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="mt-2">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="text-right mt-2">
                <a
                  href="https://app.supabase.com/"
                  className="text-sm text-amber-600 hover:text-amber-700 font-semibold"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-2xl px-4 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-2xl font-semibold shadow-lg shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Enter atelier"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
            <Lock size={14} />
            Secure SSL-encrypted authentication
          </div>

          <p className="text-center text-gray-600 mt-8">
            Need an account?{" "}
            <Link href="/signup" className="text-amber-600 font-semibold">
              Request membership
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}