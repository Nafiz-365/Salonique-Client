import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceDetailClient from "./ServiceDetailClient";
import { fetchService } from "@/lib/server-api";
import { mapApiServiceToService } from "@/lib/service";
import { createPageMetadata } from "@/lib/site-config";
import type { Service } from "@/lib/types";

type ServiceResult =
    | { kind: "service"; service: Service }
    | { kind: "missing" }
    | { kind: "error"; message: string };

const getService = cache(async (id: string): Promise<ServiceResult> => {
    try {
        const apiService = await fetchService(id);
        if (!apiService || !apiService.isActive) {
            return { kind: "missing" };
        }

        return {
            kind: "service",
            service: mapApiServiceToService(apiService),
        };
    } catch (error) {
        console.error("Failed to load public service details:", error);
        return {
            kind: "error",
            message: "Unable to load this service right now. Please try again.",
        };
    }
});

function getUnavailableMetadata(id: string): Metadata {
    return {
        ...createPageMetadata(
            "Service unavailable",
            "This salon service is currently unavailable.",
            `/services/${encodeURIComponent(id)}`,
        ),
        robots: {
            index: false,
            follow: false,
        },
    };
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const result = await getService(id);
    if (result.kind !== "service") return getUnavailableMetadata(id);

    const service = result.service;
    const title = service.location
        ? `${service.name} in ${service.location}`
        : service.name;
    const description = (
        service.shortDescription.trim() ||
        service.description.trim() ||
        `Explore ${service.name} at Salonique.`
    )
        .replace(/\s+/g, " ")
        .slice(0, 160);
    const metadata = createPageMetadata(
        title,
        description,
        `/services/${encodeURIComponent(id)}`,
    );
    const image =
        service.image.startsWith("http") ? service.image : "/opengraph-image";

    return {
        ...metadata,
        openGraph: {
            ...metadata.openGraph,
            images: [image],
        },
        twitter: {
            ...metadata.twitter,
            images: [image],
        },
    };
}

export default async function ServiceDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const result = await getService(id);
    if (result.kind === "missing") notFound();

    return (
        <ServiceDetailClient
            key={id}
            id={id}
            initialService={result.kind === "service" ? result.service : null}
            serviceError={result.kind === "error" ? result.message : null}
        />
    );
}
