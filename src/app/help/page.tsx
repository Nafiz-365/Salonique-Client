"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { ChevronDown, Sparkles, Mail, Phone, Search } from "lucide-react";

const FAQS = [
    {
        q: "How do I book an appointment on Salonique?",
        a: "Booking is simple! Explore our services catalog or search on the homepage by treatment, neighborhood, or date. Once on the service page, select your preferred date and time slot, add any special notes, and click 'Request Appointment'.",
    },
    {
        q: "Can I reschedule or cancel my appointment?",
        a: "Yes! You can reschedule or cancel any pending or confirmed appointment up to 24 hours prior directly from your Customer Dashboard (/dashboard/appointments) with zero cancellation penalties.",
    },
    {
        q: "How does payment work?",
        a: "Salonique uses Stripe for secure 256-bit SSL encrypted online payments. You can pay via credit card, debit, or Apple Pay upon booking or pay in person at the salon counter depending on salon preference.",
    },
    {
        q: "Are the salons and stylists verified?",
        a: "Absolutely. Every partner salon and freelance specialist on Salonique goes through identity verification, licensing checks, and quality reviews before being listed in our marketplace.",
    },
    {
        q: "How can I contact customer support if I have an urgent issue?",
        a: "Our customer care concierge is available 7 days a week via email at support@salonique.com or by calling our hotline at +1 (555) 019-2831.",
    },
];

export default function HelpPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredFaqs = FAQS.filter(
        (f) =>
            f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.a.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
            <Navbar />

            <main className="flex-1 pb-20">
                {/* Hero Banner */}
                <div className="bg-[#FAF7F2] border-b border-[#EFECE6] py-16 text-center">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-[0.2em] bg-white border border-[#EBE5DA] text-[#9E8265] shadow-xs">
                            <Sparkles className="w-3.5 h-3.5 text-[#D8B485]" />
                            <span>Salonique Client Concierge</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-serif font-normal text-[#1A1715] tracking-tight">
                            How can we assist you today?
                        </h1>
                        <p className="text-neutral-600 font-light text-sm sm:text-base max-w-xl mx-auto">
                            Find instant answers to common questions about
                            appointments, refunds, stylist verification, and
                            salon safety.
                        </p>

                        <div className="max-w-md mx-auto pt-4 relative">
                            <Search className="w-4 h-4 text-[#9E8265] absolute left-4 top-1/2 -translate-y-1/2 mt-2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search help topics..."
                                className="w-full pl-11 pr-4 py-3 rounded-full border border-[#EBE5DA] shadow-xs text-sm font-medium text-[#1A1715] focus:outline-none focus:ring-2 focus:ring-[#1A1715] bg-white"
                            />
                        </div>
                    </div>
                </div>

                {/* FAQs */}
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-4">
                    <h2 className="text-2xl font-serif font-normal text-[#1A1715] mb-6">
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-3">
                        {filteredFaqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className="rounded-2xl border border-[#EBE5DA] overflow-hidden bg-white shadow-xs"
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        setOpenIndex(
                                            openIndex === idx ? null : idx,
                                        )
                                    }
                                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-medium text-sm text-[#1A1715] hover:bg-[#FAF7F2] transition-colors"
                                >
                                    <span>{faq.q}</span>
                                    <ChevronDown
                                        className={`w-4 h-4 text-[#9E8265] transition-transform ${
                                            openIndex === idx
                                                ? "rotate-180"
                                                : ""
                                        }`}
                                    />
                                </button>
                                {openIndex === idx && (
                                    <div className="px-5 pb-5 text-xs sm:text-sm text-neutral-600 font-light leading-relaxed border-t border-[#F0ECE4] pt-3">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Contact Support Cards */}
                    <div className="pt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-6 rounded-3xl bg-white border border-[#EBE5DA] space-y-2 shadow-xs">
                            <div className="size-10 rounded-full bg-[#FAF7F2] border border-[#EBE5DA] flex items-center justify-center text-[#7A5C3E]">
                                <Mail className="size-4" />
                            </div>
                            <h3 className="text-sm font-serif font-medium text-[#1A1715]">
                                Email Concierge
                            </h3>
                            <p className="text-xs text-neutral-600 font-light">
                                Send our beauty advisors a message and
                                we&apos;ll reply within 2 business hours.
                            </p>
                            <a
                                href="mailto:support@salonique.com"
                                className="text-xs font-medium text-[#7A5C3E] hover:underline block pt-1"
                            >
                                support@salonique.com
                            </a>
                        </div>

                        <div className="p-6 rounded-3xl bg-white border border-[#EBE5DA] space-y-2 shadow-xs">
                            <div className="size-10 rounded-full bg-[#FAF7F2] border border-[#EBE5DA] flex items-center justify-center text-[#7A5C3E]">
                                <Phone className="size-4" />
                            </div>
                            <h3 className="text-sm font-serif font-medium text-[#1A1715]">
                                Client Hotline
                            </h3>
                            <p className="text-xs text-neutral-600 font-light">
                                Call us toll-free Monday through Sunday, 9:00 AM
                                - 8:00 PM EST.
                            </p>
                            <a
                                href="tel:15550192831"
                                className="text-xs font-medium text-[#7A5C3E] hover:underline block pt-1"
                            >
                                +1 (555) 019-2831
                            </a>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
