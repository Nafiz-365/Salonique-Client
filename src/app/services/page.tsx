"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { ServiceCard } from "@/components/services/ServiceCard";
import { Service } from "@/lib/types";
import { fetchServices, ApiService } from "@/lib/server-api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Search,
    MapPin,
    Sparkles,
    RotateCcw,
    AlertCircle,
    X,
    Loader2,
} from "lucide-react";

const CATEGORIES = [
    "All",
    "Hair",
    "Nails",
    "Facial",
    "Massage",
    "Makeup",
    "Brows & Lashes",
    "Waxing",
    "Spa",
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
    const searchParamsString = searchParams.toString();

    return (
        <ServicesBrowser
            key={searchParamsString}
            initialQ={searchParams.get("q") || ""}
            initialCategory={searchParams.get("category") || "All"}
            initialLocation={searchParams.get("location") || ""}
            initialSort={searchParams.get("sort") || "recommended"}
            initialFeatured={searchParams.get("featured") === "true"}
            searchParamsString={searchParamsString}
        />
    );
}

function ServicesBrowser({
    initialQ,
    initialCategory,
    initialLocation,
    initialSort,
    initialFeatured,
    searchParamsString,
}: {
    initialQ: string;
    initialCategory: string;
    initialLocation: string;
    initialSort: string;
    initialFeatured: boolean;
    searchParamsString: string;
}) {
    const router = useRouter();
    const searchParams = new URLSearchParams(searchParamsString);

    const [searchQuery, setSearchQuery] = useState(initialQ);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [selectedLocation, setSelectedLocation] = useState(initialLocation);
    const [sortBy, setSortBy] = useState(initialSort);
    const [onlyFeatured, setOnlyFeatured] = useState(initialFeatured);

    const [services, setServices] = useState<Service[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
                    category:
                        selectedCategory !== "All"
                            ? selectedCategory
                            : undefined,
                    search: searchQuery.trim() || undefined,
                    location: selectedLocation.trim() || undefined,
                    sort,
                    featured: onlyFeatured || undefined,
                    page: p,
                    limit: 9,
                });

                const mapped = data.services.map(toService);

                setServices(append ? (prev) => [...prev, ...mapped] : mapped);
                setTotal(data.total);
                setPage(data.page);
                setTotalPages(data.totalPages);
            } catch {
                setError(
                    "Could not connect to backend. Please ensure the server is running.",
                );
                setServices([]);
                setTotal(0);
                setPage(1);
                setTotalPages(1);
            } finally {
                setIsLoading(false);
                setIsLoadingMore(false);
            }
        },
        [searchQuery, selectedCategory, selectedLocation, sortBy, onlyFeatured],
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
        searchQuery ||
        selectedCategory !== "All" ||
        selectedLocation ||
        sortBy !== "recommended" ||
        onlyFeatured;

    return (
        <div className="bg-[#FDFBF7] min-h-screen">
            {/* Page Header Banner */}
            <div className="bg-[#FAF7F2] border-b border-[#EFECE6] py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9E8265]">
                            Curated Offerings
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-serif font-normal text-[#1A1715] tracking-tight">
                            {selectedCategory === "All"
                                ? "Discover Salon & Spa Services"
                                : `${selectedCategory} Treatments`}
                        </h1>
                        <p className="text-neutral-600 font-light text-sm sm:text-base mt-2">
                            Book the finest certified stylists, nail artisans,
                            and wellness specialists in your neighborhood.
                        </p>
                    </div>

                    {/* Quick Category Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pt-6 pb-2 hide-scrollbar">
                        {CATEGORIES.map((cat) => (
                            <Button
                                variant={
                                    selectedCategory.toLowerCase() ===
                                    cat.toLowerCase()
                                        ? "default"
                                        : "outline"
                                }
                                size="sm"
                                key={cat}
                                type="button"
                                onClick={() => handleCategoryClick(cat)}
                                className={`h-8 rounded-full px-4 text-xs font-medium transition-all ${
                                    selectedCategory.toLowerCase() ===
                                    cat.toLowerCase()
                                        ? "bg-[#1A1715] text-[#FAF7F2] hover:bg-[#2D2623]"
                                        : "border-[#E5DFD5] bg-white text-neutral-700 hover:bg-[#F7F3EC]"
                                }`}
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Controls Toolbar */}
                <div className="bg-white p-4 rounded-2xl border border-[#EBE5DA] shadow-xs mb-8 flex flex-col md:flex-row items-center gap-4 justify-between">
                    {/* Search */}
                    <div className="relative w-full md:w-80">
                        <Search className="w-4 h-4 text-[#9E8265] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <Input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filter by treatment or specialist..."
                            className="h-10 w-full rounded-full border-[#EBE5DA] bg-[#FDFBF7] pl-9 pr-8 text-xs font-medium focus-visible:bg-white sm:text-sm"
                        />
                        {searchQuery && (
                            <Button
                                variant="ghost"
                                size="icon"
                                type="button"
                                onClick={() => setSearchQuery("")}
                                aria-label="Clear service search"
                                className="absolute right-1.5 top-1/2 size-7 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                            >
                                <X className="w-3.5 h-3.5" />
                            </Button>
                        )}
                    </div>

                    {/* Location */}
                    <div className="relative w-full md:w-64">
                        <MapPin className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <Input
                            type="text"
                            value={selectedLocation}
                            onChange={(e) =>
                                setSelectedLocation(e.target.value)
                            }
                            placeholder="Location (e.g. SoHo)"
                            className="h-10 w-full rounded-xl bg-neutral-50/50 pl-9 pr-8 text-xs font-medium focus-visible:bg-white sm:text-sm"
                        />
                        {selectedLocation && (
                            <Button
                                variant="ghost"
                                size="icon"
                                type="button"
                                onClick={() => setSelectedLocation("")}
                                aria-label="Clear location filter"
                                className="absolute right-1.5 top-1/2 size-7 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                            >
                                <X className="w-3.5 h-3.5" />
                            </Button>
                        )}
                    </div>

                    {/* Sort + Reset */}
                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                        <div className="relative w-full md:w-48">
                            <Select
                                value={sortBy}
                                onValueChange={(value) => {
                                    if (value) setSortBy(value);
                                }}
                            >
                                <SelectTrigger
                                    aria-label="Sort services"
                                    className="h-10 w-full rounded-xl px-3 text-xs font-semibold sm:text-sm"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {SORT_OPTIONS.map((opt) => (
                                        <SelectItem
                                            key={opt.value}
                                            value={opt.value}
                                        >
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {hasFilters && (
                            <Button
                                variant="outline"
                                size="icon"
                                type="button"
                                onClick={resetFilters}
                                className="size-10 shrink-0 rounded-xl text-neutral-600 hover:text-neutral-900"
                                title="Reset all filters"
                                aria-label="Reset all filters"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Results counter */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6 text-sm text-neutral-600">
                    <div>
                        {isLoading ? (
                            <span className="text-neutral-400">Loading...</span>
                        ) : (
                            <>
                                Showing{" "}
                                <Badge
                                    variant="secondary"
                                    className="font-bold text-neutral-900"
                                >
                                    {services.length}
                                </Badge>{" "}
                                of{" "}
                                <span className="font-bold text-neutral-900">
                                    {total}
                                </span>{" "}
                                results
                            </>
                        )}
                    </div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 cursor-pointer">
                        <Checkbox
                            checked={onlyFeatured}
                            onCheckedChange={(checked) =>
                                setOnlyFeatured(checked === true)
                            }
                            aria-label="Show featured services only"
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
                            <Skeleton
                                key={i}
                                className="aspect-4/3 rounded-3xl border border-neutral-200"
                            />
                        ))}
                    </div>
                ) : services.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {services.map((service) => (
                                <ServiceCard
                                    key={service.id}
                                    service={service}
                                />
                            ))}
                        </div>

                        {/* Load More */}
                        {page < totalPages && (
                            <div className="mt-12 text-center">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    type="button"
                                    onClick={() => loadServices(page + 1, true)}
                                    disabled={isLoadingMore}
                                    className="mx-auto h-11 rounded-full px-8 text-sm font-bold shadow-xs"
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
                                </Button>
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
                            We couldn&apos;t find any services matching your
                            filters. Try clearing your search keyword or
                            switching categories.
                        </p>
                        <Button
                            variant="default"
                            size="lg"
                            type="button"
                            onClick={resetFilters}
                            className="h-10 rounded-full px-6 text-xs font-semibold"
                        >
                            Reset Filters
                        </Button>
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
