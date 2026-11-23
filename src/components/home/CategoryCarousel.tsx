"use client";

import Link from "next/link";
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
    image: string;
    slug: string;
}

const CATEGORIES: CategoryItem[] = [
    {
        name: "Haircut & Styling",
        image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80",
        slug: "Hair",
    },
    {
        name: "Hair Coloring",
        image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
        slug: "Hair",
    },
    {
        name: "Hair Treatment",
        image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80",
        slug: "Hair",
    },
    {
        name: "Facial & Skincare",
        image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80",
        slug: "Facial",
    },
    {
        name: "Manicure & Pedicure",
        image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80",
        slug: "Nails",
    },
    {
        name: "Makeup",
        image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80",
        slug: "Makeup",
    },
    {
        name: "Spa & Massage",
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80",
        slug: "Massage",
    },
];

export function CategoryCarousel() {
    return (
        <section className="py-14 bg-[#FDFBF7]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Carousel
                    opts={{ align: "start" }}
                    aria-label="Popular service categories"
                >
                    <div className="mb-8 flex items-end justify-between">
                        <div>
                            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9E8265]">
                                Curated Collections
                            </div>
                            <h2 className="text-2xl font-serif font-normal tracking-tight text-[#1A1715] sm:text-3xl">
                                Explore by treatment
                            </h2>
                            <p className="mt-1 text-sm text-neutral-600 font-light">
                                Browse services by the kind of care you are
                                looking for.
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
                        {CATEGORIES.map((cat) => (
                            <CarouselItem
                                key={cat.name}
                                className="basis-36 sm:basis-44"
                            >
                                <Link
                                    href={`/services?category=${cat.slug}`}
                                    className="group flex w-full flex-col text-left"
                                >
                                    <div className="relative mb-3 aspect-4/3 w-full overflow-hidden rounded-xl bg-neutral-100">
                                        <Image
                                            src={cat.image}
                                            alt={cat.name}
                                            width={400}
                                            height={400}
                                            unoptimized
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-neutral-900 group-hover:text-[#8f5655]">
                                        {cat.name}
                                    </span>
                                </Link>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </section>
    );
}
