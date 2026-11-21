"use client";

import React from "react";
import Link from "next/link";
import { Star, Clock, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { Service } from "@/lib/types";
import { formatPrice, formatDuration } from "@/lib/utils";

interface ServiceCardProps {
  service: Service;
  onQuickBook?: (service: Service) => void;
}

export function ServiceCard({ service, onQuickBook }: ServiceCardProps) {
  return (
    <div className="group bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-neutral-300 transition-all duration-300 flex flex-col h-full">
      {/* Service Image with Category & Rating Badges */}
      <Link href={`/services/${service.id}`} className="relative block aspect-[16/10] overflow-hidden bg-neutral-100">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-xs text-neutral-900 shadow-xs">
            {service.category}
          </span>
          {service.featured && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-neutral-900 text-white flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3 h-3 text-rose-300" />
              Featured
            </span>
          )}
        </div>

        {/* Rating Badge */}
        <div className="absolute bottom-3 right-3 px-2 py-1 rounded-full bg-white/95 backdrop-blur-xs text-neutral-900 text-xs font-bold flex items-center gap-1 shadow-xs">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{service.rating.toFixed(1)}</span>
          <span className="text-[10px] text-neutral-500 font-normal">
            ({service.reviewCount})
          </span>
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-neutral-500 font-medium">
            <MapPin className="w-3.5 h-3.5 text-neutral-400" />
            <span className="truncate">{service.location}</span>
          </div>

          {/* Title */}
          <Link href={`/services/${service.id}`} className="block">
            <h3 className="text-base sm:text-lg font-bold text-neutral-900 group-hover:text-black line-clamp-1 transition-colors">
              {service.name}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-neutral-500 line-clamp-2 leading-relaxed">
            {service.shortDescription}
          </p>
        </div>

        {/* Specialist & Meta */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <img
              src={service.specialist.avatar}
              alt={service.specialist.name}
              className="w-6 h-6 rounded-full object-cover border border-neutral-200"
            />
            <span className="truncate max-w-[120px] font-medium text-neutral-700">
              {service.specialist.name}
            </span>
          </div>

          <div className="flex items-center gap-1 text-neutral-600 font-medium">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            <span>{formatDuration(service.duration)}</span>
          </div>
        </div>

        {/* Footer: Price & CTA */}
        <div className="pt-1 flex items-center justify-between gap-3">
          <div>
            <span className="text-xs text-neutral-500 block leading-tight">from</span>
            <span className="text-lg font-extrabold text-neutral-900">
              {formatPrice(service.price)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onQuickBook && (
              <button
                type="button"
                onClick={() => onQuickBook(service)}
                className="px-3 py-2 rounded-xl text-xs font-semibold border border-neutral-200 hover:bg-neutral-50 text-neutral-800 transition-colors"
              >
                Quick Book
              </button>
            )}

            <Link
              href={`/services/${service.id}`}
              className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <span>View Details</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

