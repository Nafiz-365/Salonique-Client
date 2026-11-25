import { createPageMetadata } from "@/lib/site-config";

export const metadata = createPageMetadata(
    "Browse Salon & Beauty Services",
    "Browse salon, hair, nail, skincare, and wellness services in New York. Compare treatments by category, price, location, and availability.",
    "/services",
);

export default function ServicesLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}
