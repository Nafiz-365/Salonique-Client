"use client";

import { INITIAL_REVIEWS } from "@/lib/data";
import { Star, CheckCircle2, Quote } from "lucide-react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function ReviewCarousel() {
  return (
    <section className="py-20 bg-neutral-50/70 border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Carousel opts={{ align: "start" }} aria-label="Customer reviews">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <div className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500">
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                <span>4.9 Average Customer Rating</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl">
                Loved by Thousands of Beauty Lovers
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                Read authentic feedback from verified clients who booked through Salonique.
              </p>
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <CarouselPrevious
                aria-label="Previous reviews"
                className="static inset-auto m-0 size-10 bg-white shadow-xs"
              />
              <CarouselNext
                aria-label="Next reviews"
                className="static inset-auto m-0 size-10 bg-white shadow-xs"
              />
            </div>
          </div>

          <CarouselContent className="items-stretch pb-6">
            {INITIAL_REVIEWS.map((review) => (
              <CarouselItem key={review.id} className="basis-full sm:basis-96">
                <div className="flex h-full flex-col justify-between rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs transition-all hover:shadow-md sm:p-7">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="size-4 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>
                      <Quote className="size-6 text-neutral-200" />
                    </div>

                    <p className="text-sm font-normal leading-relaxed text-neutral-700">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-3 border-t border-neutral-100 pt-6">
                    <Image
                      src={review.userAvatar}
                      alt={review.userName}
                      width={40}
                      height={40}
                      unoptimized
                      className="size-10 rounded-full border border-neutral-200 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h4 className="truncate text-sm font-bold text-neutral-900">
                          {review.userName}
                        </h4>
                        {review.verified && (
                          <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600" />
                        )}
                      </div>
                      <p className="truncate text-xs text-neutral-500">
                        Booked {review.serviceName} • {review.date}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}

