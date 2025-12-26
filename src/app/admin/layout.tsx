"use client";

import { ReactNode, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldAlert, Info, Copy, UserPlus, RefreshCcw, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import Link from "next/link";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, profile, loading, refresh } = useAuth();
  const router = useRouter();
  const [showDebug, setShowDebug] = useState(false);
  const [creatingProfile, setCreatingProfile] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  // Track if we should show the restricted page or keep loading
  const [checkComplete, setCheckComplete] = useState(false);

  useEffect(() => {
    // Give the auth system time to fully load
    if (!loading) {
      const timer = setTimeout(() => {
        setCheckComplete(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const copyUserId = useCallback(async () => {
    if (user?.id) {
      await navigator.clipboard.writeText(user.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [user?.id]);

  const copySqlCommand = useCallback(async () => {
    if (user?.id) {
      const sql = `UPDATE profiles SET role = 'admin' WHERE id = '${user.id}';`;
      await navigator.clipboard.writeText(sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [user?.id]);

  const createProfile = useCallback(async () => {
    if (!user?.id) {
      setCreateError("No user ID found. Please sign in first.");
      return;
    }

    setCreatingProfile(true);
    setCreateError(null);
    setCreateSuccess(false);

    try {
      // First try the API route
      const response = await fetch("/api/profiles/ensure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          email: user.email,
          name: user.email?.split("@")[0] || "",
        }),
      });

      if (response.ok) {
        setCreateSuccess(true);
        setTimeout(() => refresh(), 1500);
        return;
      }

      // Fallback to direct insert if API fails
      const basePayload = {
        id: user.id,
        name: user.email?.split("@")[0] || "",
        role: "customer",
      };

      const legacyPayload = {
        id: user.id,
        full_name: user.email?.split("@")[0] || "",
        role: "customer",
      };

      const attempt = async (payload: Record<string, unknown>) =>
        supabase.from("profiles").upsert(payload).select("*").single();

      let result = await attempt(basePayload);

      // If column doesn't exist, try legacy payload
      if (result.error && result.error.code === "42703") {
        result = await attempt(legacyPayload);
      }

      if (result.error) {
        throw result.error;
      }

      setCreateSuccess(true);
      setTimeout(() => refresh(), 1500);
    } catch (err: unknown) {
      console.error("Profile creation error:", err);
      const message = err instanceof Error ? err.message : "Failed to create profile. Check console for details.";
      setCreateError(message);
    } finally {
      setCreatingProfile(false);
    }
  }, [user?.id, user?.email, refresh]);

  // Show loading state while auth is initializing
  if (loading || !checkComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 text-gray-600">
        <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center">
          <Loader2 className="w-10 h-10 animate-spin mb-4 text-amber-500" />
          <p className="font-medium">Loading admin workspace...</p>
          <p className="text-sm text-gray-400 mt-1">Verifying credentials</p>
        </div>
      </div>
    );
  }

  // Show restricted page if not admin
  if (!user || profile?.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 text-center px-6 py-12">
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Restricted Area</h1>
            <p className="text-gray-600 mb-6">
              {!user
                ? "Please sign in to access the admin panel."
                : "You need administrator privileges to access this area."}
            </p>

            {!user ? (
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors"
              >
                Sign in to continue
              </Link>
            ) : (
              <button
                onClick={() => setShowDebug(!showDebug)}
                className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                <Info size={18} />
                {showDebug ? "Hide" : "Show"} Debug Information
              </button>
            )}
          </div>

          {/* Debug Information */}
          {showDebug && user && (
            <div className="bg-white rounded-3xl shadow-xl p-6 text-left space-y-6">
              {/* Status Section */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Current Status
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Logged in:</span>
                    <span className="font-semibold text-green-600">Yes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Profile exists:</span>
                    <span className={`font-semibold ${profile ? "text-green-600" : "text-red-600"}`}>
                      {profile ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Current role:</span>
                    <span
                      className={`font-semibold ${profile?.role === "admin" ? "text-green-600" : "text-amber-600"}`}
                    >
                      {profile?.role || "customer (default)"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-500">User ID:</span>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-gray-200 px-2 py-1 rounded font-mono">
                        {user.id.slice(0, 12)}...
                      </code>
                      <button
                        onClick={copyUserId}
                        className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Copy full User ID"
                      >
                        <Copy size={14} className={copied ? "text-green-600" : "text-gray-500"} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Create Profile Section */}
              {!profile && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Step 1: Create Profile
                  </h3>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-sm text-gray-700 mb-4">
                      Your profile record is missing. Create one to enable role management:
                    </p>
                    <button
                      onClick={createProfile}
                      disabled={creatingProfile}
                      className="w-full px-4 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                    >
                      {creatingProfile ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating profile...
                        </>
                      ) : (
                        <>
                          <UserPlus size={18} />
                          Create Profile Record
                        </>
                      )}
                    </button>
                    {createError && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm">{createError}</p>
                      </div>
                    )}
                    {createSuccess && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-700 text-sm flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Profile created! Refreshing...
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Grant Admin Access Section */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  {profile ? "Grant Admin Access" : "Step 2: Grant Admin Access"}
                </h3>
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <p className="text-sm text-gray-700 mb-3">
                    Run this SQL command in your{" "}
                    <a
                      href="https://app.supabase.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 underline"
                    >
                      Supabase SQL Editor
                    </a>
                    :
                  </p>
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs overflow-x-auto font-mono">
                      UPDATE profiles SET role = &apos;admin&apos; WHERE id = &apos;{user.id}&apos;;
                    </pre>
                    <button
                      onClick={copySqlCommand}
                      className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                      title="Copy SQL"
                    >
                      <Copy size={14} className={copied ? "text-green-400" : "text-gray-300"} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Or go to Table Editor → profiles → Find your row → Set role to &quot;admin&quot;
                  </p>
                </div>
              </div>

              {/* Refresh Section */}
              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={() => refresh()}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
                >
                  <RefreshCcw size={18} />
                  Refresh & Check Again
                </button>
              </div>
            </div>
          )}

          {/* Back to Store Button */}
          <button
            onClick={() => router.replace("/")}
            className="mt-6 inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <ArrowLeft size={18} />
            Back to store
          </button>
        </div>
      </div>
    );
  }

  // User is admin, render children
  return <div className="min-h-screen bg-slate-50">{children}</div>;
}
