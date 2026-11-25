import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
    SITE_DEFAULT_TITLE,
    SITE_DESCRIPTION,
    SITE_NAME,
    siteUrl,
} from "@/lib/site-config";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: siteUrl,
    title: {
        default: SITE_DEFAULT_TITLE,
        template: "%s | Salonique",
    },
    description: SITE_DESCRIPTION,
    applicationName: SITE_NAME,
    openGraph: {
        type: "website",
        siteName: SITE_NAME,
        locale: "en_US",
        title: SITE_DEFAULT_TITLE,
        description: SITE_DESCRIPTION,
        images: ["/opengraph-image"],
    },
    twitter: {
        card: "summary_large_image",
        title: SITE_DEFAULT_TITLE,
        description: SITE_DESCRIPTION,
        images: ["/opengraph-image"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            data-scroll-behavior="smooth"
            suppressHydrationWarning
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
        >
            <body
                suppressHydrationWarning
                className="min-h-full flex flex-col bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white"
            >
                <TooltipProvider>
                    <AuthProvider>
                        {children}
                        <Toaster
                            position="top-right"
                            richColors
                            closeButton
                        />
                    </AuthProvider>
                </TooltipProvider>
            </body>
        </html>
    );
}
