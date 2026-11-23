"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ServiceCard } from "@/components/services/ServiceCard";
import { Service } from "@/lib/types";
import { fetchFeaturedServices, fetchServices, ApiService } from "@/lib/server-api";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function toService(s: ApiService): Service {
    return {
        id: s._id,
        name: s.name,
        slug: s.slug,
        category: s.category as Service["category"],
        price: s.price,
        duration: s.duration,
        rating: s.rating,
        reviewCount: s.reviewCount,
        description: s.description,
        shortDescription: s.shortDescription,
        image: s.image,
        gallery: s.gallery,
        isActive: s.isActive,
        featured: s.featured,
        popular: s.popular,
        specialist: s.specialist,
        location: s.location,
        included: s.included,
    };
}

export function FeaturedServices() {
    const [selectedFilter, setSelectedFilter] = useState("All");
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const categories = ["All", "Hair", "Nails", "Facial", "Massage", "Spa"];

    useEffect(() => {
        // Requirement: show at least 6 active services on the home page.
        // Start with featured ones, then top up with other active services
        // if the database has fewer than 6 marked as featured.
        Promise.all([
            fetchFeaturedServices().catch(() => [] as ApiService[]),
            fetchServices({ limit: 12 }).catch(() => ({
                services: [] as ApiService[],
                total: 0,
                page: 1,
                totalPages: 0,
            })),
        ])
            .then(([featured, all]) => {
                const merged: ApiService[] = [...featured];
                for (const service of all.services) {
                    if (
                        service.isActive !== false &&
                        !merged.some((s) => s._id === service._id)
                    ) {
                        merged.push(service);
                    }
                    if (merged.length >= 6) break;
                }
                setServices(merged.map(toService));
            })
            .catch(() => {
                setServices([]);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const filtered = services
        .filter(
            (s) => selectedFilter === "All" || s.category === selectedFilter,
        )
        .slice(0, 6);

    return (
        <section className="bg-[#FAF7F2] py-16 sm:py-20 border-t border-[#EFECE6]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9E8265]">
                            Handcrafted Offerings
                        </div>
                        <h2 className="text-3xl font-serif font-normal tracking-tight text-[#1A1715] sm:text-4xl">
                            Make time for feeling good.
                        </h2>
                        <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-600 font-light">
                            Explore bespoke services, compare prices and
                            durations, and find an appointment that elevates
                            your day.
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
                <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 hide-scrollbar">
                    {categories.map((cat) => (
                        <Button
                            variant={selectedFilter === cat ? "default" : "outline"}
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="rounded-3xl border border-neutral-200 overflow-hidden animate-pulse"
                            >
                                <div className="bg-neutral-100 aspect-4/3" />
                                <div className="p-5 space-y-3">
                                    <div className="h-4 bg-neutral-100 rounded w-3/4" />
                                    <div className="h-3 bg-neutral-100 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {filtered.map((service) => (
                            <ServiceCard key={service.id} service={service} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
