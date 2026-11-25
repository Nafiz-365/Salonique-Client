import type { Metadata } from "next";

const configuredSiteUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const siteUrl = new URL(configuredSiteUrl);
export const SITE_NAME = "Salonique";
export const SITE_DEFAULT_TITLE = "Salonique | Salon & Beauty Services";
export const SITE_DESCRIPTION =
    "Discover salon, hair, nail, skincare, and wellness services in New York. Compare treatments and request your next appointment with Salonique.";
export const HOME_TITLE = "Salon & Beauty Appointments in New York";
export const HOME_DESCRIPTION =
    "Find salon, hair, nail, skincare, and wellness services across New York. Explore treatments and request an appointment with Salonique.";

export function createPageMetadata(
    title: string,
    description: string,
    canonical: string,
): Metadata {
    return {
        title,
        description,
        alternates: {
            canonical,
        },
        openGraph: {
            type: "website",
            siteName: SITE_NAME,
            title,
            description,
            url: canonical,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ["/opengraph-image"],
        },
    };
}
