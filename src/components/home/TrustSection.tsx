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
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
            From search to appointment
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
            Booking, without the back and forth.
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600 sm:text-base">
            The details you need, with a simpler way to plan your next visit.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 border-t border-neutral-200 md:grid-cols-3 md:gap-10">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="pt-6"
              >
                <div className="mb-4 flex size-9 items-center justify-center rounded-full bg-[#f7eeeb] text-[#8f5655]">
                  <Icon className="size-4" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-neutral-900">
                  {pillar.title}
                </h3>
                <p className="max-w-sm text-sm leading-relaxed text-neutral-600">
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

