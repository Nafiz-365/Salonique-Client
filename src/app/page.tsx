import { Footer } from "@/components/common/Footer";
import { Navbar } from "@/components/common/Navbar";
import { CategoryCarousel } from "@/components/home/CategoryCarousel";
import { FeaturedServices } from "@/components/home/FeaturedServices";
import { HeroSearch } from "@/components/home/HeroSearch";
import { TrustSection } from "@/components/home/TrustSection";
import {
    createPageMetadata,
    HOME_DESCRIPTION,
    HOME_TITLE,
    siteUrl,
} from "@/lib/site-config";

export const metadata = createPageMetadata(HOME_TITLE, HOME_DESCRIPTION, "/");

const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Salonique",
    url: siteUrl.toString(),
    description: HOME_DESCRIPTION,
    potentialAction: {
        "@type": "SearchAction",
        target: new URL("/services?q={search_term_string}", siteUrl).toString(),
        "query-input": "required name=search_term_string",
    },
};

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(websiteStructuredData).replace(
                        /</g,
                        "\\u003c",
                    ),
                }}
            />
            <Navbar />
            <main className="flex-1">
                <HeroSearch />
                <CategoryCarousel />
                <FeaturedServices />
                <TrustSection />
            </main>
            <Footer />
        </div>
    );
}
