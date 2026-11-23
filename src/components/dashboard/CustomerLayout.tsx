"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Calendar,
    LayoutDashboard,
    Loader2,
    LogOut,
    Menu,
    Sparkles,
    User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";
import { SaloniqueMark } from "@/components/common/SaloniqueMark";
import { useAuth } from "@/context/AuthContext";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

export function CustomerLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isAuthenticated, isLoading, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                toast.error(
                    "Please sign in to access your customer dashboard.",
                );
                router.replace("/sign-in");
            } else if (user?.role === "admin") {
                router.replace("/admin");
            } else if (user?.isBlocked || user?.status === "suspended") {
                toast.error(
                    "Your account has been blocked by administrator. Access restricted.",
                );
                logout();
            }
        }
    }, [
        isLoading,
        isAuthenticated,
        user?.role,
        user?.isBlocked,
        user?.status,
        router,
        logout,
    ]);

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
        <div className="min-h-svh bg-[#FDFBF7]">
            <header className="sticky top-0 z-40 border-b border-[#E8E2D8] bg-[#FDFBF7]/95 backdrop-blur">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between gap-4">
                        <Link
                            href="/"
                            className="flex shrink-0 items-center gap-2.5"
                        >
                            <SaloniqueMark />
                            <span>
                                <span className="block font-serif text-lg font-semibold leading-tight text-[#1A1715]">
                                    Salonique
                                </span>
                                <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#9E8265]">
                                    Your Beauty Account
                                </span>
                            </span>
                        </Link>

                        <div className="flex items-center gap-2">
                            <div className="hidden lg:block">
                                <DropdownMenu>
                            <DropdownMenuTrigger
                                render={
                                    <button
                                        type="button"
                                        aria-label={`Open ${user.name}'s account menu`}
                                        className="rounded-full outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[#9E8265]"
                                    />
                                }
                            >
                                <Avatar className="size-10 border border-[#E8E2D8]">
                                    <AvatarImage
                                        src={user.avatar || undefined}
                                        alt={user.name}
                                    />
                                    <AvatarFallback className="bg-[#F2EDE4] text-xs font-semibold text-[#1A1715]">
                                        {user.name
                                            .trim()
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
                                className="w-64 rounded-2xl border-[#E8E2D8] bg-white p-2"
                            >
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel className="px-3 py-2">
                                        <span className="block truncate text-sm font-semibold text-[#1A1715]">
                                            {user.name}
                                        </span>
                                        <span className="block truncate text-xs font-normal text-neutral-500">
                                            {user.email}
                                        </span>
                                    </DropdownMenuLabel>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <DropdownMenuItem
                                            key={item.href}
                                            render={<Link href={item.href} />}
                                            className="min-h-10 rounded-xl px-3"
                                        >
                                            <Icon className="size-4 text-neutral-500" />
                                            {item.label}
                                        </DropdownMenuItem>
                                    );
                                })}
                                <DropdownMenuItem
                                    render={<Link href="/services" />}
                                    className="min-h-10 rounded-xl px-3"
                                >
                                    <Sparkles className="size-4 text-[#9E8265]" />
                                    Book a Service
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={logout}
                                    variant="destructive"
                                    className="min-h-10 rounded-xl px-3"
                                >
                                    <LogOut className="size-4" />
                                    Sign out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                            </div>

                        <div className="flex items-center gap-2 lg:hidden">
                            <Link
                                href="/dashboard/profile"
                                aria-label="Open Profile & Settings"
                                className="rounded-full outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[#9E8265]"
                            >
                                <Avatar className="size-10 border border-[#E8E2D8]">
                                    <AvatarImage
                                        src={user.avatar || undefined}
                                        alt={user.name}
                                    />
                                    <AvatarFallback className="bg-[#F2EDE4] text-xs font-semibold text-[#1A1715]">
                                        {user.name
                                            .trim()
                                            .split(/\s+/)
                                            .slice(0, 2)
                                            .map((part) => part[0])
                                            .join("")
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </Link>
                            <Sheet
                                open={mobileMenuOpen}
                                onOpenChange={setMobileMenuOpen}
                            >
                                <SheetTrigger
                                    render={
                                        <button
                                            type="button"
                                            aria-label={
                                                mobileMenuOpen
                                                    ? "Close customer navigation"
                                                    : "Open customer navigation"
                                            }
                                            aria-expanded={mobileMenuOpen}
                                            className="inline-flex size-10 items-center justify-center rounded-full border border-[#E8E2D8] text-[#1A1715] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E8265]"
                                        />
                                    }
                                >
                                    <Menu className="size-5" />
                                </SheetTrigger>
                                <SheetContent
                                    side="right"
                                    className="w-[min(85vw,22rem)] border-l border-[#E8E2D8] bg-[#FDFBF7] p-0"
                                >
                                    <SheetHeader className="border-b border-[#E8E2D8] px-5 py-6 pr-14">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="size-11 border border-[#E8E2D8]">
                                                <AvatarImage
                                                    src={user.avatar || undefined}
                                                    alt={user.name}
                                                />
                                                <AvatarFallback className="bg-[#F2EDE4] text-xs font-semibold text-[#1A1715]">
                                                    {user.name
                                                        .trim()
                                                        .split(/\s+/)
                                                        .slice(0, 2)
                                                        .map((part) => part[0])
                                                        .join("")
                                                        .toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <SheetTitle className="truncate text-left text-sm font-semibold text-[#1A1715]">
                                                    {user.name}
                                                </SheetTitle>
                                                <SheetDescription className="truncate text-left text-xs">
                                                    {user.email}
                                                </SheetDescription>
                                            </div>
                                        </div>
                                    </SheetHeader>

                                    <nav
                                        aria-label="Customer navigation"
                                        className="grid gap-1 px-4 py-4"
                                    >
                                        {navItems.map((item) => {
                                            const Icon = item.icon;
                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    aria-current={
                                                        item.active
                                                            ? "page"
                                                            : undefined
                                                    }
                                                    onClick={() =>
                                                        setMobileMenuOpen(false)
                                                    }
                                                    className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium ${
                                                        item.active
                                                            ? "bg-[#1A1715] text-white"
                                                            : "text-neutral-700 hover:bg-[#F2EDE4]"
                                                    }`}
                                                >
                                                    <Icon className="size-4" />
                                                    {item.label}
                                                </Link>
                                            );
                                        })}
                                        <Link
                                            href="/services"
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                            className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-neutral-700 hover:bg-[#F2EDE4]"
                                        >
                                            <Sparkles className="size-4" />
                                            Book a Service
                                        </Link>
                                    </nav>

                                    <div className="mt-auto border-t border-[#E8E2D8] px-4 py-4">
                                        <button
                                            type="button"
                                            onClick={logout}
                                            className="inline-flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-rose-700 hover:bg-rose-50"
                                        >
                                            <LogOut className="size-4" />
                                            Sign out
                                        </button>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto min-w-0 w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
                {children}
            </main>
        </div>
    );
}
