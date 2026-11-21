"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ServiceCard } from "@/components/services/ServiceCard";
import { Service } from "@/lib/types";
import { fetchFeaturedServices, ApiService } from "@/lib/server-api";
import { ArrowRight, Sparkles } from "lucide-react";

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
    fetchFeaturedServices()
      .then((data) => setServices(data.map(toService)))
      .catch(() => {
        setServices([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = services
    .filter((s) => selectedFilter === "All" || s.category === selectedFilter)
    .slice(0, 6);

  return (
    <section className="py-16 bg-neutral-50/60 border-y border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
              <span>Curated Selection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Featured Beauty & Wellness Services
            </h2>
            <p className="text-neutral-500 text-sm mt-1 max-w-xl">
              Hand-picked treatments with verified 5-star ratings, transparent pricing, and instant booking availability.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-neutral-900 hover:text-black group self-start md:self-auto"
          >
            <span>Explore all services</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedFilter === cat
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-3xl border border-neutral-200 overflow-hidden animate-pulse">
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

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white hover:bg-neutral-50 text-neutral-900 font-bold text-sm border border-neutral-200 shadow-sm hover:shadow transition-all"
          >
            <span>Browse All Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
