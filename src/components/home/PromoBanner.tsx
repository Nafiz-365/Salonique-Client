import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Calendar } from "lucide-react";

export function PromoBanner() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-neutral-900 text-white overflow-hidden p-8 sm:p-12 lg:p-16">
          {/* Subtle Radial Glow */}
          <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-neutral-800 rounded-full blur-3xl opacity-50 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-rose-300" />
                <span>The Modern Way to Book Beauty</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                Never wait on hold for a salon chair again.
              </h2>

              <p className="text-neutral-300 text-base sm:text-lg leading-relaxed max-w-lg">
                Explore real-time calendar availability, choose your favorite specialists, and enjoy transparent pricing with zero booking fees.
              </p>

              {/* Bullet perks */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm text-neutral-300">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span>Instant appointment confirmation in seconds</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-300">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span>Free cancellation up to 24 hours prior to appointment</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  href="/services"
                  className="px-8 py-3.5 rounded-full bg-white text-neutral-900 hover:bg-neutral-100 font-bold text-sm flex items-center gap-2 shadow-lg transition-all"
                >
                  <span>Book an Experience</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/sign-up"
                  className="px-6 py-3.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-sm border border-neutral-700 transition-colors"
                >
                  Create Free Account
                </Link>
              </div>
            </div>

            {/* Right Visual Card */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-sm rounded-2xl bg-white/10 backdrop-blur-md p-6 border border-white/20 shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-white">
                      <Sparkles className="w-5 h-5 text-rose-300" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400">Next Appointment</p>
                      <p className="text-sm font-bold text-white">Signature Balayage</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Confirmed
                  </span>
                </div>

                <div className="py-4 space-y-2 text-xs text-neutral-300">
                  <div className="flex justify-between">
                    <span>Date & Time:</span>
                    <span className="font-semibold text-white">Tomorrow • 10:00 AM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Specialist:</span>
                    <span className="font-semibold text-white">Elena Rostova</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="font-semibold text-white">SoHo, New York</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Total</span>
                    <span className="text-lg font-bold text-white">$185.00</span>
                  </div>
                  <span className="text-xs font-semibold text-rose-300 flex items-center gap-1">
                    Manage in Dashboard
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

