"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { useToast } from "./ToastContext";

interface Profile {
  id: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  email: string;
}

export interface Address {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

type AddressPayload = Omit<Address, "id" | "isDefault"> & {
  id?: string;
  isDefault?: boolean;
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  profile: Profile | null;
  profileLoading: boolean;
  addresses: Address[];
  addressesLoading: boolean;
  saveProfile: (profile: Partial<Profile>) => Promise<void>;
  saveAddress: (address: AddressPayload) => Promise<void>;
  deleteAddress: (addressId: string) => Promise<void>;
  setDefaultAddress: (addressId: string) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const toast = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const profileErrorNotified = useRef(false);
  const addressErrorNotified = useRef(false);
  const addressFetchBlocked = useRef(false);
  const toastRef = useRef(toast);

  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  const fetchProfile = useCallback(
    async (userId: string, email?: string) => {
      setProfileLoading(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (error && error.code !== "PGRST116") {
          throw error;
        }

        const profileData = data ?? {
          id: userId,
          full_name: "",
          phone: "",
          avatar_url: "",
        };

        if (!data) {
          await supabase.from("profiles").insert({
            id: userId,
            full_name: "",
            phone: "",
            avatar_url: "",
          });
        }

        setProfile({
          id: userId,
          fullName: profileData.full_name || "",
          phone: profileData.phone || "",
          avatarUrl: profileData.avatar_url || "",
          email: email ?? "",
        });
        profileErrorNotified.current = false;
      } catch (err) {
        console.error("Profile fetch error", err);
        if (!profileErrorNotified.current) {
          profileErrorNotified.current = true;
          setTimeout(() => toastRef.current.error("Unable to load profile"), 0);
        }
        setProfile((prev) =>
          prev ?? {
            id: userId,
            fullName: "",
            phone: "",
            avatarUrl: "",
            email: email ?? "",
          }
        );
      } finally {
        setProfileLoading(false);
      }
    },
    []
  );

  const fetchAddresses = useCallback(
    async (userId: string) => {
      setAddressesLoading(true);
      if (addressFetchBlocked.current) {
        setAddressesLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("addresses")
          .select("*")
          .eq("user_id", userId)
          .order("is_default", { ascending: false })
          .order("created_at", { ascending: true });

        if (error && error.code !== "42P01") {
          throw error;
        }

        if (error && error.code === "42P01") {
          addressFetchBlocked.current = true;
        }

        setAddresses(
          (data || []).map((address) => ({
            id: address.id,
            label: address.label,
            recipientName: address.recipient_name,
            phone: address.phone,
            line1: address.line1,
            line2: address.line2,
            city: address.city,
            state: address.state,
            postalCode: address.postal_code,
            country: address.country,
            isDefault: address.is_default,
          }))
        );
        addressErrorNotified.current = false;
        if (!error) {
          addressFetchBlocked.current = false;
        }
      } catch (err) {
        console.error("Address fetch error", err);
        if (!addressErrorNotified.current) {
          addressErrorNotified.current = true;
          setTimeout(() => toastRef.current.error("Unable to load addresses"), 0);
        }
        setAddresses([]);
      } finally {
        setAddressesLoading(false);
      }
    },
    []
  );

  const initialize = useCallback(async () => {
    setLoading(true);
    try {
      profileErrorNotified.current = false;
      addressErrorNotified.current = false;
      const { data } = await supabase.auth.getSession();
      const currentUser = data.session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        await Promise.all([fetchProfile(currentUser.id), fetchAddresses(currentUser.id)]);
      } else {
        setProfile(null);
        setAddresses([]);
      }
    } catch (err) {
      console.error("Auth init error", err);
    } finally {
      setLoading(false);
    }
  }, [fetchAddresses, fetchProfile]);

  useEffect(() => {
    initialize();
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          fetchProfile(currentUser.id);
          fetchAddresses(currentUser.id);
        } else {
          setProfile(null);
          setAddresses([]);
          profileErrorNotified.current = false;
          addressErrorNotified.current = false;
        }
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, [fetchAddresses, fetchProfile, initialize]);

