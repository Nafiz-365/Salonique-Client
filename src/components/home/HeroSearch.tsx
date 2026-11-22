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
} from "lucide-react";
import { fetchServices } from "@/lib/server-api";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const POPULAR_LOCATIONS = [
  "All Locations",
  "SoHo, New York",
  "Tribeca, New York",
  "Upper East Side, New York",
  "Flatiron District, New York",
  "Greenwich Village, New York",
  "DUMBO, Brooklyn",
];

const TIME_SLOTS = [
  "Any time",
  "Morning (9:00 AM - 12:00 PM)",
  "Afternoon (12:00 PM - 5:00 PM)",
  "Evening (5:00 PM - 9:00 PM)",
  "10:00 AM",
  "11:30 AM",
  "02:00 PM",
  "04:30 PM",
];

export function HeroSearch() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("Any time");

  // Dropdown states
  const [queryOpen, setQueryOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [dateTimeOpen, setDateTimeOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const [suggestions, setSuggestions] = useState<{ id: string; name: string; category: string; price: number }[]>([]);

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
            }))
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
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setQueryOpen(false);
        setLocationOpen(false);
        setDateTimeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (location && location !== "All Locations") params.set("location", location);
    if (selectedDate) params.set("date", selectedDate);
    if (selectedTime && selectedTime !== "Any time") params.set("time", selectedTime);

    router.push(`/services?${params.toString()}`);
  };

  return (
      <section className="relative overflow-hidden bg-[#211b1b] py-14 text-white sm:py-18 lg:py-20">
          <div className="absolute inset-0 z-0">
              <Image
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=2000&q=80"
                  alt="Luxury Salon Interior"
                  width={2000}
                  height={1000}
                  unoptimized
                  loading="eager"
                  className="h-full w-full object-cover opacity-60 brightness-[.78] saturate-[.82]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(24,18,18,.92)_0%,rgba(24,18,18,.72)_48%,rgba(24,18,18,.28)_100%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(24,18,18,.55)_0%,transparent_60%)]" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-9 max-w-3xl space-y-5 sm:mb-11">
                  <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-200">
                      <span className="h-px w-8 bg-rose-200/80" />
                      <span>Salonique · New York</span>
                  </div>

                  <h1 className="max-w-3xl text-[clamp(2.75rem,8vw,5.75rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-white">
                      A little time{" "}
                      <span className="font-serif font-normal italic text-rose-200">
                          just for you.
                      </span>
                  </h1>

                  <p className="max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
                      Find a salon or specialist in your neighborhood, compare
                      services and prices, then book when it suits you.
                  </p>
              </div>

              <div className="max-w-5xl" ref={containerRef}>
                  <form
                      onSubmit={handleSearch}
                      className="relative z-30 flex flex-col items-stretch divide-y divide-neutral-100 rounded-2xl border border-white/70 bg-white p-2.5 shadow-2xl shadow-black/15 md:flex-row md:items-center md:divide-x md:divide-y-0"
                  >
                      {/* 1. Service / Treatment Field */}
                      <div className="relative flex-1 px-4 py-2.5 md:py-1">
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-0.5">
                              Service / Treatment
                          </label>
                          <div className="flex items-center gap-2">
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
                                  className="h-auto rounded-none border-0 bg-transparent px-0 py-0 text-sm font-semibold text-neutral-900 shadow-none placeholder:font-normal placeholder:text-neutral-400 focus-visible:ring-0"
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
                              <div className="absolute top-full left-0 mt-3 w-full sm:w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-neutral-100 p-3 z-50 animate-fade-in">
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
                      <div className="relative flex-1 px-4 py-2.5 md:py-1">
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-0.5">
                              Location
                          </label>
                          <div
                              onClick={() => {
                                  setLocationOpen(!locationOpen);
                                  setQueryOpen(false);
                                  setDateTimeOpen(false);
                              }}
                              className="flex items-center gap-2 cursor-pointer"
                          >
                              <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
                              <Input
                                  type="text"
                                  value={location}
                                  onChange={(e) => setLocation(e.target.value)}
                                  placeholder="Where? (e.g. SoHo, New York)"
                                  className="h-auto rounded-none border-0 bg-transparent px-0 py-0 text-sm font-semibold text-neutral-900 shadow-none placeholder:font-normal placeholder:text-neutral-400 focus-visible:ring-0"
                              />
                              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                          </div>

                          {/* Location Dropdown */}
                          {locationOpen && (
                              <div className="absolute top-full left-0 mt-3 w-full sm:w-72 bg-white rounded-2xl shadow-2xl border border-neutral-100 p-2.5 z-50 animate-fade-in">
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
                      <div className="relative flex-1 px-4 py-2.5 md:py-1">
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-0.5">
                              Date & Time
                          </label>
                          <div
                              onClick={() => {
                                  setDateTimeOpen(!dateTimeOpen);
                                  setQueryOpen(false);
                                  setLocationOpen(false);
                              }}
                              className="flex items-center gap-2 cursor-pointer"
                          >
                              <CalendarIcon className="w-4 h-4 text-neutral-400 shrink-0" />
                              <span className="text-sm font-semibold text-neutral-900 truncate">
                                  {selectedDate
                                      ? `${selectedDate} • ${selectedTime}`
                                      : "Any date • Any time"}
                              </span>
                              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 shrink-0 ml-auto" />
                          </div>

                          {/* Date & Time Picker Dropdown */}
                          {dateTimeOpen && (
                              <div className="absolute top-full right-0 mt-3 w-full sm:w-80 bg-white rounded-2xl shadow-2xl border border-neutral-100 p-4 z-50 animate-fade-in">
                                  <div className="space-y-4">
                                      <div>
                                          <label className="block text-xs font-bold text-neutral-700 uppercase mb-2">
                                              Select Appointment Date
                                          </label>
                                          <Input
                                              type="date"
                                              value={selectedDate}
                                              onChange={(e) =>
                                                  setSelectedDate(
                                                      e.target.value,
                                                  )
                                              }
                                              min={
                                                  new Date()
                                                      .toISOString()
                                                      .split("T")[0]
                                              }
                                              className="h-10 w-full rounded-xl px-3 text-sm font-medium"
                                          />
                                      </div>

                                      <div>
                                          <label className="block text-xs font-bold text-neutral-700 uppercase mb-2">
                                              Preferred Time Slot
                                          </label>
                                          <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto">
                                              {TIME_SLOTS.map((time) => (
                                                  <Button
                                                      variant={selectedTime === time ? "default" : "outline"}
                                                      size="sm"
                                                      key={time}
                                                      type="button"
                                                      onClick={() =>
                                                          setSelectedTime(time)
                                                      }
                                                      className="h-8 w-full justify-start truncate px-2.5 text-left text-xs"
                                                  >
                                                      {time}
                                                  </Button>
                                              ))}
                                          </div>
                                      </div>

                                      <div className="pt-2 border-t border-neutral-100 flex justify-between items-center">
                                          <Button
                                              variant="ghost"
                                              size="sm"
                                              type="button"
                                              onClick={() => {
                                                  setSelectedDate("");
                                                  setSelectedTime("Any time");
                                              }}
                                              className="h-8 text-xs font-semibold text-neutral-500 hover:text-neutral-900"
                                          >
                                              Reset
                                          </Button>
                                          <Button
                                              size="sm"
                                              type="button"
                                              onClick={() =>
                                                  setDateTimeOpen(false)
                                              }
                                              className="h-8 rounded-full px-4 text-xs font-semibold"
                                          >
                                              Apply
                                          </Button>
                                      </div>
                                  </div>
                              </div>
                          )}
                      </div>

                      {/* Primary Search CTA Button */}
                      <div className="p-1 md:p-0">
                          <Button
                              size="lg"
                              type="submit"
                              className="h-12 w-full rounded-xl px-6 text-sm font-bold shadow-md hover:shadow-lg md:w-auto md:rounded-full"
                          >
                              <Search className="w-4 h-4 stroke-[2.5]" />
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
                          onClick={() => router.push("/services?category=Hair")}
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
                              router.push("/services?category=Brows %26 Lashes")
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

