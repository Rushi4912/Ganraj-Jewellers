"use client";

import { useMemo, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  Loader2,
  MapPin,
  Mail,
  Phone,
  User,
  LogOut,
  Plus,
  CheckCircle2,
  Shield,
} from "lucide-react";

const emptyAddress = {
  id: undefined,
  label: "",
  recipientName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "United States",
  isDefault: false,
};

export default function AccountPage() {
  const {
    user,
    loading,
    profile,
    profileLoading,
    addresses,
    addressesLoading,
    saveProfile,
    saveAddress,
    deleteAddress,
    setDefaultAddress,
    signOut,
  } = useAuth();
  const toast = useToast();

  const [editingProfile, setEditingProfile] = useState({
    fullName: profile?.fullName || "",
    phone: profile?.phone || "",
  });
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [addressDraft, setAddressDraft] = useState(emptyAddress);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveProfile(editingProfile);
  };

  const startNewAddress = () => {
    setAddressDraft(emptyAddress);
    setAddressFormOpen(true);
  };

  const startEditAddress = (id: string) => {
    const match = addresses.find((addr) => addr.id === id);
    if (!match) return;
    setAddressDraft({ ...match });
    setAddressFormOpen(true);
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressDraft.label || !addressDraft.line1 || !addressDraft.city) {
      toast.error("Please fill the required address fields");
      return;
    }
    await saveAddress(addressDraft);
    setAddressFormOpen(false);
    setAddressDraft(emptyAddress);
  };

  const stats = useMemo(
    () => [
      {
        label: "Member since",
        value: user?.created_at
          ? new Date(user.created_at).toLocaleDateString()
          : "—",
      },
      { label: "Saved addresses", value: addresses.length },
      {
        label: "Preferred shipping",
        value:
          addresses.find((a) => a.isDefault)?.city
            ? `${addresses.find((a) => a.isDefault)?.city}, ${
                addresses.find((a) => a.isDefault)?.country
              }`
            : "Not set",
      },
    ],
    [addresses, user?.created_at]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-amber-500" size={32} />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
          <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl p-10 text-center space-y-6">
            <Shield size={56} className="mx-auto text-amber-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              Sign in to manage your atelier profile
            </h1>
            <p className="text-gray-600">
              Access saved addresses, profile preferences, and track every
              purchase.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="/login"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg shadow-amber-500/30"
              >
                Login
              </a>
              <a
                href="/signup"
                className="px-6 py-3 rounded-2xl border border-gray-200 font-semibold text-gray-800 hover:border-gray-300 transition-all"
              >
                Create account
              </a>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <section className="bg-white rounded-3xl shadow-xl p-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center text-2xl font-semibold">
                {profile?.fullName
                  ? profile.fullName.charAt(0).toUpperCase()
                  : user.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="uppercase text-xs tracking-[0.4em] text-gray-500">
                  Atelier member
                </p>
                <h1 className="text-3xl font-bold text-gray-900 mt-2">
                  {profile?.fullName || "Complete your profile"}
                </h1>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  signOut();
                  toast.info("Signed out");
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-gray-200 font-semibold text-gray-800 hover:border-gray-300 transition-all bg-white"
              >
                <LogOut size={18} />
                Sign out
              </button>
              <a
                href="/orders"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg shadow-amber-500/40"
              >
                View orders
              </a>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl p-6 shadow-sm space-y-2"
              >
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  {stat.label}
                </p>
                <p className="text-xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>
            ))}
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl shadow-sm p-8 space-y-6">
              <div className="flex items-center gap-3">
                <User className="text-amber-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Profile details
                </h2>
              </div>

              <form className="space-y-5" onSubmit={handleProfileSave}>
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={editingProfile.fullName}
                    onChange={(e) =>
                      setEditingProfile((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Add your full name"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Phone number
                  </label>
                  <div className="relative mt-2">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={editingProfile.phone}
                      onChange={(e) =>
                        setEditingProfile((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-gray-200 pl-12 pr-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="+1 555 000 0000"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Email
                  </label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={user.email ?? ""}
                      disabled
                      className="w-full rounded-2xl border border-gray-200 pl-12 pr-4 py-3 bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3 shadow-lg shadow-amber-500/30 disabled:opacity-50"
                >
                  {profileLoading && (
                    <Loader2 className="animate-spin" size={18} />
                  )}
                  Save profile
                </button>
              </form>
            </div>

            <div className="bg-white rounded-3xl shadow-sm p-8 space-y-6">
              <div className="flex items-center gap-3">
                <MapPin className="text-amber-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Address book
                </h2>
              </div>

              <div className="space-y-4">
                {addresses.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-center text-gray-500">
                    No addresses saved yet.
                  </div>
                )}
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="rounded-2xl border border-gray-100 p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">
                          {address.label}
                        </p>
                        {address.isDefault && (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                            <CheckCircle2 size={12} />
                            Default
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2 text-sm">
                        {!address.isDefault && (
                          <button
                            onClick={() => setDefaultAddress(address.id)}
                            className="text-amber-600 hover:underline"
                          >
                            Make default
                          </button>
                        )}
                        <button
                          onClick={() => startEditAddress(address.id)}
                          className="text-gray-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteAddress(address.id)}
                          className="text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p className="font-semibold">{address.recipientName}</p>
                      <p>{address.line1}</p>
                      {address.line2 && <p>{address.line2}</p>}
                      <p>
                        {address.city}, {address.state} {address.postalCode}
                      </p>
                      <p>{address.country}</p>
                      <p className="pt-2">{address.phone}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={startNewAddress}
                className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-amber-200 py-3 text-amber-600 font-semibold"
              >
                <Plus size={18} />
                Add new address
              </button>

              {addressFormOpen && (
                <form
                  onSubmit={handleAddressSubmit}
                  className="space-y-4 rounded-2xl border border-gray-100 p-5"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Label</label>
                      <input
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 mt-1"
                        value={addressDraft.label}
                        onChange={(e) =>
                          setAddressDraft((prev) => ({
                            ...prev,
                            label: e.target.value,
                          }))
                        }
                        placeholder="Home / Studio"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">
                        Recipient name
                      </label>
                      <input
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 mt-1"
                        value={addressDraft.recipientName}
                        onChange={(e) =>
                          setAddressDraft((prev) => ({
                            ...prev,
                            recipientName: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Phone</label>
                    <input
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 mt-1"
                      value={addressDraft.phone}
                      onChange={(e) =>
                        setAddressDraft((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Address line</label>
                    <input
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 mt-1"
                      value={addressDraft.line1}
                      onChange={(e) =>
                        setAddressDraft((prev) => ({
                          ...prev,
                          line1: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">
                      Address line 2
                    </label>
                    <input
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 mt-1"
                      value={addressDraft.line2 ?? ""}
                      onChange={(e) =>
                        setAddressDraft((prev) => ({
                          ...prev,
                          line2: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">City</label>
                      <input
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 mt-1"
                        value={addressDraft.city}
                        onChange={(e) =>
                          setAddressDraft((prev) => ({
                            ...prev,
                            city: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">State</label>
                      <input
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 mt-1"
                        value={addressDraft.state}
                        onChange={(e) =>
                          setAddressDraft((prev) => ({
                            ...prev,
                            state: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">
                        Postal code
                      </label>
                      <input
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 mt-1"
                        value={addressDraft.postalCode}
                        onChange={(e) =>
                          setAddressDraft((prev) => ({
                            ...prev,
                            postalCode: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Country</label>
                      <input
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 mt-1"
                        value={addressDraft.country}
                        onChange={(e) =>
                          setAddressDraft((prev) => ({
                            ...prev,
                            country: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={addressDraft.isDefault}
                      onChange={(e) =>
                        setAddressDraft((prev) => ({
                          ...prev,
                          isDefault: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-sm text-gray-600">
                      Set as default shipping address
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={addressesLoading}
                      className="flex-1 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3"
                    >
                      {addressDraft.id ? "Update address" : "Save address"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddressFormOpen(false)}
                      className="rounded-2xl border border-gray-200 px-6 py-3 font-semibold text-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

