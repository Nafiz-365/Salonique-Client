"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Search,
    MapPin,
    Calendar as CalendarIcon,
    ChevronDown,
    X,
    Check,
    ArrowRight,
} from "lucide-react";
import { fetchServices } from "@/lib/server-api";
import { useLocalDateInputValue } from "@/hooks/use-local-date-input";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SEARCH_TIME_OPTIONS } from "@/lib/booking";
const POPULAR_LOCATIONS = [
    "All Locations",
    "SoHo, New York",
    "Tribeca, New York",
    "Upper East Side, New York",
    "Flatiron District, New York",
    "Greenwich Village, New York",
    "DUMBO, Brooklyn",
];

export function HeroSearch() {
    const router = useRouter();

    const [query, setQuery] = useState("");
    const [location, setLocation] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("Any time");
    const minimumDate = useLocalDateInputValue();

    // Dropdown states
    const [queryOpen, setQueryOpen] = useState(false);
    const [locationOpen, setLocationOpen] = useState(false);
    const [dateTimeOpen, setDateTimeOpen] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const dropRef = useRef<HTMLDivElement>(null);

    const [suggestions, setSuggestions] = useState<
        { id: string; name: string; category: string; price: number }[]
    >([]);

    useEffect(() => {
        let active = true;
        if (!query.trim()) {
            return;
        }
        fetchServices({ search: query.trim(), limit: 5 })
            .then((data) => {
                if (active && data?.services) {
                    setSuggestions(
                        data.services.map((s) => ({
                            id: s._id,
                            name: s.name,
                            category: s.category,
                            price: s.price,
                        })),
                    );
                }
            })
            .catch(() => {
                if (active) setSuggestions([]);
            });
        return () => {
            active = false;
        };
    }, [query]);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setQueryOpen(false);
                setLocationOpen(false);
                setDateTimeOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // The search bar sits low on the screen, so an open dropdown can be cut
    // off by the bottom of the viewport. Flip it upward when there is not
    // enough room below. Classes are toggled directly on the node (it
    // remounts on every open, so no stale state can persist) — the effect
    // runs while the open animation is still at opacity 0, so the flip is
    // not visible as a jump.
    useEffect(() => {
        const el = dropRef.current;
        if (!el) return;
        if (!(queryOpen || locationOpen || dateTimeOpen)) return;
        const parent = el.parentElement;
        if (!parent) return;
        const rect = parent.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom - 16;
        const spaceAbove = rect.top - 16;
        const flipUp = spaceBelow < el.offsetHeight && spaceAbove > spaceBelow;
        el.classList.toggle("top-full", !flipUp);
        el.classList.toggle("mt-3", !flipUp);
        el.classList.toggle("bottom-full", flipUp);
        el.classList.toggle("mb-3", flipUp);
    }, [queryOpen, locationOpen, dateTimeOpen, suggestions.length]);

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const params = new URLSearchParams();
        if (query.trim()) params.set("q", query.trim());
        if (location && location !== "All Locations")
            params.set("location", location);
        if (selectedDate) params.set("date", selectedDate);
        if (selectedDate && selectedTime !== "Any time")
            params.set("time", selectedTime);

        router.push(`/services?${params.toString()}`);
    };

    return (
        <section className="relative z-20 isolate overflow-visible border-b border-[#2A201E] bg-[#181212] py-12 text-white sm:py-16 lg:py-20">
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=2000&q=80"
                    alt="Luxury Salon Interior"
                    width={2000}
                    height={1000}
                    unoptimized
                    loading="eager"
                    className="h-full w-full object-cover opacity-50 brightness-[.72] saturate-[.75]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(24,18,18,.96)_0%,rgba(24,18,18,.80)_48%,rgba(24,18,18,.45)_100%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(197,168,128,0.15)_0%,transparent_60%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(24,18,18,.85)_0%,transparent_60%)]" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 max-w-3xl space-y-5 sm:mb-10 sm:space-y-6">
                    <div className="inline-flex max-w-full items-center gap-3 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-[#E8D1B5] backdrop-blur-md sm:tracking-[0.25em]">
                        <span className="size-1.5 rounded-full bg-[#E8D1B5] animate-pulse" />
                        <span className="truncate">
                            Salonique · New York Atelier
                        </span>
                    </div>

                    <h1 className="max-w-3xl text-[clamp(2.5rem,10vw,5.75rem)] font-light leading-none tracking-[-0.035em] text-white sm:text-[clamp(3.25rem,8vw,5.75rem)]">
                        A little time{" "}
                        <span className="sm:block font-serif font-normal italic text-[#F3E5D4] underline decoration-[#C5A880]/40 underline-offset-8">
                            just for you.
                        </span>
                    </h1>

                    <p className="max-w-xl text-base leading-relaxed text-[#F3EFEA]/85 font-light sm:text-lg">
                        Find a premier salon or wellness specialist in your
                        neighborhood, compare bespoke services, and reserve with
                        effortless grace.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                        <Button
                            type="button"
                            onClick={() => router.push("/services")}
                            className="h-12 rounded-full bg-[#F3E5D4] px-7 text-sm font-semibold text-[#1A1715] shadow-md transition-all hover:bg-white"
                        >
                            <span>Explore Salon Services</span>
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="max-w-5xl" ref={containerRef}>
                    <form
                        onSubmit={handleSearch}
                        className="relative z-30 flex w-full overflow-visible flex-col items-stretch divide-y divide-[#EFECE6] rounded-2xl border border-[#EBE5DA]/80 bg-white/95 p-2 shadow-2xl shadow-black/25 backdrop-blur-xl sm:rounded-3xl sm:p-3 lg:flex-row lg:items-center lg:divide-x lg:divide-y-0"
                    >
                        {/* 1. Service / Treatment Field */}
                        <div className="relative min-w-0 flex-1 px-3 py-2.5 sm:px-4 lg:py-1">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-0.5">
                                Service / Treatment
                            </label>
                            <div className="flex min-w-0 items-center gap-2">
                                <Search className="w-4 h-4 text-neutral-400 shrink-0" />
                                <Input
                                    type="text"
                                    value={query}
                                    onChange={(e) => {
                                        setQuery(e.target.value);
                                        if (!e.target.value.trim())
                                            setSuggestions([]);
                                        setQueryOpen(true);
                                    }}
                                    onFocus={() => {
                                        setQueryOpen(true);
                                        setLocationOpen(false);
                                        setDateTimeOpen(false);
                                    }}
                                    placeholder="Haircut, Balayage, Nails, Facial..."
                                    className="h-auto min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 py-0 text-sm font-semibold text-neutral-900 shadow-none placeholder:font-normal placeholder:text-neutral-400 focus-visible:ring-0"
                                />
                                {query && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        type="button"
                                        onClick={() => setQuery("")}
                                        aria-label="Clear service search"
                                        className="size-7 shrink-0 rounded-full text-neutral-400 hover:text-neutral-600"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </Button>
                                )}
                            </div>

                            {/* Suggestions Dropdown */}
                            {queryOpen && suggestions.length > 0 && (
                                <div
                                    ref={dropRef}
                                    className="absolute top-full left-0 mt-3 w-full sm:w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-neutral-100 p-3 z-50 animate-in fade-in zoom-in-95"
                                >
                                    <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider px-2 pb-2">
                                        {query.trim()
                                            ? "Matching Services"
                                            : "Popular Services"}
                                    </div>
                                    <div className="space-y-1">
                                        {suggestions.map((item) => (
                                            <Button
                                                variant="ghost"
                                                key={item.id}
                                                type="button"
                                                onClick={() => {
                                                    setQuery(item.name);
                                                    setQueryOpen(false);
                                                }}
                                                className="h-auto w-full justify-between rounded-xl px-2.5 py-2 text-left text-sm font-medium group"
                                            >
                                                <div className="flex flex-col">
                                                    <span className="text-neutral-900 group-hover:font-semibold">
                                                        {item.name}
                                                    </span>
                                                    <span className="text-xs text-neutral-500">
                                                        {item.category}
                                                    </span>
                                                </div>
                                                <span className="text-xs font-semibold text-neutral-900">
                                                    ${item.price}
                                                </span>
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 2. Location Field */}
                        <div className="relative min-w-0 flex-1 px-3 py-2.5 sm:px-4 lg:py-1">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-0.5">
                                Location
                            </label>
                            <div
                                onClick={() => {
                                    // Open-only: clicking the input to edit text
                                    // must not close the list. It closes when a
                                    // neighborhood is picked or on an outside
                                    // click.
                                    setQueryOpen(false);
                                    setDateTimeOpen(false);
                                    setLocationOpen(true);
                                }}
                                className="flex min-w-0 items-center gap-2 cursor-pointer"
                            >
                                <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
                                <Input
                                    type="text"
                                    value={location}
                                    onChange={(e) =>
                                        setLocation(e.target.value)
                                    }
                                    onFocus={() => {
                                        setQueryOpen(false);
                                        setDateTimeOpen(false);
                                        setLocationOpen(true);
                                    }}
                                    placeholder="Where? (e.g. SoHo, New York)"
                                    className="h-auto min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 py-0 text-sm font-semibold text-neutral-900 shadow-none placeholder:font-normal placeholder:text-neutral-400 focus-visible:ring-0"
                                />
                                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                            </div>

                            {/* Location Dropdown */}
                            {locationOpen && (
                                <div
                                    ref={dropRef}
                                    className="absolute top-full left-0 mt-3 w-full sm:w-72 bg-white rounded-2xl shadow-2xl border border-neutral-100 p-2.5 z-50 animate-in fade-in zoom-in-95"
                                >
                                    <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider px-2 pb-2">
                                        Neighborhoods
                                    </div>
                                    <div className="space-y-1">
                                        {POPULAR_LOCATIONS.map((loc) => (
                                            <Button
                                                variant="ghost"
                                                key={loc}
                                                type="button"
                                                onClick={() => {
                                                    setLocation(
                                                        loc === "All Locations"
                                                            ? ""
                                                            : loc,
                                                    );
                                                    setLocationOpen(false);
                                                }}
                                                className="h-auto w-full justify-between rounded-xl px-2.5 py-1.5 text-left text-sm font-medium text-neutral-800"
                                            >
                                                <span>{loc}</span>
                                                {location === loc && (
                                                    <Check className="w-4 h-4 text-neutral-900" />
                                                )}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 3. Date & Time Field */}
                        <div className="relative min-w-0 flex-1 px-3 py-2.5 sm:px-4 lg:py-1">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-0.5">
                                Date & Time
                            </label>
                            {/* Trigger */}
                            <button
                                type="button"
                                aria-label="Choose appointment date and time"
                                aria-haspopup="dialog"
                                aria-expanded={dateTimeOpen}
                                aria-controls="hero-date-time-dialog"
                                onClick={() => {
                                    setDateTimeOpen(!dateTimeOpen);
                                    setQueryOpen(false);
                                    setLocationOpen(false);
                                }}
                                className="flex min-w-0 w-full items-center gap-2 text-left"
                            >
                                <CalendarIcon className="w-4 h-4 text-neutral-400 shrink-0" />
                                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-neutral-900">
                                    {selectedDate
                                        ? `${selectedDate} • ${selectedTime}`
                                        : selectedTime !== "Any time"
                                          ? `Any date • ${selectedTime}`
                                        : "Any date • Any time"}
                                </span>
                                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 shrink-0 ml-auto" />
                            </button>

                            {/* Date & Time Dropdown */}
                            {dateTimeOpen && (
                                <div
                                    ref={dropRef}
                                    id="hero-date-time-dialog"
                                    role="dialog"
                                    aria-label="Appointment date and time"
                                    onKeyDown={(event) => {
                                        if (event.key === "Escape") {
                                            setDateTimeOpen(false);
                                        }
                                    }}
                                    className="absolute top-full right-0 mt-3 w-full sm:w-80 bg-white rounded-2xl shadow-2xl border border-neutral-100 p-4 z-50 animate-in fade-in zoom-in-95"
                                >
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label
                                                htmlFor="hero-appointment-date"
                                                className="block text-xs font-bold uppercase text-neutral-700"
                                            >
                                                Select Appointment Date
                                            </label>
                                            <Input
                                                id="hero-appointment-date"
                                                type="date"
                                                value={selectedDate}
                                                onChange={(e) =>
                                                    {
                                                        setSelectedDate(
                                                            e.target.value,
                                                        );
                                                        if (!e.target.value) {
                                                            setSelectedTime(
                                                                "Any time",
                                                            );
                                                        }
                                                    }
                                                }
                                                min={minimumDate || undefined}
                                                className="h-10 text-sm font-medium text-neutral-900"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <span className="block text-xs font-bold uppercase text-neutral-700">
                                                Preferred Time Slot
                                            </span>
                                            <div className="grid grid-cols-2 gap-1.5">
                                                {SEARCH_TIME_OPTIONS.map((time) => (
                                                    <button
                                                        key={time}
                                                        type="button"
                                                        disabled={
                                                            time !== "Any time" &&
                                                            !selectedDate
                                                        }
                                                        onClick={() =>
                                                            setSelectedTime(
                                                                time,
                                                            )
                                                        }
                                                        className={`rounded-lg px-2 py-1.5 text-left text-xs font-semibold transition-colors ${
                                                            selectedTime ===
                                                            time
                                                                ? "bg-neutral-900 text-white"
                                                                : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
                                                        }`}
                                                    >
                                                        {time}
                                                    </button>
                                                ))}
                                            </div>
                                            {!selectedDate && (
                                                <p className="text-xs text-neutral-500">
                                                    Select a date to choose a time.
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                type="button"
                                                onClick={() => {
                                                    setSelectedDate("");
                                                    setSelectedTime("Any time");
                                                }}
                                                className="text-xs font-semibold text-neutral-500 hover:text-neutral-900"
                                            >
                                                Reset
                                            </Button>
                                            <Button
                                                size="sm"
                                                type="button"
                                                onClick={() =>
                                                    setDateTimeOpen(false)
                                                }
                                                className="rounded-full px-4 text-xs font-semibold"
                                            >
                                                Apply
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Primary Search CTA Button */}
                        <div className="p-1 lg:flex lg:items-center lg:p-1">
                            <Button
                                size="lg"
                                type="submit"
                                className="h-12 w-full rounded-full bg-[#1A1715] px-7 text-sm font-medium text-white shadow-md transition-all hover:bg-[#2D2623] sm:w-full lg:w-auto"
                            >
                                <Search className="w-4 h-4 stroke-2" />
                                <span>Search</span>
                            </Button>
                        </div>
                    </form>

                    {/* Quick Trending Searches */}
                    <div className="mt-4 flex flex-wrap items-center gap-x-1 gap-y-1 text-xs text-white/70">
                        <span className="mr-1 font-medium text-white/80">
                            Try:
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            type="button"
                            onClick={() =>
                                router.push("/services?category=Hair")
                            }
                            className="h-7 rounded-full px-2.5 text-xs text-white/80 hover:bg-white/10 hover:text-white"
                        >
                            Balayage
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            type="button"
                            onClick={() =>
                                router.push("/services?category=Nails")
                            }
                            className="h-7 rounded-full px-2.5 text-xs text-white/80 hover:bg-white/10 hover:text-white"
                        >
                            Russian Manicure
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            type="button"
                            onClick={() =>
                                router.push("/services?category=Facial")
                            }
                            className="h-7 rounded-full px-2.5 text-xs text-white/80 hover:bg-white/10 hover:text-white"
                        >
                            HydraFacial
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            type="button"
                            onClick={() =>
                                router.push("/services?category=Massage")
                            }
                            className="h-7 rounded-full px-2.5 text-xs text-white/80 hover:bg-white/10 hover:text-white"
                        >
                            Hot Stone
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            type="button"
                            onClick={() =>
                                router.push(
                                    "/services?category=Brows %26 Lashes",
                                )
                            }
                            className="h-7 rounded-full px-2.5 text-xs text-white/80 hover:bg-white/10 hover:text-white"
                        >
                            Lash Lift
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
