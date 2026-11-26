"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ServiceCard } from "@/components/services/ServiceCard";
import { Service } from "@/lib/types";
import {
    fetchFeaturedServices,
    fetchServices,
    ApiService,
} from "@/lib/server-api";
import { mapApiServiceToService } from "@/lib/service";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FeaturedServices() {
    const [selectedFilter, setSelectedFilter] = useState("All");
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasLoadError, setHasLoadError] = useState(false);

    const categories = ["All", "Hair", "Nails", "Facial", "Massage", "Spa"];
    const servicesRailClass =
        "hide-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3";
    const serviceCardItemClass =
        "w-[min(86vw,340px)] shrink-0 snap-start sm:w-auto";

    useEffect(() => {
        let active = true;
        const loadServices = async () => {
            const [featuredResult, allResult] = await Promise.allSettled([
                fetchFeaturedServices(),
                fetchServices({ limit: 12 }),
            ]);
            if (!active) return;

            if (
                featuredResult.status === "rejected" &&
                allResult.status === "rejected"
            ) {
                console.error(
                    "Failed to load featured and active services.",
                    featuredResult.reason,
                    allResult.reason,
                );
                setServices([]);
                setHasLoadError(true);
                return;
            }

            if (featuredResult.status === "rejected") {
                console.error(
                    "Failed to load featured services.",
                    featuredResult.reason,
                );
            }
            if (allResult.status === "rejected") {
                console.error(
                    "Failed to load active services.",
                    allResult.reason,
                );
            }

            const featured =
                featuredResult.status === "fulfilled"
                    ? featuredResult.value
                    : [];
            const allServices =
                allResult.status === "fulfilled"
                    ? allResult.value.services
                    : [];
            const merged: ApiService[] = featured.filter(
                (service) => service.isActive !== false,
            );

            for (const service of allServices) {
                if (
                    service.isActive !== false &&
                    !merged.some(
                        (featuredService) =>
                            featuredService._id === service._id,
                    )
                ) {
                    merged.push(service);
                }
                if (merged.length >= 6) break;
            }
            setServices(merged.map(mapApiServiceToService));
        };

        void loadServices()
            .catch((error: unknown) => {
                console.error("Failed to prepare featured services.", error);
                if (!active) return;
                setServices([]);
                setHasLoadError(true);
            })
            .finally(() => {
                if (active) setIsLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    const filtered = services
        .filter(
            (s) => selectedFilter === "All" || s.category === selectedFilter,
        )
        .slice(0, 6);

    return (
        <section className="border-t border-[#EFECE6] bg-[#FAF7F2] py-12 sm:py-16 lg:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mb-6 flex flex-col justify-between gap-3 sm:mb-10 sm:gap-4 md:flex-row md:items-end">
                    <div>
                        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9E8265]">
                            Handcrafted Offerings
                        </div>
                        <h2 className="text-2xl font-serif font-normal tracking-tight text-[#1A1715] sm:text-3xl lg:text-4xl">
                            Make time for feeling good.
                        </h2>
                        <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-600 font-light">
                            Compare services, prices, and durations to find the
                            right appointment for you.
                        </p>
                    </div>
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#7A5C3E] hover:text-[#5A4027] group self-start md:self-auto transition-colors"
                    >
                        <span>View all services</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Category Filter Pills */}
                <div className="hide-scrollbar mb-4 flex items-center gap-2 overflow-x-auto pb-3 sm:mb-6 sm:pb-4">
                    {categories.map((cat) => (
                        <Button
                            variant={
                                selectedFilter === cat ? "default" : "outline"
                            }
                            size="sm"
                            key={cat}
                            type="button"
                            onClick={() => setSelectedFilter(cat)}
                            className={`h-9 rounded-full px-4 text-xs font-semibold whitespace-nowrap transition-all ${
                                selectedFilter === cat
                                    ? "bg-neutral-900 text-white shadow-xs"
                                    : "bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200"
                            }`}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>

                {/* Grid */}
                {isLoading ? (
                    <div
                        role="region"
                        aria-label="Featured services loading"
                        className={servicesRailClass}
                    >
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className={`${serviceCardItemClass} overflow-hidden rounded-3xl border border-neutral-200 animate-pulse`}
                            >
                                <div className="bg-neutral-100 aspect-4/3" />
                                <div className="p-5 space-y-3">
                                    <div className="h-4 bg-neutral-100 rounded w-3/4" />
                                    <div className="h-3 bg-neutral-100 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : hasLoadError ? (
                    <p
                        role="alert"
                        className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800"
                    >
                        Services are temporarily unavailable. Please try again
                        later.
                    </p>
                ) : filtered.length > 0 ? (
                    <div
                        role="region"
                        aria-label="Featured services"
                        tabIndex={0}
                        className={servicesRailClass}
                    >
                        <span className="sr-only">
                            Swipe horizontally to explore more services.
                        </span>
                        {filtered.map((service) => (
                            <div
                                key={service.id}
                                className={serviceCardItemClass}
                            >
                                <ServiceCard service={service} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-sm text-neutral-600">
                        {services.length > 0
                            ? "No services match this category right now."
                            : "No active services are available right now."}
                    </p>
                )}
            </div>
        </section>
    );
}
