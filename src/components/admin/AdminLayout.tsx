"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
  ShieldCheck,
  LayoutDashboard,
  Scissors,
  Calendar,
  Users,
  CreditCard,
  User as UserIcon,
  LogOut,
  Sparkles,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Server & Client Route Protection: Only Admin can access
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        toast.error("Please sign in as Administrator to access this page.");
        router.push("/sign-in");
      } else if (user?.role !== "admin") {
        toast.error("Access denied: You do not have administrator permissions.");
        router.push("/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  const menuItems = [
    {
      label: "Overview",
      href: "/admin",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      label: "Services Management",
      href: "/admin/services",
      icon: Scissors,
      active: pathname === "/admin/services",
    },
    {
      label: "All Appointments",
      href: "/admin/appointments",
      icon: Calendar,
      active: pathname === "/admin/appointments",
    },
    {
      label: "Clients & Staff",
      href: "/admin/users",
      icon: Users,
      active: pathname === "/admin/users",
    },
    {
      label: "Transactions",
      href: "/admin/transactions",
      icon: CreditCard,
      active: pathname === "/admin/transactions",
    },
    {
      label: "Admin Profile",
      href: "/admin/profile",
      icon: UserIcon,
      active: pathname === "/admin/profile",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-100/60 flex flex-col font-sans">
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-neutral-900 text-white border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Admin Pill */}
            <div className="flex items-center gap-3">
              <Link href="/admin" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-neutral-900 font-bold">
                  <Sparkles className="w-4 h-4 text-neutral-900" />
                </div>
                <span className="text-lg font-bold tracking-tight text-white">
                  Salonique
                </span>
              </Link>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-800 text-rose-300 border border-neutral-700 uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3 text-rose-300" />
                Admin Console
              </span>
            </div>

            {/* Right Quick Controls */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
              >
                <span>Live Marketplace</span>
                <ExternalLink className="w-3 h-3" />
              </Link>

              <div className="flex items-center gap-2 pl-2 border-l border-neutral-800">
                <Image
                  src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"}
                  alt={user?.name || "Admin"}
                  width={32}
                  height={32}
                  unoptimized
                  className="w-8 h-8 rounded-full object-cover border border-neutral-700"
                />
                <span className="hidden lg:block text-xs font-semibold text-neutral-200">
                  {user?.name || "Admin"}
                </span>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 text-neutral-400 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-800 bg-neutral-900 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    item.active ? "bg-white text-neutral-900" : "text-neutral-300 hover:bg-neutral-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="pt-3 border-t border-neutral-800 flex justify-between items-center text-xs">
              <Link href="/" className="text-neutral-400 hover:text-white">
                Back to Site
              </Link>
              <button
                type="button"
                onClick={logout}
                className="text-rose-400 hover:text-rose-300 font-semibold"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Admin Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Left Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 bg-white rounded-3xl p-4 border border-neutral-200/80 shadow-xs space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Navigation
            </div>

            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                    item.active
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
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Customer Dashboard</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </aside>

          {/* Admin Content Area */}
          <main className="lg:col-span-9 w-full">{children}</main>
        </div>
      </div>
    </div>
  );
}

