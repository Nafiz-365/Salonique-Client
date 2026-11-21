"use client";

import type { ElementType } from "react";
import Link from "next/link";
import { Scissors, Sparkles, Smile, HeartPulse, Palette } from "lucide-react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface CategoryItem {
  name: string;
  count: string;
  icon: ElementType;
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
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Carousel opts={{ align: "start" }} aria-label="Popular service categories">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl">
                Popular Categories
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                Select a service category to discover top-rated professionals in your city
              </p>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <CarouselPrevious
                aria-label="Previous categories"
                className="static inset-auto m-0 size-9 shadow-xs"
              />
              <CarouselNext
                aria-label="Next categories"
                className="static inset-auto m-0 size-9 shadow-xs"
              />
            </div>
          </div>

          <CarouselContent className="items-start py-1">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <CarouselItem key={cat.name} className="basis-36 sm:basis-44">
                  <Link
                    href={`/services?category=${cat.slug}`}
                    className="group flex w-full flex-col items-center text-center transition-transform hover:-translate-y-1"
                  >
                    <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-2xl border border-neutral-100 shadow-sm transition-all group-hover:shadow-md">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        width={400}
                        height={400}
                        unoptimized
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center gap-1.5 text-white">
                        <div className="flex size-6 items-center justify-center rounded-full bg-white/20 backdrop-blur-xs">
                          <Icon className="size-3.5 text-white" />
                        </div>
                        <span className="truncate text-xs font-semibold drop-shadow-xs">
                          {cat.name}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-neutral-900 group-hover:text-black">
                      {cat.name}
                    </span>
                    <span className="text-[11px] text-neutral-500">{cat.count}</span>
                  </Link>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}

