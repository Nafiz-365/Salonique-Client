"use client";

import React from "react";
import Link from "next/link";
import { Star, Clock, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { Service } from "@/lib/types";
import { formatPrice, formatDuration } from "@/lib/utils";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ServiceCardProps {
    service: Service;
    onQuickBook?: (service: Service) => void;
}

export function ServiceCard({ service, onQuickBook }: ServiceCardProps) {
    return (
        <Card className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#EBE5DA] bg-[#FFFFFF] p-0 text-[#1A1715] shadow-xs transition-all duration-300 hover:border-[#D8CFBF] hover:shadow-lg">
            {/* Service Image with Category & Rating Badges */}
            <Link
                href={`/services/${service.id}`}
                className="relative block aspect-16/10 overflow-hidden bg-neutral-100"
            >
                <Image
                    src={service.image}
                    alt={service.name}
                    width={640}
                    height={400}
                    unoptimized
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <Badge
                        variant="outline"
                        className="h-auto rounded-full border-transparent bg-[#FFFFFF]/95 px-2.5 py-1 text-xs font-semibold text-[#1A1715] shadow-xs backdrop-blur-xs"
                    >
                        {service.category}
                    </Badge>
                    {service.featured && (
                        <Badge className="h-auto gap-1 rounded-full bg-[#1A1715] px-2.5 py-0.5 text-[11px] font-semibold text-[#FDFBF7] shadow-xs">
                            <Sparkles className="w-3 h-3 text-[#D8B485]" />
                            Featured
                        </Badge>
                    )}
                </div>

                {/* Rating Badge */}
                <Badge
                    variant="outline"
                    className="absolute bottom-3 right-3 h-auto gap-1 rounded-full border-transparent bg-[#FFFFFF]/95 px-2.5 py-1 text-xs font-semibold text-[#1A1715] shadow-xs backdrop-blur-xs"
                >
                    <Star className="w-3.5 h-3.5 fill-[#D8B485] text-[#D8B485]" />
                    <span>{service.rating.toFixed(1)}</span>
                    <span className="text-[10px] text-neutral-500 font-normal">
                        ({service.reviewCount})
                    </span>
                </Badge>
            </Link>

            {/* Card Body */}
            <CardContent className="flex flex-1 flex-col justify-between space-y-4 p-4 sm:p-5">
                <div className="space-y-2">
                    {/* Location */}
                    <div className="flex items-center gap-1 text-xs text-neutral-500 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#9E8265]" />
                        <span className="truncate">{service.location}</span>
                    </div>

                    {/* Title */}
                    <Link href={`/services/${service.id}`} className="block">
                        <h3 className="text-base sm:text-lg font-serif font-medium text-[#1A1715] group-hover:text-[#7A5C3E] line-clamp-1 transition-colors">
                            {service.name}
                        </h3>
                    </Link>

                    {/* Short Description */}
                    <p className="text-xs sm:text-sm text-neutral-600 font-light line-clamp-2 leading-relaxed">
                        {service.shortDescription}
                    </p>
                </div>

                {/* Specialist & Meta */}
                <div className="pt-2 border-t border-[#F0ECE4] flex items-center justify-between text-xs text-neutral-500">
                    <div className="flex items-center gap-2">
                        <Image
                            src={service.specialist.avatar}
                            alt={service.specialist.name}
                            width={24}
                            height={24}
                            unoptimized
                            className="w-6 h-6 rounded-full object-cover border border-[#EBE5DA]"
                        />
                        <span className="truncate max-w-30 font-medium text-neutral-800">
                            {service.specialist.name}
                        </span>
                    </div>

                    <div className="flex items-center gap-1 text-neutral-600 font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#9E8265]" />
                        <span>{formatDuration(service.duration)}</span>
                    </div>
                </div>

                {/* Footer: Price & CTA */}
                <div className="pt-1 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <span className="text-xs text-neutral-500 block leading-tight font-light">
                            from
                        </span>
                        <span className="text-lg font-serif font-semibold text-[#1A1715]">
                            {formatPrice(service.price)}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {onQuickBook && (
                            <Button
                                variant="outline"
                                size="sm"
                                type="button"
                                onClick={() => onQuickBook(service)}
                                className="h-8 rounded-full border-[#E0D8CB] hover:bg-[#F7F3EC] px-3 text-xs font-medium text-neutral-800"
                            >
                                Quick Book
                            </Button>
                        )}

                        <Link
                            href={`/services/${service.id}`}
                            className="px-4 py-2 rounded-full bg-[#1A1715] hover:bg-[#2D2623] text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
                        >
                            <span>View Details</span>
                            <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
