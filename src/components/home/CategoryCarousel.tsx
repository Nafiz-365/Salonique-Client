"use client";

import React, { useRef } from "react";
import Link from "next/link";
import {
  Scissors,
  Sparkles,
  Smile,
  HeartPulse,
  Palette,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";

interface CategoryItem {
  name: string;
  count: string;
  icon: React.ElementType;
  image: string;
  slug: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    name: "Haircut & Styling",
    count: "42+ salons",
    icon: Scissors,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80",
    slug: "Hair",
  },
  {
    name: "Hair Coloring",
    count: "29+ colorists",
    icon: Palette,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
    slug: "Hair",
  },
  {
    name: "Hair Treatment",
    count: "21+ specialists",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80",
    slug: "Hair",
  },
  {
    name: "Facial & Skincare",
    count: "28+ clinics",
    icon: Smile,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80",
    slug: "Facial",
  },
  {
    name: "Manicure & Pedicure",
    count: "35+ studios",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80",
    slug: "Nails",
  },
  {
    name: "Makeup",
    count: "19+ artists",
    icon: Palette,
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80",
    slug: "Makeup",
  },
  {
    name: "Spa & Massage",
    count: "30+ spas",
    icon: HeartPulse,
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80",
    slug: "Massage",
  },
];

export function CategoryCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -320 : 320;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Popular Categories
            </h2>
            <p className="text-neutral-500 text-sm mt-1">
              Select a service category to discover top-rated professionals in your city
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="w-9 h-9 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 hover:border-neutral-300 transition-colors shadow-xs"
              aria-label="Previous categories"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="w-9 h-9 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 hover:border-neutral-300 transition-colors shadow-xs"
              aria-label="Next categories"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex items-center gap-4 overflow-x-auto pb-4 pt-1 hide-scrollbar scroll-smooth"
        >
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
                <Link
                    key={cat.name}
                    href={`/services?category=${cat.slug}`}
                    className="group shrink-0 flex flex-col items-center w-36 sm:w-44 text-center transition-transform hover:-translate-y-1"
                >
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-3 border border-neutral-100 shadow-sm group-hover:shadow-md transition-all">
                        <Image
                            src={cat.image}
                            alt={cat.name}
                            width={400}
                            height={400}
                            unoptimized
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center gap-1.5 text-white">
                            <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center">
                                <Icon className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="text-xs font-semibold drop-shadow-xs truncate">
                                {cat.name}
                            </span>
                        </div>
                    </div>
                    <span className="text-sm font-bold text-neutral-900 group-hover:text-black">
                        {cat.name}
                    </span>
                    <span className="text-[11px] text-neutral-500">
                        {cat.count}
                    </span>
                </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

