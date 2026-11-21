import React from "react";
import { CalendarCheck2, ShieldCheck, Clock, CreditCard, Sparkles } from "lucide-react";

export function TrustSection() {
  const pillars = [
    {
      icon: CalendarCheck2,
      title: "Easy Online Booking",
      description:
        "Book appointments 24/7 without endless phone tags. Select your date, preferred specialist, and ideal time slot in seconds.",
    },
    {
      icon: ShieldCheck,
      title: "Trusted Beauty Professionals",
      description:
        "Every salon, stylist, and aesthetician on Salonique is verified for professional licensing, sanitation standards, and quality reviews.",
    },
    {
      icon: Clock,
      title: "Convenient Management",
      description:
        "Reschedule, review past appointments, or cancel pending bookings with a single tap in your dedicated customer dashboard.",
    },
    {
      icon: CreditCard,
      title: "Secure Online Payments",
      description:
        "Pay seamlessly with credit card, debit, or digital wallets via Stripe-secured checkout with automated receipts.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
            <span>The Salonique Advantage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            Why Book with Salonique?
          </h2>
          <p className="text-neutral-500 text-base mt-2">
            Designed for beauty enthusiasts who value premium service, verified talent, and a friction-free booking journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="p-6 rounded-2xl border border-neutral-100 bg-neutral-50/50 hover:bg-white hover:border-neutral-200 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-neutral-200/80 flex items-center justify-center text-neutral-900 mb-5 shadow-xs group-hover:scale-105 group-hover:bg-neutral-900 group-hover:text-white transition-all">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">
                  {pillar.title}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
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

