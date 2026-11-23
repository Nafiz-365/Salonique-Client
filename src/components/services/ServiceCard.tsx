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
        <Card className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-[#E8E2D8] bg-white p-0 text-[#1A1715] shadow-xs transition-[border-color,box-shadow] duration-200 hover:border-[#CFC4B4] hover:shadow-md">
            <Link
                href={`/services/${service.id}`}
                className="relative block aspect-3/2 overflow-hidden bg-[#F3F0EB]"
            >
                <Image
                    src={service.image}
                    alt={service.name}
                    width={640}
                    height={400}
                    unoptimized
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                />

                <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
                    <Badge
                        variant="outline"
                        className="h-auto max-w-[70%] truncate rounded-md border-white/70 bg-white/95 px-2 py-1 text-[11px] font-medium text-[#38312A] shadow-xs backdrop-blur-xs"
                    >
                        {service.category}
                    </Badge>
                    {service.featured && (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-[#211C18]/90 px-2 py-1 text-[10px] font-medium text-white">
                            <Sparkles className="size-3 text-[#D8B485]" />
                            Featured
                        </span>
                    )}
                </div>

                <Badge
                    variant="outline"
                    aria-label={`${service.rating.toFixed(1)} out of 5 from ${service.reviewCount} reviews`}
                    className="absolute bottom-3 right-3 h-auto gap-1 rounded-md border-white/70 bg-white/95 px-2 py-1 text-xs font-semibold text-[#1A1715] shadow-xs backdrop-blur-xs"
                >
                    <Star className="size-3.5 fill-[#A77D4B] text-[#A77D4B]" />
                    <span>{service.rating.toFixed(1)}</span>
                    <span className="text-[10px] font-normal text-neutral-500">
                        ({service.reviewCount})
                    </span>
                </Badge>
            </Link>

            <CardContent className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:p-5">
                <div className="min-w-0 flex-1 space-y-2.5">
                    <div className="flex min-w-0 items-center gap-1.5 text-xs font-medium text-neutral-500">
                        <MapPin className="size-3.5 shrink-0 text-[#9E8265]" />
                        <span className="truncate">{service.location}</span>
                    </div>

                    <Link href={`/services/${service.id}`} className="block">
                        <h3 className="line-clamp-2 min-h-12 text-base font-serif font-medium leading-6 text-[#1A1715] transition-colors group-hover:text-[#765A3D] sm:text-lg">
                            {service.name}
                        </h3>
                    </Link>

                    <p className="line-clamp-2 text-sm leading-5 text-neutral-600">
                        {service.shortDescription}
                    </p>
                </div>

                <div className="flex min-w-0 items-center justify-between gap-3 border-t border-[#F0ECE4] pt-3 text-xs text-neutral-500">
                    <div className="flex min-w-0 items-center gap-2">
                        <Image
                            src={service.specialist.avatar}
                            alt={service.specialist.name}
                            width={24}
                            height={24}
                            unoptimized
                            className="size-6 shrink-0 rounded-full border border-[#EBE5DA] object-cover"
                        />
                        <span className="truncate font-medium text-neutral-800">
                            {service.specialist.name}
                        </span>
                    </div>

                    <div className="flex shrink-0 items-center gap-1 font-medium text-neutral-600">
                        <Clock className="size-3.5 text-[#9E8265]" />
                        <span className="whitespace-nowrap">
                            {formatDuration(service.duration)}
                        </span>
                    </div>
                </div>

                <div className="flex min-w-0 items-end justify-between gap-2 pt-0.5">
                    <div className="shrink-0">
                        <span className="block text-[11px] leading-tight text-neutral-500">
                            From
                        </span>
                        <span className="text-lg font-semibold text-[#1A1715]">
                            {formatPrice(service.price)}
                        </span>
                    </div>

                    <div className="flex min-w-0 items-center justify-end gap-1.5 sm:gap-2">
                        {onQuickBook && (
                            <Button
                                variant="outline"
                                size="sm"
                                type="button"
                                onClick={() => onQuickBook(service)}
                                className="h-9 rounded-lg border-[#DAD2C7] px-2.5 text-xs font-medium text-neutral-800 hover:bg-[#F7F3EC] sm:px-3"
                            >
                                Quick Book
                            </Button>
                        )}

                        <Link
                            href={`/services/${service.id}`}
                            className="inline-flex h-9 items-center gap-1 rounded-lg bg-[#1A1715] px-2.5 text-xs font-medium text-white transition-colors hover:bg-[#302922] sm:gap-1.5 sm:px-3"
                        >
                            <span>Details</span>
                            <ArrowRight className="size-3" />
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
