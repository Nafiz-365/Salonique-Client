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
        <section className="border-t border-[#EFECE6] bg-[#FAF7F2] py-12 sm:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 max-w-2xl sm:mb-12">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9E8265]">
                        From search to appointment
                    </div>
                    <h2 className="text-2xl font-serif font-normal tracking-tight text-[#1A1715] sm:text-4xl">
                        Booking, without the back and forth.
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600 sm:text-base font-light">
                        The details you need, with a refined and simpler way to
                        plan your next visit.
                    </p>
                </div>

                <div className="grid grid-cols-1 border-t border-[#E5DFD5] md:grid-cols-3 md:gap-10">
                    {pillars.map((pillar) => {
                        const Icon = pillar.icon;
                        return (
                            <div
                                key={pillar.title}
                                className="group flex items-start gap-4 border-b border-[#E5DFD5] py-4 last:border-b-0 md:block md:border-0 md:pt-6"
                            >
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#E8DFD3] bg-[#F3EFE9] text-[#7A5C3E] transition-transform duration-300 group-hover:scale-105 md:mb-4 md:size-10">
                                    <Icon className="size-4" />
                                </div>
                                <div>
                                    <h3 className="mb-1 text-sm font-medium text-[#1A1715] md:mb-2 md:text-base">
                                        {pillar.title}
                                    </h3>
                                    <p className="max-w-sm text-xs leading-relaxed text-neutral-600 font-light sm:text-sm">
                                        {pillar.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
