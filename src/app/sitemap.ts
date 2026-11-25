import type { MetadataRoute } from "next";
import { fetchServices } from "@/lib/server-api";
import { siteUrl } from "@/lib/site-config";

const publicRoutes = ["/", "/services", "/help", "/privacy", "/terms"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const firstPage = await fetchServices({ page: 1, limit: 100 });
    const servicePages: typeof firstPage.services = [];

    for (let page = 2; page <= firstPage.totalPages; page += 1) {
        const nextPage = await fetchServices({ page, limit: 100 });
        servicePages.push(...nextPage.services);
    }

    const services = [...firstPage.services, ...servicePages].filter(
        (service) => service.isActive,
    );

    return [
        ...publicRoutes.map((route) => ({
            url: new URL(route, siteUrl).toString(),
        })),
        ...services.map((service) => ({
            url: new URL(
                `/services/${encodeURIComponent(service._id)}`,
                siteUrl,
            ).toString(),
        })),
    ];
}
