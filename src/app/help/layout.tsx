import { createPageMetadata } from "@/lib/site-config";

export const metadata = createPageMetadata(
    "Help & Booking FAQs",
    "Get answers about Salonique appointments, payments, cancellations, and using the salon services marketplace.",
    "/help",
);

export default function HelpLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}
