"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import {
  LayoutDashboard,
  Calendar,
  User as UserIcon,
  LogOut,
  Sparkles,
  ChevronRight,
  Loader2,
} from "lucide-react";
import Image from "next/image";

export function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // Route Protection: Unauthenticated or Blocked users cannot access
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        toast.error("Please sign in to access your customer dashboard.");
        router.replace("/sign-in");
      } else if (user?.role === "admin") {
        router.replace("/admin");
      } else if (user?.isBlocked || user?.status === "suspended") {
        toast.error("Your account has been blocked by administrator. Access restricted.");
        logout();
      }
    }
  }, [isLoading, isAuthenticated, user?.role, user?.isBlocked, user?.status, router, logout]);

  if (
    isLoading ||
    !isAuthenticated ||
    user?.role !== "customer" ||
    user.isBlocked ||
    user.status === "suspended"
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-2 bg-neutral-50 text-sm text-neutral-500">
        <Loader2 className="size-4 animate-spin" />
        <span>Opening your customer dashboard...</span>
      </div>
    );
  }

  const navItems = [
    {
      label: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      label: "My Appointments",
      href: "/dashboard/appointments",
      icon: Calendar,
      active: pathname === "/dashboard/appointments",
    },
    {
      label: "Profile & Settings",
      href: "/dashboard/profile",
      icon: UserIcon,
      active: pathname === "/dashboard/profile",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50/60">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Welcome Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
            <Image
              src={user?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"}
              alt={user?.name || "Customer"}
              width={64}
              height={64}
              unoptimized
              className="size-12 shrink-0 rounded-full border-2 border-neutral-900/10 object-cover shadow-sm sm:size-16"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h1 className="text-xl font-extrabold text-neutral-900 sm:text-2xl">
                  Welcome back, {user?.name?.split(" ")[0] || "Valued Client"}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-neutral-100 text-neutral-800">
                  Customer
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
                Manage your beauty bookings, receipts, and profile details in one place.
              </p>
            </div>
          </div>

          <Link
            href="/services"
            className="px-5 py-2.5 rounded-full bg-neutral-900 text-white font-bold text-xs hover:bg-black flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-300" />
            <span>Book New Service</span>
          </Link>
        </div>

        {/* Dashboard Grid: Sidebar + Main Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Sidebar Navigation */}
          <aside className="hidden lg:block lg:col-span-3 bg-white rounded-3xl p-4 border border-neutral-200/80 shadow-xs space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Customer Portal
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${item.active
                    ? "bg-neutral-900 text-white shadow-xs"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.active && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              );
            })}

            <div className="pt-3 mt-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={logout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>

          {/* Mobile Horizontal Subnavigation */}
          <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 mb-2 w-full hide-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${item.active
                    ? "bg-neutral-900 text-white shadow-xs"
                    : "bg-white text-neutral-700 border border-neutral-200"
                    }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Main Dashboard Content */}
          <section className="lg:col-span-9 w-full">{children}</section>
        </div>
      </div>

      <Footer />
    </div>
  );
}

