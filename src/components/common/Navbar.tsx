"use client";

import React, { useState, useEffect } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
    Menu,
    X,
    ChevronDown,
    Calendar,
    User as UserIcon,
    LayoutDashboard,
    ShieldCheck,
    LogOut,
    HelpCircle,
    ArrowRight,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SaloniqueMark } from "@/components/common/SaloniqueMark";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
    const pathname = usePathname();
    return <NavbarContent key={pathname} pathname={pathname} />;
}

function NavbarContent({ pathname }: { pathname: string }) {
    const { user, isAuthenticated, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const categories = [
        { name: "Hair", href: "/services?category=Hair" },
        { name: "Nails", href: "/services?category=Nails" },
        { name: "Facial", href: "/services?category=Facial" },
        { name: "Massage", href: "/services?category=Massage" },
        { name: "Makeup", href: "/services?category=Makeup" },
        { name: "Brows & Lashes", href: "/services?category=Brows %26 Lashes" },
        { name: "Waxing", href: "/services?category=Waxing" },
        { name: "Spa", href: "/services?category=Spa" },
    ];

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-200 ${
                isScrolled
                    ? "bg-[#FDFBF7]/90 backdrop-blur-md shadow-xs border-b border-[#EFECE6]"
                    : "bg-[#FDFBF7] border-b border-[#F0ECE4]"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-18">
                    {/* Brand Logo */}
                    <NextLink
                        href="/"
                        className="flex items-center gap-2.5 group"
                    >
                        <SaloniqueMark className="shadow-xs transition-transform group-hover:scale-105" />
                        <div className="flex flex-col">
                            <span className="text-xl font-serif font-medium tracking-tight text-[#1A1715]">
                                Salonique
                            </span>
                            <span className="text-[10px] uppercase tracking-widest text-[#9E8265] font-semibold -mt-1">
                                Boutique & Spa
                            </span>
                        </div>
                    </NextLink>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden lg:flex items-center gap-1 lg:gap-2">
                        <NextLink
                            href="/services"
                            className={`px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
                                pathname === "/services"
                                    ? "text-[#1A1715] bg-[#F2EDE4] font-semibold"
                                    : "text-neutral-600 hover:text-[#1A1715] hover:bg-[#F7F3EC]"
                            }`}
                        >
                            Explore Services
                        </NextLink>

                        {/* Categories Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                render={
                                    <Button
                                        variant="ghost"
                                        className="rounded-full px-3.5 py-2 text-sm font-medium text-neutral-600 hover:bg-[#F7F3EC] hover:text-[#1A1715] data-popup-open:bg-[#F2EDE4] data-popup-open:text-[#1A1715]"
                                    />
                                }
                            >
                                <span>Categories</span>
                                <ChevronDown className="size-3.5" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="start"
                                className="w-56 border-[#EBE5DA] bg-[#FAF7F2]"
                            >
                                {categories.map((cat) => (
                                    <DropdownMenuItem
                                        key={cat.name}
                                        render={<NextLink href={cat.href} />}
                                        className="justify-between rounded-xl text-neutral-700 focus:bg-[#EFE9DE] focus:text-[#1A1715]"
                                    >
                                        <span>{cat.name}</span>
                                        <ArrowRight className="size-3.5 text-neutral-400" />
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <NextLink
                            href="/help"
                            className="px-3.5 py-2 rounded-full text-sm font-medium text-neutral-600 hover:text-[#1A1715] hover:bg-[#F7F3EC] transition-colors"
                        >
                            Help & Support
                        </NextLink>
                    </nav>

                    {/* Right Action Controls */}
                    <div className="hidden lg:flex items-center gap-3">
                        {isAuthenticated && user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger
                                    render={
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="size-11 rounded-full bg-white p-1 hover:bg-neutral-50 hover:shadow-xs"
                                            aria-label={`Open ${user.name}'s profile menu`}
                                        />
                                    }
                                >
                                    <Avatar className="size-9 border border-neutral-200">
                                        <AvatarImage
                                            src={user.avatar || undefined}
                                            alt={user.name}
                                        />
                                        <AvatarFallback>
                                            {user.name
                                                .split(/\s+/)
                                                .slice(0, 2)
                                                .map((part) => part[0])
                                                .join("")
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-64 rounded-2xl border-neutral-100 bg-white p-2"
                                >
                                    <div className="px-3 py-2.5">
                                        <p className="text-sm font-semibold text-neutral-900">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-neutral-500 truncate">
                                            {user.email}
                                        </p>
                                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-100 text-neutral-800">
                                            {user.role === "admin"
                                                ? "Master Admin"
                                                : "Verified Customer"}
                                        </span>
                                    </div>

                                    {user.role === "admin" && (
                                        <DropdownMenuItem
                                            render={<NextLink href="/admin" />}
                                            className="rounded-xl bg-neutral-50 font-semibold text-neutral-900"
                                        >
                                            <ShieldCheck className="size-4 text-emerald-700" />
                                            <span>Admin Console</span>
                                        </DropdownMenuItem>
                                    )}

                                    {user.role === "customer" && (
                                        <>
                                            <DropdownMenuItem
                                                render={
                                                    <NextLink href="/dashboard/appointments" />
                                                }
                                                className="rounded-xl"
                                            >
                                                <Calendar className="size-4 text-neutral-500" />
                                                <span>My Appointments</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                render={
                                                    <NextLink href="/dashboard" />
                                                }
                                                className="rounded-xl"
                                            >
                                                <LayoutDashboard className="size-4 text-neutral-500" />
                                                <span>Customer Dashboard</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                render={
                                                    <NextLink href="/dashboard/profile" />
                                                }
                                                className="rounded-xl"
                                            >
                                                <UserIcon className="size-4 text-neutral-500" />
                                                <span>Profile & Settings</span>
                                            </DropdownMenuItem>
                                        </>
                                    )}

                                    <DropdownMenuSeparator className="my-1" />
                                    <DropdownMenuItem
                                        onClick={logout}
                                        className="rounded-xl text-rose-600 focus:bg-rose-50 focus:text-rose-600"
                                    >
                                        <LogOut className="size-4 text-rose-500" />
                                        <span>Sign Out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center gap-2">
                                <NextLink
                                    href="/sign-in"
                                    className="px-4 py-2 rounded-full text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                                >
                                    Log in
                                </NextLink>
                                <NextLink
                                    href="/sign-up"
                                    className="px-5 py-2.5 rounded-full text-sm font-semibold bg-neutral-900 text-white hover:bg-black shadow-xs transition-colors"
                                >
                                    Sign up
                                </NextLink>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex lg:hidden items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="size-10 rounded-full text-neutral-700 hover:bg-neutral-100"
                            aria-label="Toggle navigation menu"
                            aria-expanded={mobileMenuOpen}
                            aria-controls="site-mobile-navigation"
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

            {/* Mobile Drawer */}
            {mobileMenuOpen && (
                <div
                    id="site-mobile-navigation"
                    className="max-h-[calc(100dvh-4.5rem)] space-y-4 overflow-y-auto overscroll-contain border-t border-neutral-200 bg-white px-4 pt-3 pb-6 animate-in slide-in-from-top duration-200 lg:hidden"
                >
                    {isAuthenticated && user && (
                        <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
                            <Image
                                src={user.avatar}
                                alt={user.name}
                                width={40}
                                height={40}
                                unoptimized
                                className="w-10 h-10 rounded-full object-cover border border-neutral-200"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-neutral-900 truncate">
                                    {user.name}
                                </p>
                                <p className="text-xs text-neutral-500 truncate">
                                    {user.email}
                                </p>
                            </div>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-neutral-900 text-white">
                                {user.role}
                            </span>
                        </div>
                    )}

                    <div className="space-y-1">
                        <NextLink
                            href="/services"
                            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-base font-medium text-neutral-800 hover:bg-neutral-100"
                        >
                            <span>Explore Services</span>
                            <ArrowRight className="w-4 h-4 text-neutral-400" />
                        </NextLink>

                        <div className="pt-2 pb-1 px-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                            Popular Categories
                        </div>
                        <div className="grid grid-cols-2 gap-1 px-1">
                            {categories.map((cat) => (
                                <NextLink
                                    key={cat.name}
                                    href={cat.href}
                                    className="px-3 py-2 rounded-lg text-sm text-neutral-600 hover:bg-neutral-100"
                                >
                                    {cat.name}
                                </NextLink>
                            ))}
                        </div>

                        <NextLink
                            href="/help"
                            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-base font-medium text-neutral-800 hover:bg-neutral-100"
                        >
                            <span>Help & Support</span>
                            <HelpCircle className="w-4 h-4 text-neutral-400" />
                        </NextLink>

                        {isAuthenticated ? (
                            <>
                                <div className="pt-2 pb-1 px-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                                    Account
                                </div>
                                {user?.role === "admin" && (
                                    <NextLink
                                        href="/admin"
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200"
                                    >
                                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                                        <span>Admin Console</span>
                                    </NextLink>
                                )}
                                {user?.role === "customer" && (
                                    <>
                                        <NextLink
                                            href="/dashboard/appointments"
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-800 hover:bg-neutral-100"
                                        >
                                            <Calendar className="w-4 h-4 text-neutral-500" />
                                            <span>My Appointments</span>
                                        </NextLink>
                                        <NextLink
                                            href="/dashboard"
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-800 hover:bg-neutral-100"
                                        >
                                            <LayoutDashboard className="w-4 h-4 text-neutral-500" />
                                            <span>Customer Dashboard</span>
                                        </NextLink>
                                        <NextLink
                                            href="/dashboard/profile"
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-800 hover:bg-neutral-100"
                                        >
                                            <UserIcon className="w-4 h-4 text-neutral-500" />
                                            <span>Profile & Settings</span>
                                        </NextLink>
                                    </>
                                )}
                                <Button
                                    variant="ghost"
                                    onClick={logout}
                                    className="w-full justify-start gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50"
                                >
                                    <LogOut className="w-4 h-4 text-rose-500" />
                                    <span>Sign Out</span>
                                </Button>
                            </>
                        ) : (
                            <div className="pt-4 flex flex-col gap-2">
                                <NextLink
                                    href="/sign-in"
                                    className="w-full py-2.5 text-center rounded-xl border border-neutral-300 font-medium text-neutral-800 hover:bg-neutral-50"
                                >
                                    Log in
                                </NextLink>
                                <NextLink
                                    href="/sign-up"
                                    className="w-full py-2.5 text-center rounded-xl bg-neutral-900 text-white font-semibold hover:bg-black"
                                >
                                    Sign up
                                </NextLink>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
