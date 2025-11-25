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
  role?: "admin" | "customer";
  metadata?: Record<string, unknown> | null;
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

type ProfileRow = {
  id: string;
  name?: string | null;
  full_name?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  role?: string | null;
  address?: Record<string, unknown> | null;
};

const extractMetadata = (
  addressField: ProfileRow["address"]
): Record<string, unknown> | null => {
  if (addressField && typeof addressField === "object" && !Array.isArray(addressField)) {
    return addressField;
  }
  return null;
};

const mapProfileRow = (
  row: ProfileRow,
  email?: string | null
): Profile => {
  const metadata = extractMetadata(row.address);
  const phone =
    typeof row.phone === "string"
      ? row.phone
      : typeof metadata?.phone === "string"
      ? (metadata.phone as string)
      : "";

  const avatarUrl =
    typeof row.avatar_url === "string"
      ? row.avatar_url
      : typeof metadata?.avatarUrl === "string"
      ? (metadata.avatarUrl as string)
      : "";

  return {
    id: row.id,
    fullName: row.name || row.full_name || "",
    phone,
    avatarUrl,
    email: email ?? "",
    role: (row.role as "admin" | "customer") || "customer",
    metadata,
  };
};

const upsertProfileRow = async (
  primaryPayload: Record<string, unknown>,
  fallbackPayload?: Record<string, unknown>
): Promise<ProfileRow> => {
  const attempt = async (payload: Record<string, unknown>) =>
    supabase.from("profiles").upsert(payload).select("*").single<ProfileRow>();

  let response = await attempt(primaryPayload);

  if (response.error && response.error.code === "42703" && fallbackPayload) {
    response = await attempt(fallbackPayload);
  }

  if (response.error) {
    throw response.error;
  }

  return (
    response.data ??
    (fallbackPayload as ProfileRow) ??
    (primaryPayload as ProfileRow)
  );
};

const ensureProfileViaApi = async (payload: {
  id: string;
  email?: string | null;
  name?: string;
}): Promise<ProfileRow | null> => {
  try {
    const response = await fetch("/api/profiles/ensure", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: payload.id,
        email: payload.email,
        name: payload.name,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      console.error("Ensure profile API error:", errorBody ?? response.statusText);
      return null;
    }

    const data = (await response.json()) as { profile: ProfileRow };
    return data.profile;
  } catch (error) {
    console.error("Ensure profile API request failed:", error);
    return null;
  }
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
          .maybeSingle<ProfileRow>();

        if (error && error.code !== "PGRST116") {
          throw error;
        }

        let profileRow = data ?? null;

        if (!profileRow) {
          profileRow = await ensureProfileViaApi({
            id: userId,
            email,
            name: email?.split("@")[0] ?? "",
          });
        }

        if (!profileRow) {
          const basePayload = {
            id: userId,
            name: email?.split("@")[0] || "",
            role: "customer",
          };
          const legacyPayload = {
            id: userId,
            full_name: "",
            role: "customer",
          };
          profileRow = await upsertProfileRow(basePayload, legacyPayload);
        }

        if (!profileRow) {
          throw new Error("Unable to create or load profile record");
        }

        setProfile(mapProfileRow(profileRow, email));
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
            role: "customer",
            metadata: null,
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
        await Promise.all([
          fetchProfile(currentUser.id, currentUser.email ?? undefined),
          fetchAddresses(currentUser.id),
        ]);
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
          fetchProfile(currentUser.id, currentUser.email ?? undefined);
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
        const phoneValue = updates.phone ?? profile?.phone ?? "";
        const avatarValue = updates.avatarUrl ?? profile?.avatarUrl ?? "";
        const metadata: Record<string, unknown> = {
          ...(profile?.metadata ?? {}),
          phone: phoneValue,
          avatarUrl: avatarValue,
        };

        const basePayload = {
          id: user.id,
          name: updates.fullName ?? profile?.fullName ?? "",
          role: updates.role ?? profile?.role ?? "customer",
          address: metadata,
        };

        const legacyPayload = {
          id: user.id,
          full_name: updates.fullName ?? profile?.fullName ?? "",
          phone: phoneValue,
          avatar_url: avatarValue,
          role: updates.role ?? profile?.role ?? "customer",
        };

        const savedRow = await upsertProfileRow(basePayload, legacyPayload);

        setProfile(mapProfileRow(savedRow, user.email ?? profile?.email));

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

