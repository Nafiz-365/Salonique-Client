import { Footer } from "@/components/common/Footer";
import { Navbar } from "@/components/common/Navbar";
import { CategoryCarousel } from "@/components/home/CategoryCarousel";
import { FeaturedServices } from "@/components/home/FeaturedServices";
import { HeroSearch } from "@/components/home/HeroSearch";
import { PromoBanner } from "@/components/home/PromoBanner";
import { ReviewCarousel } from "@/components/home/ReviewCarousel";
import { TrustSection } from "@/components/home/TrustSection";

export default function Home() {
  return (
      <div className="flex flex-col min-h-screen bg-white">
          <Navbar />
          <main className="flex-1">
              <HeroSearch />
              <CategoryCarousel />
              <FeaturedServices />
              <TrustSection />
              <ReviewCarousel />
              <PromoBanner />
          </main>
          <Footer />
      </div>
  );
}
