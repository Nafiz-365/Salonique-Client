"use client";

import React, { useEffect } from "react";
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
    Loader2,
} from "lucide-react";
import Image from "next/image";
import { SaloniqueMark } from "@/components/common/SaloniqueMark";
import { PortalSidebarLink } from "@/components/common/PortalSidebarLink";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";

export function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isAuthenticated, isLoading, logout } = useAuth();
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
    const activeLabel =
        menuItems.find((item) => item.active)?.label ?? "Admin Console";

    return (
        <SidebarProvider className="min-h-svh bg-[#FDFBF7]">
            <Sidebar
                side="left"
                mobileSide="right"
                variant="sidebar"
                collapsible="icon"
                className="border-r border-[#E8E2D8] bg-white"
            >
                <SidebarHeader className="border-b border-[#F0ECE4] p-4">
                    <Link
                        href="/admin"
                        className="flex min-w-0 items-center gap-3 group-data-[collapsible=icon]:justify-center"
                    >
                        <SaloniqueMark className="size-9 shrink-0" />
                        <span className="min-w-0 group-data-[collapsible=icon]:hidden">
                            <span className="block font-serif text-base font-semibold leading-tight text-[#1A1715]">
                                Salonique
                            </span>
                            <span className="mt-1 flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-[#9E8265]">
                                <ShieldCheck className="size-3" />
                                Admin Console
                            </span>
                        </span>
                    </Link>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel className="px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                            Workspace
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu className="gap-1">
                                {menuItems.map((item) => (
                                    <PortalSidebarLink
                                        key={item.href}
                                        href={item.href}
                                        label={item.label}
                                        icon={item.icon}
                                        active={item.active}
                                    />
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter className="border-t border-[#F0ECE4] p-3 group-data-[collapsible=icon]:p-2">
                    <Link
                        href="/admin/profile"
                        aria-label="Admin profile"
                        title="Admin profile"
                        className="flex min-w-0 items-center gap-2.5 rounded-lg px-1 py-1 transition-colors hover:bg-[#F4F1EC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9E8265] group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
                    >
                        <Image
                            src={
                                user?.avatar ||
                                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"
                            }
                            alt={user?.name || "Admin"}
                            width={32}
                            height={32}
                            unoptimized
                            className="size-8 max-w-none shrink-0 rounded-full object-cover"
                        />
                        <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                            <p className="truncate text-xs font-medium text-[#1A1715]">
                                {user?.name || "Admin"}
                            </p>
                            <p className="truncate text-[10px] text-neutral-500">
                                Administrator
                            </p>
                        </div>
                    </Link>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                onClick={logout}
                                tooltip="Sign out"
                                className="h-9 rounded-lg px-3 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
                            >
                                <LogOut />
                                <span>Sign out</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>

            <SidebarInset className="min-w-0 flex-1 bg-transparent">
                <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-[#E8E2D8] bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
                    <div className="flex min-w-0 items-center gap-3">
                        <SidebarTrigger
                            aria-label="Toggle admin navigation"
                            className="hidden size-9 rounded-lg text-neutral-600 hover:bg-[#F4F1EC] md:flex"
                        />
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#1A1715]">
                                {activeLabel}
                            </p>
                            <p className="hidden text-[11px] text-neutral-500 sm:block">
                                Salonique · Admin workspace
                            </p>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 sm:gap-4">
                        <Link
                            href="/"
                            className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-neutral-600 transition-colors hover:bg-[#F4F1EC] hover:text-[#1A1715] sm:inline-flex"
                        >
                            Marketplace
                            <ExternalLink className="size-3.5" />
                        </Link>
                        <SidebarTrigger
                            aria-label="Toggle admin navigation"
                            className="size-9 rounded-lg text-neutral-600 hover:bg-[#F4F1EC] md:hidden"
                        />
                    </div>
                </header>
                <div className="mx-auto min-w-0 w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
