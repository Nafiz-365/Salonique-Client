"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Calendar,
    ExternalLink,
    LayoutDashboard,
    Loader2,
    LogOut,
    Menu,
    Sparkles,
    User as UserIcon,
    type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { SaloniqueMark } from "@/components/common/SaloniqueMark";
import { useAuth, type AuthUser } from "@/context/AuthContext";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
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
    useSidebar,
} from "@/components/ui/sidebar";

export function CustomerLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isAuthenticated, isLoading, logout } = useAuth();

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
    const activeLabel =
        navItems.find((item) => item.active)?.label ?? "Customer Workspace";

    return (
        <SidebarProvider className="min-h-svh bg-[#FDFBF7]">
            <Sidebar
                side="left"
                mobileSide="right"
                variant="sidebar"
                collapsible="icon"
                className="border-r border-[#E8E2D8] bg-[#FDFBF7]"
            >
                <SidebarHeader className="border-b border-[#E8E2D8] p-4">
                    <Link
                        href="/dashboard"
                        className="flex min-w-0 items-center gap-3 group-data-[collapsible=icon]:justify-center"
                    >
                        <SaloniqueMark className="size-9 shrink-0" />
                        <span className="min-w-0 group-data-[collapsible=icon]:hidden">
                            <span className="block font-serif text-base font-semibold leading-tight text-[#1A1715]">
                                Salonique
                            </span>
                            <span className="mt-1 flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-[#9E8265]">
                                <Sparkles className="size-3" />
                                Customer Workspace
                            </span>
                        </span>
                    </Link>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel className="px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9E8265]">
                            Your account
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu className="gap-1">
                                {navItems.map((item) => (
                                    <CustomerSidebarLink
                                        key={item.href}
                                        href={item.href}
                                        label={item.label}
                                        icon={item.icon}
                                        active={item.active}
                                    />
                                ))}
                                <CustomerSidebarLink
                                    href="/services"
                                    label="Book a Service"
                                    icon={Sparkles}
                                    active={false}
                                />
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter className="border-t border-[#E8E2D8] p-3 group-data-[collapsible=icon]:p-2">
                    <CustomerSidebarAccountLink user={user} />
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
                <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-[#E8E2D8] bg-[#FDFBF7]/95 px-4 backdrop-blur sm:px-6 lg:px-8">
                    <div className="flex min-w-0 items-center gap-3">
                        <SidebarTrigger
                            aria-label="Toggle customer navigation"
                            className="hidden size-9 rounded-lg text-[#765A3D] hover:bg-[#F2EDE4] md:flex"
                        />
                        <div className="hidden min-w-0 md:block">
                            <p className="truncate text-sm font-semibold text-[#1A1715]">
                                {activeLabel}
                            </p>
                            <p className="text-[11px] text-neutral-500">
                                Salonique · Customer workspace
                            </p>
                        </div>
                        <Link
                            href="/"
                            className="flex min-w-0 shrink-0 items-center gap-2.5 md:hidden"
                        >
                            <SaloniqueMark className="size-8 shrink-0" />
                            <span>
                                <span className="block font-serif text-base font-semibold leading-tight text-[#1A1715]">
                                    Salonique
                                </span>
                                <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#9E8265]">
                                    Your Beauty Account
                                </span>
                            </span>
                        </Link>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 sm:gap-4">
                        <Link
                            href="/"
                            className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-neutral-600 transition-colors hover:bg-[#F2EDE4] hover:text-[#1A1715] sm:inline-flex"
                        >
                            Marketplace
                            <ExternalLink className="size-3.5" />
                        </Link>
                        <div className="flex items-center gap-2 md:hidden">
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
                                        {getUserInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </Link>
                            <CustomerMobileSidebarToggle />
                        </div>
                    </div>
                </header>

                <div className="mx-auto min-w-0 w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

function CustomerSidebarLink({
    href,
    label,
    icon: Icon,
    active,
}: {
    href: string;
    label: string;
    icon: LucideIcon;
    active: boolean;
}) {
    const { isMobile, setOpenMobile } = useSidebar();

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                render={
                    <Link
                        href={href}
                        aria-current={active ? "page" : undefined}
                    />
                }
                isActive={active}
                tooltip={label}
                onClick={() => {
                    if (isMobile) setOpenMobile(false);
                }}
                className="h-10 rounded-lg px-3 text-neutral-600 hover:bg-[#F2EDE4] hover:text-[#765A3D] data-active:bg-[#F2EDE4] data-active:font-semibold data-active:text-[#765A3D]"
            >
                <Icon />
                <span>{label}</span>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

function CustomerSidebarAccountLink({ user }: { user: AuthUser }) {
    const { isMobile, setOpenMobile } = useSidebar();

    return (
        <Link
            href="/dashboard/profile"
            aria-label="Customer profile"
            title="Customer profile"
            onClick={() => {
                if (isMobile) setOpenMobile(false);
            }}
            className="flex min-w-0 items-center gap-2.5 rounded-xl bg-[#F4EFE7] px-2 py-2 transition-colors hover:bg-[#EEE6DA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9E8265] group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-full group-data-[collapsible=icon]:p-0"
        >
            <Avatar className="size-8 shrink-0 border border-[#E8E2D8]">
                <AvatarImage
                    src={user.avatar || undefined}
                    alt={user.name}
                />
                <AvatarFallback className="bg-white text-xs font-semibold text-[#765A3D]">
                    {getUserInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                <p className="truncate text-xs font-medium text-[#1A1715]">
                    {user.name}
                </p>
                <p className="truncate text-[10px] text-neutral-500">
                    Customer account
                </p>
            </div>
        </Link>
    );
}

function CustomerMobileSidebarToggle() {
    const { openMobile, setOpenMobile } = useSidebar();

    return (
        <button
            type="button"
            aria-label={
                openMobile
                    ? "Close customer navigation"
                    : "Open customer navigation"
            }
            aria-expanded={openMobile}
            onClick={() => setOpenMobile(!openMobile)}
            className="inline-flex size-10 items-center justify-center rounded-full border border-[#E8E2D8] text-[#1A1715] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E8265]"
        >
            <Menu className="size-5" />
        </button>
    );
}

function getUserInitials(name: string) {
    return (
        name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part[0])
            .join("")
            .toUpperCase() || "C"
    );
}
