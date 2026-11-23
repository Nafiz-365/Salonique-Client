import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Salonique | Salon & Beauty Services",
    description:
        "Discover salon services and book your next beauty and wellness appointment.",
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
