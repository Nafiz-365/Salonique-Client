"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";

export function PortalSidebarLink({
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
                className="h-10 rounded-lg px-3 text-neutral-600 hover:bg-[#F4F1EC] hover:text-[#1A1715] data-active:bg-[#1A1715] data-active:text-white"
            >
                <Icon />
                <span>{label}</span>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}
