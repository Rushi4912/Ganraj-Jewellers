"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";
import { Crown, Gem, Lock, CheckCircle2 } from "lucide-react";

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
    <section className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16 grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
        {/* Hide the full hero on mobile to shorten scroll */}
        <div className="space-y-6 hidden lg:block">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full uppercase tracking-[0.4em] text-xs">
            <Crown size={16} />
            Private membership
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Craft your{" "}
            <span className="text-amber-500">Ganraj Jewellers story.</span>
          </h1>
          <p className="text-gray-600 text-lg">
            A single login unlocks order histories, atelier alerts, curated
            styling narratives, and a personalized address book across our
            luxury ecosystem.
          </p>
          <div className="space-y-3">
            {[
              "Priority previews & limited capsule drops",
              "Saved measurements and preferred shipping",
              "Seamless checkout with encrypted credentials",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-gray-700">
                <CheckCircle2 className="text-amber-500" size={20} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[28px] lg:rounded-[32px] shadow-2xl p-6 sm:p-8 lg:p-10 border border-amber-100">
          <div className="text-center space-y-2 mb-6 lg:mb-8">
            <Gem className="mx-auto text-amber-500" size={32} />
            <p className="text-sm uppercase tracking-[0.35em] text-gray-400">
              Join the atelier
            </p>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Create your account
            </h2>
            <p className="text-gray-500">
              We’ll send a verification link to secure your access.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Confirm password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-2xl px-4 py-2">
                {error}
              </p>
            )}
            {success && (
              <p className="text-sm text-green-600 bg-green-50 border border-green-100 rounded-2xl px-4 py-2">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-2xl font-semibold shadow-lg shadow-amber-500/30 disabled:opacity-50"
            >
              {loading ? "Sending invite..." : "Create account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
            <Lock size={14} />
            Verification emails arrive within a minute. Check spam if missing.
          </div>

          <p className="text-center text-gray-600 mt-8">
            Already part of the atelier?{" "}
            <Link href="/login" className="text-amber-600 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
