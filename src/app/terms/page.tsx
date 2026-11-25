import React from "react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { createPageMetadata } from "@/lib/site-config";

export const metadata = createPageMetadata(
    "Terms of Service",
    "Review the terms for using Salonique to discover salon services and request appointments.",
    "/terms",
);

export default function TermsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar />
            <main className="flex-1 max-w-4xl mx-auto px-4 py-16 space-y-6">
                <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
                    Terms of Service
                </h1>
                <p className="text-sm text-neutral-500">
                    Last updated: November 2026
                </p>
                <div className="prose prose-neutral text-sm text-neutral-700 space-y-4">
                    <p>
                        Welcome to Salonique. By accessing or using our website,
                        services, and appointment booking platform, you agree to
                        be bound by these Terms of Service.
                    </p>
                    <h2 className="text-lg font-bold text-neutral-900 pt-2">
                        1. Booking & Cancellations
                    </h2>
                    <p>
                        Appointments can be reserved directly online. Free
                        cancellation is permitted up to 24 hours prior to the
                        scheduled appointment start time. Late cancellations or
                        no-shows may incur fees determined by the individual
                        salon policy.
                    </p>
                    <h2 className="text-lg font-bold text-neutral-900 pt-2">
                        2. Payment & Transactions
                    </h2>
                    <p>
                        All electronic transactions are processed securely
                        through Stripe. Salonique does not store complete
                        payment card credentials on its servers.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
