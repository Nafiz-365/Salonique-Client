"use client";

import React, { createContext, useContext, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  avatar: string;
  role: "customer" | "admin";
  phone: string;
  memberSince?: string;
  status: "active" | "suspended";
  isBlocked?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  register: (name: string, email: string, password: string, image?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [localOverride, setLocalOverride] = useState<AuthUser | null>(null);

  // Build user from session or local override
  const rawUser = session?.user ?? null;
  const user: AuthUser | null = localOverride
    ? localOverride
    : rawUser
    ? {
        id: rawUser.id,
        name: rawUser.name ?? rawUser.email,
        email: rawUser.email,
        image: rawUser.image,
        avatar:
          rawUser.image ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        role: ((rawUser as Record<string, unknown>).role as "customer" | "admin") ?? "customer",
        phone: ((rawUser as Record<string, unknown>).phone as string) ?? "",
        memberSince: "November 2026",
        status: ((rawUser as Record<string, unknown>).status as "active" | "suspended") ?? "active",
        isBlocked: Boolean((rawUser as Record<string, unknown>).isBlocked),
      }
    : null;

  const isLoading = isPending;
  const isAuthenticated = !!user;

  // ── login ──────────────────────────────────────────────────────────────────
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Invalid credentials");
        return false;
      }

      toast.success("Welcome back!");
      return true;
    } catch {
      toast.error("Login failed. Please try again.");
      return false;
    }
  };

  // ── loginWithGoogle ────────────────────────────────────────────────────────
  const loginWithGoogle = async () => {
    try {
      await authClient.signIn.social({ provider: "google" });
    } catch {
      toast.error("Google sign-in failed.");
    }
  };

  // ── register ───────────────────────────────────────────────────────────────
  const register = async (
    name: string,
    email: string,
    password: string,
    image?: string
  ): Promise<boolean> => {
    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        image,
      });

      if (error) {
        toast.error(error.message || "Registration failed");
        return false;
      }

      toast.success("Account created! Please sign in.");
      return true;
    } catch {
      toast.error("Registration failed. Please try again.");
      return false;
    }
  };

  // ── logout ─────────────────────────────────────────────────────────────────
  const logout = async () => {
    setLocalOverride(null);
    await authClient.signOut();
    toast.info("You have been signed out");
    router.push("/");
  };

  // ── updateProfile ──────────────────────────────────────────────────────────
  const updateProfile = async (data: Partial<AuthUser>) => {
    if (!user) {
      throw new Error("You must be signed in to update your profile.");
    }

    const { error } = await authClient.updateUser({
      name: data.name ?? user.name,
      image: data.avatar ?? data.image ?? user.avatar,
      phone: data.phone ?? user.phone,
    });
    if (error) {
      throw new Error(error.message || "Failed to update profile.");
    }

    setLocalOverride({
      ...user,
      ...data,
      image: data.image ?? data.avatar ?? user.image,
      avatar: data.avatar ?? data.image ?? user.avatar,
    });
    toast.success("Profile updated successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
