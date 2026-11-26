"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { ServiceCard } from "@/components/services/ServiceCard";
import { Service, SERVICE_CATEGORIES } from "@/lib/types";
import { fetchServices } from "@/lib/server-api";
import { mapApiServiceToService } from "@/lib/service";
import { SEARCH_TIME_OPTIONS } from "@/lib/booking";
import { useLocalDateInputValue } from "@/hooks/use-local-date-input";
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

const CATEGORIES = ["All", ...SERVICE_CATEGORIES];

const SORT_OPTIONS = [
    { label: "Recommended", value: "recommended" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Highest Rated", value: "rating" },
    { label: "Duration: Shortest", value: "duration" },
];

function ServicesContent() {
    const searchParams = useSearchParams();
    const searchParamsString = searchParams.toString();
    const requestedCategory = (searchParams.get("category") || "").trim();
    const initialCategory =
        CATEGORIES.find(
            (category) =>
                category.toLowerCase() === requestedCategory.toLowerCase(),
        ) || "All";
    const requestedDate = searchParams.get("date") || "";
    const date = new Date(`${requestedDate}T00:00:00.000Z`);
    const initialDate =
        /^\d{4}-\d{2}-\d{2}$/.test(requestedDate) &&
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === requestedDate
            ? requestedDate
            : "";
    const requestedTime = searchParams.get("time") || "Any time";
    const initialTime =
        initialDate &&
        SEARCH_TIME_OPTIONS.some((option) => option === requestedTime)
            ? requestedTime
            : "Any time";

    return (
        <ServicesBrowser
            key={searchParamsString}
            initialQ={searchParams.get("q") || ""}
            initialCategory={initialCategory}
            initialLocation={searchParams.get("location") || ""}
            initialSort={searchParams.get("sort") || "recommended"}
            initialFeatured={searchParams.get("featured") === "true"}
            initialDate={initialDate}
            initialTime={initialTime}
        />
    );
}

function ServicesBrowser({
    initialQ,
    initialCategory,
    initialLocation,
    initialSort,
    initialFeatured,
    initialDate,
    initialTime,
}: {
    initialQ: string;
    initialCategory: string;
    initialLocation: string;
    initialSort: string;
    initialFeatured: boolean;
    initialDate: string;
    initialTime: string;
}) {
    const router = useRouter();
    const minimumDate = useLocalDateInputValue();

    const [searchQuery, setSearchQuery] = useState(initialQ);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [selectedLocation, setSelectedLocation] = useState(initialLocation);
    const [sortBy, setSortBy] = useState(initialSort);
    const [onlyFeatured, setOnlyFeatured] = useState(initialFeatured);
    const [selectedDate, setSelectedDate] = useState(initialDate);
    const [selectedTime, setSelectedTime] = useState(initialTime);

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
                    date: selectedDate || undefined,
                    time:
                        selectedDate && selectedTime !== "Any time"
                            ? selectedTime
                            : undefined,
                    page: p,
                    limit: 9,
                });

                const mapped = data.services.map(mapApiServiceToService);

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
        [
            searchQuery,
            selectedCategory,
            selectedLocation,
            sortBy,
            onlyFeatured,
            selectedDate,
            selectedTime,
        ],
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
        setSelectedDate("");
        setSelectedTime("Any time");
        router.push("/services");
    };

    const handleCategoryClick = (cat: string) => {
        setSelectedCategory(cat);
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.set("q", searchQuery.trim());
        if (cat !== "All") params.set("category", cat);
        if (selectedLocation.trim())
            params.set("location", selectedLocation.trim());
        if (sortBy !== "recommended") params.set("sort", sortBy);
        if (onlyFeatured) params.set("featured", "true");
        if (selectedDate) params.set("date", selectedDate);
        if (selectedDate && selectedTime !== "Any time")
            params.set("time", selectedTime);
        router.push(`/services?${params.toString()}`);
    };

    const hasFilters =
        searchQuery ||
        selectedCategory !== "All" ||
        selectedLocation ||
        sortBy !== "recommended" ||
        onlyFeatured ||
        selectedDate ||
        selectedTime !== "Any time";

    return (
        <div className="bg-[#FDFBF7] min-h-screen">
            {/* Page Header Banner */}
            <div className="bg-[#FAF7F2] border-b border-[#EFECE6] py-8 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9E8265]">
                            Curated Offerings
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-serif font-normal text-[#1A1715] tracking-tight">
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
                                className={`h-11 rounded-full px-4 text-xs font-medium transition-all sm:h-8 ${
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
            <div className="max-w-7xl mx-auto px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
                {/* Controls Toolbar */}
                <div className="grid min-w-0 grid-cols-2 gap-3 rounded-2xl border border-[#E8E2D8] bg-white p-3 shadow-xs sm:grid-cols-2 sm:gap-4 sm:p-4 xl:grid-cols-5">
                    {/* Search */}
                    <div className="relative col-span-2 w-full min-w-0 sm:col-span-1">
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
                    <div className="relative col-span-2 w-full min-w-0 sm:col-span-1">
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

                    <div className="w-full min-w-0">
                        <label
                            htmlFor="services-date-filter"
                            className="sr-only"
                        >
                            Appointment date
                        </label>
                        <Input
                            id="services-date-filter"
                            type="date"
                            value={selectedDate}
                            min={minimumDate}
                            onChange={(event) => {
                                setSelectedDate(event.target.value);
                                if (!event.target.value) {
                                    setSelectedTime("Any time");
                                }
                            }}
                            className="h-10 w-full rounded-xl bg-neutral-50/50 text-xs font-medium sm:text-sm"
                        />
                    </div>

                    <div className="w-full min-w-0">
                        <Select
                            value={selectedTime}
                            onValueChange={(value) => {
                                if (value) setSelectedTime(value);
                            }}
                            disabled={!selectedDate}
                        >
                            <SelectTrigger
                                aria-label="Filter by appointment time"
                                className="h-10 w-full rounded-xl px-3 text-xs font-semibold sm:text-sm"
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {SEARCH_TIME_OPTIONS.map((time) => (
                                    <SelectItem key={time} value={time}>
                                        {time}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Sort + Reset */}
                    <div className="col-span-2 flex w-full min-w-0 items-center justify-end gap-3 sm:col-span-1">
                        <div className="relative w-full min-w-0">
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
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-sm text-neutral-600 sm:mb-6">
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
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton
                                key={i}
                                className="aspect-4/3 rounded-3xl border border-neutral-200"
                            />
                        ))}
                    </div>
                ) : services.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
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
                    <div className="mx-auto max-w-md space-y-4 rounded-xl border border-[#E8E2D8] bg-white px-5 py-12 text-center shadow-xs">
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