  const saveProfile = useCallback(
    async (updates: Partial<Profile>) => {
      if (!user) {
        toast.error("You need to be logged in");
        return;
      }
      setProfileLoading(true);
      try {
        const payload = {
          id: user.id,
          full_name: updates.fullName ?? profile?.fullName ?? "",
          phone: updates.phone ?? profile?.phone ?? "",
          avatar_url: updates.avatarUrl ?? profile?.avatarUrl ?? "",
        };

        const { error } = await supabase.from("profiles").upsert(payload);

        if (error) throw error;

        setProfile((prev) => ({
          id: user.id,
          email: prev?.email || user.email || "",
          fullName: payload.full_name,
          phone: payload.phone,
          avatarUrl: payload.avatar_url,
        }));

        toast.success("Profile updated");
      } catch (err) {
        console.error("Profile save error", err);
        toast.error("Failed to update profile");
      } finally {
        setProfileLoading(false);
      }
    },
    [profile, toast, user]
  );

  const saveAddress = useCallback(
    async (address: AddressPayload) => {
      if (!user) {
        toast.error("You need to be logged in");
        return;
      }
      if (!address.label || !address.recipientName || !address.line1 || !address.city || !address.state || !address.postalCode || !address.country) {
        toast.error("Please complete all required address fields");
        return;
      }
      setAddressesLoading(true);
      try {
        const basePayload = {
          user_id: user.id,
          label: address.label,
          recipient_name: address.recipientName,
          phone: address.phone,
          line1: address.line1,
          line2: address.line2 || null,
          city: address.city,
          state: address.state,
          postal_code: address.postalCode,
          country: address.country,
          is_default: address.isDefault ?? addresses.length === 0,
        };

        if (basePayload.is_default) {
          await supabase
            .from("addresses")
            .update({ is_default: false })
            .eq("user_id", user.id);
        }

        let response;
        if (address.id) {
          response = await supabase
            .from("addresses")
            .update(basePayload)
            .eq("id", address.id)
            .eq("user_id", user.id)
            .select("*")
            .single();
        } else {
          response = await supabase
            .from("addresses")
            .insert(basePayload)
            .select("*")
            .single();
        }

        if (response.error) throw response.error;

        await fetchAddresses(user.id);
        toast.success("Address saved");
      } catch (err) {
        console.error("Address save error", err);
        toast.error("Failed to save address");
      } finally {
        setAddressesLoading(false);
      }
    },
    [addresses.length, fetchAddresses, toast, user]
  );

  const deleteAddress = useCallback(
    async (addressId: string) => {
      if (!user) return;
      setAddressesLoading(true);
      try {
        const { error } = await supabase
          .from("addresses")
          .delete()
          .eq("id", addressId)
          .eq("user_id", user.id);

        if (error) throw error;
        await fetchAddresses(user.id);
        toast.success("Address removed");
      } catch (err) {
        console.error("Address delete error", err);
        toast.error("Failed to remove address");
      } finally {
        setAddressesLoading(false);
      }
    },
    [fetchAddresses, toast, user]
  );

  const setDefaultAddress = useCallback(
    async (addressId: string) => {
      if (!user) return;
      setAddressesLoading(true);
      try {
        await supabase
          .from("addresses")
          .update({ is_default: false })
          .eq("user_id", user.id);
        await supabase
          .from("addresses")
          .update({ is_default: true })
          .eq("id", addressId)
          .eq("user_id", user.id);
        await fetchAddresses(user.id);
        toast.success("Default address updated");
      } catch (err) {
        console.error("Default address error", err);
        toast.error("Unable to set default");
      } finally {
        setAddressesLoading(false);
      }
    },
    [fetchAddresses, toast, user]
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setAddresses([]);
    profileErrorNotified.current = false;
    addressErrorNotified.current = false;
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
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
      refresh: initialize,
    }),
    [
      addresses,
      addressesLoading,
      deleteAddress,
      initialize,
      loading,
      profile,
      profileLoading,
      saveAddress,
      saveProfile,
      setDefaultAddress,
      signOut,
      user,
    ]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

