"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Calendar as CalendarIcon,
  Sparkles,
  ChevronDown,
  X,
  Check,
  ArrowRight,
} from "lucide-react";
import { fetchServices } from "@/lib/server-api";
import Image from "next/image";

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
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden bg-neutral-900 text-white">
          {/* Salon-Themed Background Image with Soft Dark/Light Overlay */}
          <div className="absolute inset-0 z-0">
              <Image
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=2000&q=80"
                  alt="Luxury Salon Interior"
                  width={2000}
                  height={1000}
                  unoptimized
                  className="w-full h-full object-cover opacity-25 filter brightness-75 contrast-125"
              />
              <div className="absolute inset-0 bg-linear-to-b from-neutral-950/80 via-neutral-900/90 to-neutral-950" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Hero Header */}
              <div className="text-center max-w-3xl mx-auto space-y-5 mb-10 md:mb-12">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold tracking-wide uppercase backdrop-blur-xs border border-white/10">
                      <Sparkles className="w-3.5 h-3.5 text-rose-300" />
                      <span>Discover Top-Rated Salons & Stylists</span>
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                      Book your next beauty and wellness experience
                  </h1>

                  <p className="text-lg sm:text-xl text-neutral-300 font-normal max-w-2xl mx-auto leading-relaxed">
                      Discover exceptional salon services and book your next
                      appointment with ease.
                  </p>

                  {/* CTA Button: Explore Salon Services */}
                  <div className="pt-2">
                      <button
                          type="button"
                          onClick={() => router.push("/services")}
                          className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white text-neutral-950 hover:bg-neutral-100 font-extrabold text-sm shadow-xl hover:scale-105 transition-all"
                      >
                          <span>Explore Salon Services</span>
                          <ArrowRight className="w-4 h-4 text-neutral-900" />
                      </button>
                  </div>
              </div>

              {/* Fresha-Style Search Container */}
              <div className="max-w-4xl mx-auto" ref={containerRef}>
                  <form
                      onSubmit={handleSearch}
                      className="bg-white rounded-2xl md:rounded-full p-2.5 md:p-2 border border-neutral-200/90 shadow-xl shadow-neutral-200/50 flex flex-col md:flex-row items-stretch md:items-center divide-y md:divide-y-0 md:divide-x divide-neutral-100 relative z-30"
                  >
                      {/* 1. Service / Treatment Field */}
                      <div className="relative flex-1 px-4 py-2.5 md:py-1">
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-0.5">
                              Service / Treatment
                          </label>
                          <div className="flex items-center gap-2">
                              <Search className="w-4 h-4 text-neutral-400 shrink-0" />
                              <input
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
                                  className="w-full text-sm font-semibold text-neutral-900 placeholder:text-neutral-400 placeholder:font-normal bg-transparent focus:outline-none"
                              />
                              {query && (
                                  <button
                                      type="button"
                                      onClick={() => setQuery("")}
                                      className="p-1 text-neutral-400 hover:text-neutral-600 rounded-full"
                                  >
                                      <X className="w-3.5 h-3.5" />
                                  </button>
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
                                          <button
                                              key={item.id}
                                              type="button"
                                              onClick={() => {
                                                  setQuery(item.name);
                                                  setQueryOpen(false);
                                              }}
                                              className="w-full text-left px-2.5 py-2 rounded-xl text-sm font-medium hover:bg-neutral-100 flex items-center justify-between group transition-colors"
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
                                          </button>
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
                              <input
                                  type="text"
                                  value={location}
                                  onChange={(e) => setLocation(e.target.value)}
                                  placeholder="Where? (e.g. SoHo, New York)"
                                  className="w-full text-sm font-semibold text-neutral-900 placeholder:text-neutral-400 placeholder:font-normal bg-transparent focus:outline-none"
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
                                          <button
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
                                              className="w-full text-left px-2.5 py-1.5 rounded-xl text-sm font-medium text-neutral-800 hover:bg-neutral-100 flex items-center justify-between"
                                          >
                                              <span>{loc}</span>
                                              {location === loc && (
                                                  <Check className="w-4 h-4 text-neutral-900" />
                                              )}
                                          </button>
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
                                          <input
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
                                              className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-neutral-900"
                                          />
                                      </div>

                                      <div>
                                          <label className="block text-xs font-bold text-neutral-700 uppercase mb-2">
                                              Preferred Time Slot
                                          </label>
                                          <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto">
                                              {TIME_SLOTS.map((time) => (
                                                  <button
                                                      key={time}
                                                      type="button"
                                                      onClick={() =>
                                                          setSelectedTime(time)
                                                      }
                                                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left truncate transition-colors ${
                                                          selectedTime === time
                                                              ? "bg-neutral-900 text-white font-semibold"
                                                              : "bg-neutral-50 hover:bg-neutral-100 text-neutral-800"
                                                      }`}
                                                  >
                                                      {time}
                                                  </button>
                                              ))}
                                          </div>
                                      </div>

                                      <div className="pt-2 border-t border-neutral-100 flex justify-between items-center">
                                          <button
                                              type="button"
                                              onClick={() => {
                                                  setSelectedDate("");
                                                  setSelectedTime("Any time");
                                              }}
                                              className="text-xs font-semibold text-neutral-500 hover:text-neutral-900"
                                          >
                                              Reset
                                          </button>
                                          <button
                                              type="button"
                                              onClick={() =>
                                                  setDateTimeOpen(false)
                                              }
                                              className="px-3.5 py-1.5 rounded-full bg-neutral-900 text-white text-xs font-semibold hover:bg-black"
                                          >
                                              Apply
                                          </button>
                                      </div>
                                  </div>
                              </div>
                          )}
                      </div>

                      {/* Primary Search CTA Button */}
                      <div className="p-1 md:p-0">
                          <button
                              type="submit"
                              className="w-full md:w-auto h-12 md:h-12 px-6 rounded-xl md:rounded-full bg-neutral-900 hover:bg-black text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                          >
                              <Search className="w-4 h-4 stroke-[2.5]" />
                              <span>Search</span>
                          </button>
                      </div>
                  </form>

                  {/* Quick Trending Searches */}
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-neutral-500">
                      <span className="font-semibold text-neutral-700">
                          Trending:
                      </span>
                      <button
                          type="button"
                          onClick={() => router.push("/services?category=Hair")}
                          className="px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                      >
                          Balayage
                      </button>
                      <button
                          type="button"
                          onClick={() =>
                              router.push("/services?category=Nails")
                          }
                          className="px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                      >
                          Russian Manicure
                      </button>
                      <button
                          type="button"
                          onClick={() =>
                              router.push("/services?category=Facial")
                          }
                          className="px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                      >
                          HydraFacial
                      </button>
                      <button
                          type="button"
                          onClick={() =>
                              router.push("/services?category=Massage")
                          }
                          className="px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                      >
                          Hot Stone
                      </button>
                      <button
                          type="button"
                          onClick={() =>
                              router.push("/services?category=Brows %26 Lashes")
                          }
                          className="px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                      >
                          Lash Lift
                      </button>
                  </div>
              </div>
          </div>
      </section>
  );
}

