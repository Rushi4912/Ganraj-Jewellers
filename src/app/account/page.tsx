"use client";

import { useMemo, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useAuth, Address } from "../context/AuthContext";
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
  Package,
  Settings,
  ChevronRight,
  Edit2,
  Trash2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const emptyAddress: Partial<Address> & { id: string | undefined } = {
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

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'addresses' | 'settings'>('overview');
  const [editingProfile, setEditingProfile] = useState({
    fullName: profile?.fullName || "",
    phone: profile?.phone || "",
  });
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [addressDraft, setAddressDraft] = useState(emptyAddress);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveProfile(editingProfile);
    toast.success("Profile updated successfully");
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await saveAddress(addressDraft as any);
    setAddressFormOpen(false);
    setAddressDraft(emptyAddress);
    toast.success("Address saved successfully");
  };

  const stats = useMemo(
    () => [
      {
        label: "Member since",
        value: user?.created_at
          ? new Date(user.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
          : "—",
      },
      { label: "Saved addresses", value: addresses.length },
      { label: "Total Orders", value: "0" }, // Placeholder for order count
    ],
    [addresses, user?.created_at]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F2F0EB]">
        <Loader2 className="animate-spin text-[#8B7355]" size={32} />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#F2F0EB] flex items-center justify-center px-6 py-20 animate-fadeIn">
          <div className="max-w-lg w-full bg-white rounded-[32px] shadow-sm p-12 text-center border border-[#E5E0D8]">
            <div className="w-20 h-20 bg-[#F2F0EB] rounded-full flex items-center justify-center mx-auto mb-8 text-[#8B7355]">
              <User size={32} />
            </div>
            <h1 className="font-display text-3xl text-[#2D2A26] mb-4">
              Sign in to your Atelier
            </h1>
            <p className="text-[#6B5D52] mb-10 leading-relaxed">
              Access your saved addresses, track your exquisite orders, and manage your personal collection.
            </p>
            <div className="flex flex-col gap-4">
              <Link
                href="/login"
                className="w-full py-4 bg-[#2D2A26] text-white rounded-full font-bold uppercase tracking-wider hover:bg-[#8B7355] transition-all duration-300"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="w-full py-4 bg-transparent border border-[#C5B4A5] text-[#2D2A26] rounded-full font-bold uppercase tracking-wider hover:bg-[#F2F0EB] transition-colors"
              >
                Create Account
              </Link>
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
      <main className="bg-[#F2F0EB] min-h-screen py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-12 animate-fadeInUp">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-[#E5E0D8] text-[#8B7355] flex items-center justify-center text-3xl font-display">
                {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="font-display text-3xl text-[#2D2A26] mb-1">
                  Hello, {profile?.fullName?.split(' ')[0] || 'Member'}
                </h1>
                <p className="text-[#6B5D52] text-sm">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => {
                signOut();
                toast.info("Signed out");
              }}
              className="px-6 py-3 rounded-full border border-[#C5B4A5]/30 bg-white text-[#6B5D52] font-medium hover:bg-[#2D2A26] hover:text-white transition-all flex items-center gap-2"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* Sidebar Navigation */}
            <div className="lg:col-span-1 space-y-2 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
              {[
                { id: 'overview', label: 'Overview', icon: User },
                { id: 'orders', label: 'My Orders', icon: Package },
                { id: 'addresses', label: 'Addresses', icon: MapPin },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${activeTab === item.id
                      ? 'bg-[#2D2A26] text-white shadow-lg'
                      : 'bg-white text-[#6B5D52] hover:bg-[#E5E0D8]'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {activeTab === item.id && <ChevronRight size={16} />}
                </button>
              ))}
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-8 animate-fadeInUp" style={{ animationDelay: '200ms' }}>

              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat) => (
                      <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E0D8]">
                        <p className="text-xs uppercase tracking-wider text-[#8B7355] mb-2">{stat.label}</p>
                        <p className="font-display text-2xl text-[#2D2A26]">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Recent Activity / Simplified Dashboard */}
                  <div className="bg-white p-8 rounded-[24px] shadow-sm border border-[#E5E0D8]">
                    <h2 className="font-display text-2xl text-[#2D2A26] mb-6">Welcome Back</h2>
                    <p className="text-[#6B5D52] leading-relaxed">
                      From your account dashboard you can view your <span className="text-[#2D2A26] font-medium cursor-pointer hover:underline" onClick={() => setActiveTab('orders')}>recent orders</span>,
                      manage your <span className="text-[#2D2A26] font-medium cursor-pointer hover:underline" onClick={() => setActiveTab('addresses')}>shipping and billing addresses</span>,
                      and <span className="text-[#2D2A26] font-medium cursor-pointer hover:underline" onClick={() => setActiveTab('settings')}>edit your password and account details</span>.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="bg-white p-8 rounded-[24px] shadow-sm border border-[#E5E0D8] min-h-[400px] flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-[#F2F0EB] rounded-full flex items-center justify-center mb-4 text-[#C5B4A5]">
                    <Package size={24} />
                  </div>
                  <h3 className="font-display text-xl text-[#2D2A26] mb-2">No Orders Yet</h3>
                  <p className="text-[#6B5D52] max-w-xs mx-auto mb-6">
                    You haven't placed any orders yet. Discover our collection and start your journey.
                  </p>
                  <Link href="/shop" className="px-8 py-3 bg-[#2D2A26] text-white rounded-full font-bold uppercase tracking-wider text-xs hover:bg-[#8B7355] transition-colors">
                    Start Shopping
                  </Link>
                </div>
              )}

              {activeTab === 'addresses' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                      <div key={address.id} className="bg-white p-6 rounded-2xl border border-[#E5E0D8] hover:border-[#8B7355] transition-colors group relative">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-[#2D2A26]">{address.label}</h3>
                              {address.isDefault && (
                                <span className="bg-[#F2F0EB] text-[#8B7355] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Default</span>
                              )}
                            </div>
                            <p className="text-sm text-[#6B5D52]">{address.recipientName}</p>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => startEditAddress(address.id)} className="p-2 hover:bg-[#F2F0EB] rounded-full text-[#6B5D52]">
                              <Edit2 size={14} />
                            </button>
                            <button onClick={() => deleteAddress(address.id)} className="p-2 hover:bg-red-50 rounded-full text-red-500">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="text-sm text-[#6B5D52] space-y-1">
                          <p>{address.line1}</p>
                          {address.line2 && <p>{address.line2}</p>}
                          <p>{address.city}, {address.state} {address.postalCode}</p>
                          <p>{address.country}</p>
                          <p className="pt-2 text-xs">{address.phone}</p>
                        </div>
                        {!address.isDefault && (
                          <button
                            onClick={() => setDefaultAddress(address.id)}
                            className="mt-4 text-xs font-bold text-[#8B7355] uppercase tracking-wider hover:underline"
                          >
                            Set as Default
                          </button>
                        )}
                      </div>
                    ))}

                    <button
                      onClick={startNewAddress}
                      className="border-2 border-dashed border-[#E5E0D8] rounded-2xl p-6 flex flex-col items-center justify-center gap-4 text-[#C5B4A5] hover:border-[#8B7355] hover:text-[#8B7355] transition-all min-h-[200px]"
                    >
                      <Plus size={32} />
                      <span className="font-bold uppercase tracking-wider text-xs">Add New Address</span>
                    </button>
                  </div>

                  {addressFormOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                      <div className="bg-white rounded-[24px] max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
                        <h3 className="font-display text-2xl text-[#2D2A26] mb-6">
                          {addressDraft.id ? "Edit Address" : "Add New Address"}
                        </h3>
                        <form onSubmit={handleAddressSubmit} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-[#6B5D52] uppercase tracking-wider">Label</label>
                              <input
                                className="w-full bg-[#FAFAFA] border border-[#E5E0D8] rounded-xl px-4 py-3 outline-none focus:border-[#8B7355] transition-colors"
                                placeholder="Home, Office..."
                                value={addressDraft.label}
                                onChange={(e) => setAddressDraft({ ...addressDraft, label: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-[#6B5D52] uppercase tracking-wider">Recipient Name</label>
                              <input
                                className="w-full bg-[#FAFAFA] border border-[#E5E0D8] rounded-xl px-4 py-3 outline-none focus:border-[#8B7355] transition-colors"
                                value={addressDraft.recipientName}
                                onChange={(e) => setAddressDraft({ ...addressDraft, recipientName: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-bold text-[#6B5D52] uppercase tracking-wider">Address Line 1</label>
                            <input
                              className="w-full bg-[#FAFAFA] border border-[#E5E0D8] rounded-xl px-4 py-3 outline-none focus:border-[#8B7355] transition-colors"
                              value={addressDraft.line1}
                              onChange={(e) => setAddressDraft({ ...addressDraft, line1: e.target.value })}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-[#6B5D52] uppercase tracking-wider">City</label>
                              <input
                                className="w-full bg-[#FAFAFA] border border-[#E5E0D8] rounded-xl px-4 py-3 outline-none focus:border-[#8B7355] transition-colors"
                                value={addressDraft.city}
                                onChange={(e) => setAddressDraft({ ...addressDraft, city: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-[#6B5D52] uppercase tracking-wider">State</label>
                              <input
                                className="w-full bg-[#FAFAFA] border border-[#E5E0D8] rounded-xl px-4 py-3 outline-none focus:border-[#8B7355] transition-colors"
                                value={addressDraft.state}
                                onChange={(e) => setAddressDraft({ ...addressDraft, state: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="flex gap-4 pt-4 border-t border-[#E5E0D8]">
                            <button
                              type="button"
                              onClick={() => setAddressFormOpen(false)}
                              className="px-8 py-3 border border-[#C5B4A5] text-[#6B5D52] rounded-xl font-bold uppercase tracking-wider hover:bg-[#FAFAFA]"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="flex-1 bg-[#2D2A26] text-white rounded-xl font-bold uppercase tracking-wider hover:bg-[#8B7355] transition-colors"
                            >
                              {addressDraft.id ? "Update Address" : "Save Address"}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="bg-white p-8 rounded-[24px] shadow-sm border border-[#E5E0D8]">
                  <h3 className="font-display text-2xl text-[#2D2A26] mb-8">Account Details</h3>
                  <form onSubmit={handleProfileSave} className="space-y-6 max-w-lg">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#6B5D52] uppercase tracking-wider">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C5B4A5]" size={18} />
                        <input
                          className="w-full bg-[#FAFAFA] border border-[#E5E0D8] rounded-xl pl-12 pr-4 py-3 outline-none focus:border-[#8B7355] transition-colors"
                          value={editingProfile.fullName}
                          onChange={(e) => setEditingProfile(prev => ({ ...prev, fullName: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#6B5D52] uppercase tracking-wider">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C5B4A5]" size={18} />
                        <input
                          className="w-full bg-[#FAFAFA] border border-[#E5E0D8] rounded-xl pl-12 pr-4 py-3 outline-none text-[#C5B4A5] cursor-not-allowed"
                          value={user.email || ''}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#6B5D52] uppercase tracking-wider">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C5B4A5]" size={18} />
                        <input
                          className="w-full bg-[#FAFAFA] border border-[#E5E0D8] rounded-xl pl-12 pr-4 py-3 outline-none focus:border-[#8B7355] transition-colors"
                          value={editingProfile.phone}
                          onChange={(e) => setEditingProfile(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+1 234 567 890"
                        />
                      </div>
                    </div>

                    <div className="pt-6">
                      <button
                        type="submit"
                        disabled={profileLoading}
                        className="px-8 py-3 bg-[#2D2A26] text-white rounded-xl font-bold uppercase tracking-wider hover:bg-[#8B7355] transition-colors disabled:opacity-70"
                      >
                        {profileLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
