"use client";

import React, { useRef } from "react";
import { INITIAL_REVIEWS } from "@/lib/data";
import { Star, CheckCircle2, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Image from "next/image";

export function ReviewCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -380 : 380;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 bg-neutral-50/70 border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>4.9 Average Customer Rating</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Loved by Thousands of Beauty Lovers
            </h2>
            <p className="text-neutral-500 text-sm mt-1">
              Read authentic feedback from verified clients who booked through Salonique.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 transition-colors shadow-xs"
              aria-label="Previous reviews"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 transition-colors shadow-xs"
              aria-label="Next reviews"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Row */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-6 hide-scrollbar scroll-smooth"
        >
          {INITIAL_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="shrink-0 w-80 sm:w-96 bg-white p-6 sm:p-7 rounded-2xl border border-neutral-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Rating stars & Quote Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-neutral-200" />
                </div>

                {/* Comment */}
                <p className="text-sm text-neutral-700 leading-relaxed font-normal">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              {/* Reviewer info */}
              <div className="pt-6 mt-4 border-t border-neutral-100 flex items-center gap-3">
                <Image
                  src={review.userAvatar}
                  alt={review.userName}
                  width={40}
                  height={40}
                  unoptimized
                  className="w-10 h-10 rounded-full object-cover border border-neutral-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-neutral-900 truncate">
                      {review.userName}
                    </h4>
                    {review.verified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 truncate">
                    Booked {review.serviceName} • {review.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

