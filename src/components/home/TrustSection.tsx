import React from "react";
import { Search, ClipboardList, CalendarCheck2 } from "lucide-react";

export function TrustSection() {
    const pillars = [
        {
            icon: Search,
            title: "Find your fit",
            description:
                "Browse by service, neighborhood, and specialist to find the right option for you.",
        },
        {
            icon: ClipboardList,
            title: "Know what to expect",
            description:
                "See service details, duration, location, and price before you request a booking.",
        },
        {
            icon: CalendarCheck2,
            title: "Keep plans in one place",
            description:
                "Review appointment status and manage your bookings from your customer dashboard.",
        },
    ];

    return (
        <section className="bg-[#FAF7F2] py-20 border-t border-[#EFECE6]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12 max-w-2xl">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9E8265]">
                        From search to appointment
                    </div>
                    <h2 className="text-3xl font-serif font-normal tracking-tight text-[#1A1715] sm:text-4xl">
                        Booking, without the back and forth.
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600 sm:text-base font-light">
                        The details you need, with a refined and simpler way to
                        plan your next visit.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 border-t border-[#E5DFD5] md:grid-cols-3 md:gap-10">
                    {pillars.map((pillar) => {
                        const Icon = pillar.icon;
                        return (
                            <div key={pillar.title} className="pt-6 group">
                                <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-[#F3EFE9] text-[#7A5C3E] border border-[#E8DFD3] transition-transform duration-300 group-hover:scale-105">
                                    <Icon className="size-4" />
                                </div>
                                <h3 className="mb-2 text-base font-medium text-[#1A1715]">
                                    {pillar.title}
                                </h3>
                                <p className="max-w-sm text-sm leading-relaxed text-neutral-600 font-light">
                                    {pillar.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
