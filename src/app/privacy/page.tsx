import React from "react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { createPageMetadata } from "@/lib/site-config";

export const metadata = createPageMetadata(
    "Privacy Policy",
    "Read how Salonique handles account, contact, and appointment information when you use the salon booking platform.",
    "/privacy",
);

export default function PrivacyPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar />
            <main className="flex-1 max-w-4xl mx-auto px-4 py-16 space-y-6">
                <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
                    Privacy Policy
                </h1>
                <p className="text-sm text-neutral-500">
                    Last updated: November 2026
                </p>
                <div className="prose prose-neutral text-sm text-neutral-700 space-y-4">
                    <p>
                        At Salonique, your privacy and data security are our top
                        priority. This Privacy Policy describes how we collect,
                        use, and protect your information when booking beauty
                        services.
                    </p>
                    <h2 className="text-lg font-bold text-neutral-900 pt-2">
                        Information We Collect
                    </h2>
                    <p>
                        We collect personal details such as your name, email
                        address, phone number, and appointment preferences
                        required to fulfill your booking request with your
                        selected beauty provider.
                    </p>
                    <h2 className="text-lg font-bold text-neutral-900 pt-2">
                        Data Protection
                    </h2>
                    <p>
                        All information is encrypted in transit using
                        industry-standard TLS protocols. We never sell your
                        personal contact information to third-party marketers.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
