"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { ServiceCard } from "@/components/services/ServiceCard";
import { Service } from "@/lib/types";
import { fetchServices, ApiService } from "@/lib/server-api";
import {
  Search,
  MapPin,
  Sparkles,
  RotateCcw,
  AlertCircle,
  X,
  ChevronDown,
  Loader2,
} from "lucide-react";

const CATEGORIES = [
  "All", "Hair", "Nails", "Facial", "Massage",
  "Makeup", "Brows & Lashes", "Waxing", "Spa",
];

const SORT_OPTIONS = [
  { label: "Recommended", value: "recommended" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Highest Rated", value: "rating" },
  { label: "Duration: Shortest", value: "duration" },
];

// Map ApiService → local Service type
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

function ServicesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQ = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "All";
  const initialLocation = searchParams.get("location") || "";
  const initialSort = searchParams.get("sort") || "recommended";

  const [searchQuery, setSearchQuery] = useState(initialQ);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [sortBy, setSortBy] = useState(initialSort);
  const [onlyFeatured, setOnlyFeatured] = useState(false);

  const [services, setServices] = useState<Service[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync category from URL
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
    const q = searchParams.get("q");
    if (q !== null) setSearchQuery(q);
  }, [searchParams]);

  const loadServices = useCallback(
    async (p: number, append = false) => {
      if (p === 1) setIsLoading(true);
      else setIsLoadingMore(true);
      setError(null);

      try {
        const sort =
          sortBy === "price_asc"
            ? "price_asc"
            : sortBy === "price_desc"
            ? "price_desc"
            : sortBy === "rating"
            ? "rating_desc"
            : sortBy === "duration"
            ? "duration_asc"
            : undefined;

        const data = await fetchServices({
          category: selectedCategory !== "All" ? selectedCategory : undefined,
          search: searchQuery.trim() || undefined,
          location: selectedLocation.trim() || undefined,
          sort,
          page: p,
          limit: 9,
        });

        const mapped = data.services.map(toService);
        // Apply featured filter client-side
        const filtered = onlyFeatured ? mapped.filter((s) => s.featured) : mapped;

        setServices(append ? (prev) => [...prev, ...filtered] : filtered);
        setTotal(data.total);
        setPage(data.page);
        setTotalPages(data.totalPages);
      } catch {
        setError("Could not connect to backend. Please ensure the server is running.");
        setServices([]);
        setTotal(0);
        setPage(1);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [searchQuery, selectedCategory, selectedLocation, sortBy, onlyFeatured]
  );

  // Debounce search/filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      loadServices(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [loadServices]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedLocation("");
    setSortBy("recommended");
    setOnlyFeatured(false);
    router.push("/services");
  };

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "All") params.delete("category");
    else params.set("category", cat);
    router.push(`/services?${params.toString()}`);
  };

  const hasFilters =
    searchQuery || selectedCategory !== "All" || selectedLocation || sortBy !== "recommended" || onlyFeatured;

  return (
    <div className="bg-white min-h-screen">
      {/* Page Header Banner */}
      <div className="bg-neutral-50/80 border-b border-neutral-200/70 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
              {selectedCategory === "All"
                ? "Discover Salon & Spa Services"
                : `${selectedCategory} Treatments`}
            </h1>
            <p className="text-neutral-500 text-sm sm:text-base mt-2">
              Book the finest certified stylists, nail technicians, and wellness
              specialists in your area.
            </p>
          </div>

          {/* Quick Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-6 pb-2 hide-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryClick(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? "bg-neutral-900 text-white shadow-xs"
                    : "bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs mb-8 flex flex-col md:flex-row items-center gap-4 justify-between">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by treatment or stylist..."
              className="w-full pl-9 pr-8 py-2 rounded-xl text-xs sm:text-sm font-medium border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Location */}
          <div className="relative w-full md:w-64">
            <MapPin className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              placeholder="Location (e.g. SoHo)"
              className="w-full pl-9 pr-8 py-2 rounded-xl text-xs sm:text-sm font-medium border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
            {selectedLocation && (
              <button
                type="button"
                onClick={() => setSelectedLocation("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort + Reset */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="relative w-full md:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full py-2 pl-3 pr-8 rounded-xl text-xs sm:text-sm font-semibold border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 appearance-none cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {hasFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="p-2 rounded-xl border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors shrink-0"
                title="Reset all filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Results counter */}
        <div className="flex items-center justify-between mb-6 text-sm text-neutral-600">
          <div>
            {isLoading ? (
              <span className="text-neutral-400">Loading...</span>
            ) : (
              <>
                Showing{" "}
                <span className="font-bold text-neutral-900">{services.length}</span>
                {" "}of{" "}
                <span className="font-bold text-neutral-900">{total}</span> results
              </>
            )}
          </div>
          <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyFeatured}
              onChange={(e) => setOnlyFeatured(e.target.checked)}
              className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
            />
            <span>Featured Only</span>
          </label>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-6 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl border border-neutral-200 overflow-hidden animate-pulse"
              >
                <div className="bg-neutral-100 aspect-[4/3]" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-neutral-100 rounded w-3/4" />
                  <div className="h-3 bg-neutral-100 rounded w-1/2" />
                  <div className="h-3 bg-neutral-100 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : services.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>

            {/* Load More */}
            {page < totalPages && (
              <div className="mt-12 text-center">
                <button
                  type="button"
                  onClick={() => loadServices(page + 1, true)}
                  disabled={isLoadingMore}
                  className="px-8 py-3 rounded-full bg-white border border-neutral-300 hover:border-neutral-900 font-bold text-sm text-neutral-900 transition-all shadow-xs disabled:opacity-60 flex items-center gap-2 mx-auto"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-rose-400" />
                      Load More Services
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="py-20 text-center max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">
              No services matched your search
            </h3>
            <p className="text-sm text-neutral-500">
              We couldn&apos;t find any services matching your filters. Try clearing
              your search keyword or switching categories.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="px-6 py-2.5 rounded-full bg-neutral-900 text-white text-xs font-semibold hover:bg-black transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="py-20 text-center text-sm text-neutral-500">
              Loading service catalog...
            </div>
          }
        >
          <ServicesContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
