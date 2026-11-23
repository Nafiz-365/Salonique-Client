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
    ExternalLink,
    Menu,
    X,
    ChevronRight,
    Loader2,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SaloniqueMark } from "@/components/common/SaloniqueMark";

export function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isAuthenticated, isLoading, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Server & Client Route Protection: Only Admin can access
    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                toast.error(
                    "Please sign in as Administrator to access this page.",
                );
                router.replace("/sign-in");
            } else if (user?.role !== "admin") {
                toast.error(
                    "Access denied: You do not have administrator permissions.",
                );
                router.replace("/dashboard");
            }
        }
    }, [isLoading, isAuthenticated, user?.role, router]);

    if (isLoading || !isAuthenticated || user?.role !== "admin") {
        return (
            <div className="flex min-h-screen items-center justify-center gap-2 bg-neutral-50 text-sm text-neutral-500">
                <Loader2 className="size-4 animate-spin" />
                <span>Checking administrator access...</span>
            </div>
        );
    }

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
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
            {/* Top Admin Header Bar */}
            <header className="sticky top-0 z-40 bg-[#1C1816] text-[#FAF7F2] border-b border-[#2D2623]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Brand Logo & Admin Pill */}
                        <div className="flex items-center gap-3">
                            <Link
                                href="/admin"
                                className="flex items-center gap-2.5"
                            >
                                <SaloniqueMark
                                    tone="light"
                                    className="size-8"
                                />
                                <span className="text-lg font-serif font-medium tracking-tight text-white">
                                    Salonique
                                </span>
                            </Link>
                            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#2A2320] text-[#D8B485] border border-[#3D332F] uppercase tracking-wider">
                                <ShieldCheck className="w-3 h-3 text-[#D8B485]" />
                                Admin Console
                            </span>
                        </div>

                        {/* Right Quick Controls */}
                        <div className="flex items-center gap-3">
                            <Link
                                href="/"
                                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2A2320] hover:bg-[#3D332F] text-xs font-medium text-[#C5BFB8] hover:text-white transition-colors"
                            >
                                <span>Live Marketplace</span>
                                <ExternalLink className="w-3 h-3" />
                            </Link>

                            <div className="flex items-center gap-2 pl-2 border-l border-[#2D2623]">
                                <Image
                                    src={
                                        user?.avatar ||
                                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"
                                    }
                                    alt={user?.name || "Admin"}
                                    width={32}
                                    height={32}
                                    unoptimized
                                    className="w-8 h-8 rounded-full object-cover border border-[#3D332F]"
                                />
                                <span className="hidden lg:block text-xs font-medium text-[#EBE5DA]">
                                    {user?.name || "Admin"}
                                </span>
                            </div>

                            {/* Mobile Menu Toggle */}
                            <Button
                                variant="ghost"
                                size="icon"
                                type="button"
                                onClick={() =>
                                    setMobileMenuOpen(!mobileMenuOpen)
                                }
                                className="size-10 rounded-full text-neutral-300 hover:bg-neutral-800 hover:text-white lg:hidden"
                                aria-label={
                                    mobileMenuOpen
                                        ? "Close admin navigation"
                                        : "Open admin navigation"
                                }
                                aria-expanded={mobileMenuOpen}
                                aria-controls="admin-mobile-navigation"
                            >
                                {mobileMenuOpen ? (
                                    <X className="w-6 h-6" />
                                ) : (
                                    <Menu className="w-6 h-6" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Drawer */}
                {mobileMenuOpen && (
                    <div
                        id="admin-mobile-navigation"
                        className="lg:hidden border-t border-neutral-800 bg-neutral-900 p-4 space-y-2"
                    >
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                                        item.active
                                            ? "bg-white text-neutral-900"
                                            : "text-neutral-300 hover:bg-neutral-800"
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                        <div className="pt-3 border-t border-neutral-800 flex justify-between items-center text-xs">
                            <Link
                                href="/"
                                className="text-neutral-400 hover:text-white"
                            >
                                Back to Site
                            </Link>
                            <Button
                                variant="ghost"
                                type="button"
                                onClick={logout}
                                className="h-auto px-2 py-1 text-rose-400 hover:bg-transparent hover:text-rose-300"
                            >
                                Sign Out
                            </Button>
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
                                    {item.active && (
                                        <ChevronRight className="w-4 h-4 ml-auto" />
                                    )}
                                </Link>
                            );
                        })}

                        <div className="pt-3 mt-3 border-t border-neutral-100">
                            <Button
                                variant="ghost"
                                type="button"
                                onClick={logout}
                                className="h-auto w-full justify-start gap-3 rounded-xl px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                <span>Log Out</span>
                            </Button>
                        </div>
                    </aside>

                    {/* Admin Content Area */}
                    <main className="lg:col-span-9 w-full">{children}</main>
                </div>
            </div>
        </div>
    );
}
